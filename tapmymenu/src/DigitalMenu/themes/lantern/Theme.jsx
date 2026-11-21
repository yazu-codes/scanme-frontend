import React, { useCallback, useMemo, useRef, useState } from "react";
import "./lantern-theme.css";

import useBodyBackgroundSync from "../shared/hooks/useBodyBackgroundSync";
import usePanelScrollLock from "../shared/hooks/usePanelScrollLock";
import useGoogleFont from "../shared/hooks/useGoogleFont";

import useThemeVars from "./useThemeVars";
import useOriginalMenu from "./hooks/useOriginalMenu";
import useHashNavigation from "./hooks/useHashNavigation";
import useScrollSpy from "./hooks/useScrollSpy";
import useBackToClose from "./hooks/useBackToClose";
import getStrings from "./strings";
import { buildCategoryTree, countItems, nodePathMap, pairKey } from "./utils";

import Hero from "./components/Hero";
import ActionBar from "./components/ActionBar";
import PinnedNav from "./components/PinnedNav";
import Section from "./components/Section";
import DishModal from "./components/DishModal";
import NavDrawer from "./components/NavDrawer";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { LanternOrnament } from "./components/Ornaments";

import MenuChatWidget from "../../core/MenuChatWidget";
import QRCodeWidget from "../../core/QRWidget";
import LocaleWidget from "../../core/LocaleWidget";
import { useAnalytics } from "../../core/Analytics";
import { getLocaleCookie } from "../../core/cookieUtils";

// "Lantern": a two-colour poster menu after a classic Chinese-restaurant
// menu design. One long page:
//
//   poster header (emblem, huge name, slogan)
//   framed action row + big category tabs  -> pin to the top on scroll,
//                                             with a sub-category chip row
//   one colour band per top-level category, alternating owner palette /
//   owner palette inverted; photo cards or compact text rows
//   footer with contacts
//
// Tap a dish -> detail sheet. ☰ -> the whole category tree. Every
// category tap is mirrored to #c-<path>, so back and shared links work.
// Purely presentational: every prop comes from core/useDigitalMenu.
export default function LanternTheme({ urlname, status, owner, config, categories, itemsByCategory }) {
  const track = useAnalytics();
  const locale = useMemo(() => getLocaleCookie(), []);
  const strings = getStrings(locale);
  const rootRef = useRef(null);

  // OWNER font and colours drive everything (see useThemeVars.js).
  const font = useGoogleFont(config.font_family);
  const { vars, accent } = useThemeVars({ config, font });
  useBodyBackgroundSync(vars["--ln-a-bg"]);

  const ready = status === "ready";
  const originalMenu = useOriginalMenu(urlname, locale, ready);
  const { nodes, itemsByLabel, originalLabelOf } = useMemo(
    () => buildCategoryTree(config.category_order, categories, itemsByCategory, locale, originalMenu),
    [config.category_order, categories, itemsByCategory, locale, originalMenu]
  );
  const pathMap = useMemo(() => nodePathMap(nodes), [nodes]);
  const itemCount = useMemo(
    () => nodes.reduce((sum, n) => sum + countItems(n, itemsByLabel), 0),
    [nodes, itemsByLabel]
  );

  // Display-ready items by pairing key, so a dish opened from YummGPT
  // shows the same cleaned name + original as one tapped in the menu.
  const displayByKey = useMemo(() => {
    const m = new Map();
    Object.values(itemsByLabel).forEach((list) => list.forEach((i) => m.set(pairKey(i), i)));
    return m;
  }, [itemsByLabel]);

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

  const handleSelectTop = useCallback(
    (index) => {
      const path = String(index);
      trackCategory(path);
      goTo(path);
    },
    [goTo, trackCategory]
  );

  const handleSelectSub = useCallback(
    (path) => {
      trackCategory(path);
      goTo(path);
    },
    [goTo, trackCategory]
  );

  // From the drawer: the drawer's own history entry is REPLACED by the
  // category's, so back then returns to where the guest was before.
  const handleDrawerOpenPath = useCallback(
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

  const handleSelectItem = useCallback(
    (item) => {
      if (!item) return;
      const shown = displayByKey.get(pairKey(item)) || item;
      track("item_click", `${urlname}/${shown.slug ?? shown.name}`);
      setSelectedItem(shown);
      setModalOpen(true);
    },
    [displayByKey, track, urlname]
  );

  const scrollTop = useCallback(() => scrollToPath(null, true), [scrollToPath]);

  // --- render -----------------------------------------------------------
  if (!ready) {
    return (
      <div className="ln-root ln-tone-a" style={vars} ref={rootRef}>
        <div className="ln-status" role={status === "error" ? "alert" : "status"}>
          <LanternOrnament className={status === "error" ? "ln-status-orn" : "ln-status-orn ln-swing"} />
          <p>{status === "error" ? strings.error : strings.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ln-root ln-tone-a" style={vars} ref={rootRef}>
      <Hero owner={owner} strings={strings} itemCount={itemCount} categoryCount={nodes.length} />

      <main className="ln-frame">
        <ActionBar owner={owner} strings={strings} onMenu={openMenu} onInfo={openInfo} />
        {nodes.length ? (
          <PinnedNav
            rootRef={rootRef}
            nodes={nodes}
            itemsByLabel={itemsByLabel}
            activeTop={spy.activeTop}
            activeSub={spy.activeSub}
            strings={strings}
            onSelectTop={handleSelectTop}
            onSelectSub={handleSelectSub}
            onMenu={openMenu}
          />
        ) : null}

        {nodes.map((node, i) => (
          <Section
            key={node.label}
            node={node}
            index={i}
            itemsByLabel={itemsByLabel}
            originalLabelOf={originalLabelOf}
            strings={strings}
            onSelectItem={handleSelectItem}
          />
        ))}
      </main>

      <Footer owner={owner} strings={strings} />

      <DishModal item={selectedItem} open={modalOpen} onClose={closeModal} strings={strings} />

      <NavDrawer
        open={drawerOpen}
        focusContacts={focusContacts}
        owner={owner}
        nodes={nodes}
        itemsByLabel={itemsByLabel}
        activeTop={spy.activeTop}
        activeSub={spy.activeSub}
        strings={strings}
        onClose={closeDrawer}
        onOpen={handleDrawerOpenPath}
      />

      <ScrollToTopButton visible={spy.pastHero} onClick={scrollTop} label={strings.backToTop} />

      <MenuChatWidget restaurantName={urlname} accentColor={accent} itemSelect={handleSelectItem} />
      <QRCodeWidget urlname={urlname} accentColor={accent} />
      <LocaleWidget accentColor={accent} />
    </div>
  );
}
