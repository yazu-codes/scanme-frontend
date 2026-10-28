import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./noir-theme.css";

import useBodyBackgroundSync from "../shared/hooks/useBodyBackgroundSync";
import usePanelScrollLock from "../shared/hooks/usePanelScrollLock";
import useGoogleFont from "../shared/hooks/useGoogleFont";

import useThemeVars, { NOIR_ACCENT, USE_OWNER_PALETTE } from "./useThemeVars";
import useMenuNavigation from "./hooks/useMenuNavigation";
import useScrollState from "./hooks/useScrollState";
import useOriginalMenu from "./hooks/useOriginalMenu";
import getStrings from "./strings";
import { buildCategoryTree, pairKey } from "./utils";

import Splash from "./components/Splash";
import Header from "./components/Header";
import NavDrawer from "./components/NavDrawer";
import MenuCover from "./components/MenuCover";
import CategoryPage from "./components/CategoryPage";
import DishModal from "./components/DishModal";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

import MenuChatWidget from "../../core/MenuChatWidget";
import QRCodeWidget from "../../core/QRWidget";
import LocaleWidget from "../../core/LocaleWidget";
import { useAnalytics } from "../../core/Analytics";
import { getLocaleCookie } from "../../core/cookieUtils";

// "Noir" — a dark fine-dining menu in the style of a restaurant website
// rather than a single scrolling list:
//
//   splash (logo draws in)  ->  cover page: one photo card per category
//   VIEW MENU               ->  splash  ->  category page: sticky icon
//                               strip of every category, then that
//                               category's dishes (photo cards, or a
//                               text list for photo-less sections)
//   tap a dish              ->  centred detail card over a blurred page
//   back / BACK TO MAIN MENU->  splash  ->  cover
//
// Every prop comes straight from core/useDigitalMenu — purely
// presentational, like every other theme.
export default function NoirTheme({ urlname, status, owner, config, categories, itemsByCategory }) {
  const track = useAnalytics();
  const locale = useMemo(() => getLocaleCookie(), []);
  const strings = getStrings(locale);

  const rootRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stripStuck, setStripStuck] = useState(false);

  // In a translated language, also load the original-language menu so
  // every dish can show its original name for the staff (see hook).
  const originalMenu = useOriginalMenu(urlname, locale, status === "ready");

  // itemsByLabel replaces core's itemsByCategory from here on: same
  // shape, but keyed by the category tree's labels (loose matching), with
  // the translated-response fix applied and original_name /
  // original_description attached. originalLabelOf maps a translated
  // category label to its original-language name.
  // iconKeyOf picks each category's icon from its ORIGINAL title.
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf } = useMemo(
    () => buildCategoryTree(config.category_order, categories, itemsByCategory, locale, originalMenu),
    [config.category_order, categories, itemsByCategory, locale, originalMenu]
  );

  // Display-ready items by pairing key, so a dish opened from the YummGPT
  // chat gets the same cleaned name + original as one tapped in the menu.
  const displayItemByKey = useMemo(() => {
    const map = new Map();
    Object.values(itemsByLabel).forEach((list) => list.forEach((i) => map.set(pairKey(i), i)));
    return map;
  }, [itemsByLabel]);

  const ready = status === "ready";
  const { view, splash, splashCycle, openCategory, goHome } = useMenuNavigation({
    ready: status !== "loading",
    categoryCount: nodes.length,
    rootRef,
  });

  const resolvedFont = useGoogleFont(USE_OWNER_PALETTE ? config.font_family : "Roboto");
  const cssVars = useThemeVars({ config, resolvedFont });
  useBodyBackgroundSync(cssVars["--nr-bg"]);
  usePanelScrollLock(modalOpen || drawerOpen);

  // The floating widgets mount once the opening splash has finished, so
  // their 2-second helper bubbles play while the guest can actually see
  // them instead of behind the splash.
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    if (splash === "hidden") setBooted(true);
  }, [splash]);

  const { y, dir } = useScrollState(rootRef);
  const onCategory = view != null;
  // Cover: slide away on scroll down, back on scroll up. Category: give
  // the top edge to the icon strip as soon as it pins.
  const headerHidden = onCategory ? stripStuck : y > 120 && dir === "down";
  const accent = USE_OWNER_PALETTE ? config.font_color || NOIR_ACCENT : NOIR_ACCENT;

  const handleOpenCategory = useCallback(
    (index) => {
      setDrawerOpen(false);
      const node = nodes[index];
      if (node) track("category_click", `${urlname}/${node.label}`);
      openCategory(index);
    },
    [nodes, openCategory, track, urlname]
  );

  const handleHome = useCallback(() => {
    setDrawerOpen(false);
    goHome();
  }, [goHome]);

  const handleSelectItem = useCallback(
    (item) => {
      const shown = (item && displayItemByKey.get(pairKey(item))) || item;
      track("item_click", `${urlname}/${shown.slug ?? shown.name}`);
      setSelectedItem(shown);
      setModalOpen(true);
    },
    [track, urlname, displayItemByKey]
  );

  const handleCloseModal = useCallback(() => setModalOpen(false), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="nr-root" style={cssVars} ref={rootRef}>
      <Splash owner={owner} state={splash} cycle={splashCycle} />

      {status === "error" ? (
        <div className="nr-error">
          <p>{strings.error}</p>
        </div>
      ) : null}

      {ready ? (
        <>
          <Header
            owner={owner}
            hidden={headerHidden || drawerOpen}
            solid={!onCategory && y > 20}
            locale={locale}
            track={track}
            strings={strings}
            onBrand={handleHome}
            onMenu={() => setDrawerOpen(true)}
          />

          <main className="nr-main" key={view == null ? "cover" : `c-${view}`}>
            {onCategory ? (
              <CategoryPage
                nodes={nodes}
                index={view}
                itemsByCategory={itemsByLabel}
                originalLabelOf={originalLabelOf}
                iconKeyOf={iconKeyOf}
                strings={strings}
                onStripStuck={setStripStuck}
                locale={locale}
                track={track}
                onSelectCategory={handleOpenCategory}
                onSelectItem={handleSelectItem}
                onBack={handleHome}
              />
            ) : (
              <MenuCover
                nodes={nodes}
                itemsByCategory={itemsByLabel}
                originalLabelOf={originalLabelOf}
                iconKeyOf={iconKeyOf}
                placeBackgroundUrl={owner.menu_owner_place_background_url}
                strings={strings}
                onOpen={handleOpenCategory}
              />
            )}
          </main>

          <Footer owner={owner} nodes={nodes} strings={strings} onOpenCategory={handleOpenCategory} />

          {booted ? (
            <>
              <MenuChatWidget restaurantName={urlname} accentColor={accent} itemSelect={handleSelectItem} />
              <QRCodeWidget urlname={urlname} accentColor={accent} />
              <LocaleWidget accentColor={accent} />
            </>
          ) : null}

          <ScrollToTopButton visible={y > 600} targetRef={rootRef} label={strings.backToTop} />

          <DishModal item={selectedItem} open={modalOpen} onClose={handleCloseModal} strings={strings} />

          <NavDrawer
            open={drawerOpen}
            owner={owner}
            nodes={nodes}
            activeIndex={view}
            strings={strings}
            onClose={handleCloseDrawer}
            onHome={handleHome}
            onOpenCategory={handleOpenCategory}
          />
        </>
      ) : null}
    </div>
  );
}
