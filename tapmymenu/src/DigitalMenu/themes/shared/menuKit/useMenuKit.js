import { useCallback, useMemo, useRef, useState } from "react";
import usePanelScrollLock from "../hooks/usePanelScrollLock";
import { useAnalytics } from "../../../core/Analytics";
import { getLocaleCookie } from "../../../core/cookieUtils";
import useOriginalMenu from "./hooks/useOriginalMenu";
import useHashNavigation from "./hooks/useHashNavigation";
import useScrollSpy from "./hooks/useScrollSpy";
import useBackToClose from "./hooks/useBackToClose";
import { buildCategoryTree, countItems, makeDishResolver, nodePathMap } from "./menuData";

// Everything a menuKit theme needs that ISN'T its look: the category tree
// (with the translated-menu fixes), the original-language pairing,
// hash navigation, scroll-spy, the dish sheet + drawer state with
// back-gesture closing, analytics and the YummGPT item hook.
//
// A theme calls this once with its props and renders however it likes.
// Section anchors must carry data-mk-path={path} (see menuData
// nodePathMap) and the theme root must get ref={kit.rootRef}.
export default function useMenuKit(
  { urlname, status, config, categories, itemsByCategory },
  { getStrings }
) {
  const track = useAnalytics();
  const locale = useMemo(() => getLocaleCookie(), []);
  const strings = getStrings(locale);
  const rootRef = useRef(null);
  const ready = status === "ready";

  const originalMenu = useOriginalMenu(urlname, locale, ready);
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf } = useMemo(
    () => buildCategoryTree(config.category_order, categories, itemsByCategory, locale, originalMenu),
    [config.category_order, categories, itemsByCategory, locale, originalMenu]
  );
  const pathMap = useMemo(() => nodePathMap(nodes), [nodes]);
  const itemCount = useMemo(
    () => nodes.reduce((sum, n) => sum + countItems(n, itemsByLabel), 0),
    [nodes, itemsByLabel]
  );

  // A dish opened from YummGPT resolves to the same display item (cleaned
  // name + original) as one tapped in the menu; see makeDishResolver.
  const resolveDish = useMemo(() => makeDishResolver(itemsByLabel), [itemsByLabel]);

  // --- layers -----------------------------------------------------------
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [focusContacts, setFocusContacts] = useState(false);
  const drawerSkipBack = useRef(false);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  usePanelScrollLock(modalOpen || drawerOpen);
  useBackToClose(modalOpen, closeModal, null);
  useBackToClose(drawerOpen, closeDrawer, drawerSkipBack);

  // --- navigation -------------------------------------------------------
  const spy = useScrollSpy({ rootRef, nodes, enabled: ready });
  const { lock } = spy;
  const { goTo, scrollToPath } = useHashNavigation({ ready, pathMap, rootRef, onLand: lock });

  const trackCategory = useCallback(
    (path) => {
      const entry = pathMap.get(path);
      if (entry) track("category_click", `${urlname}/${entry.node.label}`);
    },
    [pathMap, track, urlname]
  );

  // Any category tap: tab (top-level index), chip or in-page link (path).
  const selectPath = useCallback(
    (path) => {
      const p = String(path);
      trackCategory(p);
      goTo(p);
    },
    [goTo, trackCategory]
  );

  // From the drawer: its own history entry is REPLACED by the category's,
  // so back then returns to where the guest was before opening it.
  const selectFromDrawer = useCallback(
    (path) => {
      trackCategory(path);
      drawerSkipBack.current = true;
      setDrawerOpen(false);
      goTo(path, { replace: true });
    },
    [goTo, trackCategory]
  );

  const openMenu = useCallback(() => {
    setFocusContacts(false);
    setDrawerOpen(true);
  }, []);
  const openInfo = useCallback(() => {
    setFocusContacts(true);
    setDrawerOpen(true);
  }, []);

  // item_click for a dish a theme opens its own way (e.g. a feed).
  const trackItem = useCallback(
    (item) => {
      const shown = resolveDish(item);
      track("item_click", `${urlname}/${shown.slug ?? shown.name}`);
    },
    [resolveDish, track, urlname]
  );

  const selectItem = useCallback(
    (item) => {
      if (!item) return;
      const shown = resolveDish(item);
      trackItem(shown);
      setSelectedItem(shown);
      setModalOpen(true);
    },
    [resolveDish, trackItem]
  );

  const scrollTop = useCallback(() => scrollToPath(null, true), [scrollToPath]);

  return {
    urlname,
    status,
    ready,
    locale,
    strings,
    rootRef,
    nodes,
    itemsByLabel,
    originalLabelOf,
    iconKeyOf,
    pathMap,
    itemCount,
    activeTop: spy.activeTop,
    activeSub: spy.activeSub,
    pastHero: spy.pastHero,
    selectPath,
    selectFromDrawer,
    trackItem,
    trackCategory,
    openMenu,
    openInfo,
    scrollTop,
    selectItem,
    selectedItem,
    modalOpen,
    closeModal,
    drawerOpen,
    closeDrawer,
    focusContacts,
  };
}
