import React, { useRef, useState } from "react";
import "./modern-theme.css";

import useBodyBackgroundSync from "../shared/hooks/useBodyBackgroundSync";
import usePanelScrollLock from "../shared/hooks/usePanelScrollLock";
import useCategoryScrollSpy from "../shared/hooks/useCategoryScrollSpy";
import useGoogleFont from "../shared/hooks/useGoogleFont";

import useThemeVars from "./useThemeVars";
import useStickyNavReveal from "./hooks/useStickyNavReveal";
import useHeaderHeightSync from "./hooks/useHeaderHeightSync";
import Header from "./components/Header";
import CategoryHero from "./components/CategoryHero";
import CategoryNav from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import Footer from "./components/Footer";
import ItemDetailPanel from "./components/ItemDetailPanel";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { LoadingScreen, ErrorScreen } from "./components/StatusScreen";
import MenuChatWidget from "../../core/MenuChatWidget";
import QRCodeWidget from "../../core/QRWidget";
import LocaleWidget from "../../core/LocaleWidget";

const parseMenuTree = (value) => {
  if (!value) return null;

  try {
    let parsed = JSON.parse(value);
    return parsed;
  } catch (err) {
    console.error("Invalid menu tree JSON", err);
    return null;
  }
};

// "Modern" — a compact-nav, tile-forward take for menus that want the
// categories doing the talking instead of a big photo hero. The header
// is a slim, sticky identity bar (logo + name); the space a photo hero
// would have occupied is handed to the categories themselves as large
// tappable tiles. A second, slimmer sticky strip repeats the categories
// as scrollable chips once the visitor has scrolled past the tiles, so
// jumping between courses stays one tap away throughout the whole menu.
//
// Every configurable field the owner has set — background and font
// color, font size, custom Google font, logo, slogan, place photo,
// phone — still comes through exactly as it does in Classic and Luxury;
// only the presentation layer is new. (The place-background photo, if
// set, is used as a fallback tile image for categories that have no
// dish photo of their own — see CategoryHero.)
//
// Every prop here comes straight from core/useDigitalMenu — this
// component is purely presentational.
export default function ModernTheme({ urlname, status, owner, config, categories, itemsByCategory, code }) {
  const tree = parseMenuTree(config.category_order);
  const activeCategories = tree != null ? tree : categories;

  const [selectedItem, setSelectedItem] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const [heroElement, setHeroElement] = useState(null);

  const backgroundColor = config.background_color || "#0F1512";
  const fontColor = config.font_color || "#F3F6F4";

  useBodyBackgroundSync(backgroundColor);
  const resolvedFont = useGoogleFont(config.font_family);
  const { activeCategory, handleCategorySelect, getSectionRef } =
    useCategoryScrollSpy(categories);
  usePanelScrollLock(panelOpen);

  // Keeps --dml-header-h pinned to the header's true rendered height
  // (safe-area inset included) instead of trusting the CSS breakpoint
  // guess, and gives us that number directly for the reveal threshold.
  const headerHeight = useHeaderHeightSync(rootRef, headerRef);

  // True once the image category navigation is completely out of view.
  // CategoryNav then takes over the header's exact spot at the top.
  const pastHero = useStickyNavReveal(heroElement, headerHeight);

  const cssVars = useThemeVars({
    backgroundColor,
    fontColor,
    fontSize: config.font_size,
    resolvedFont,
  });

  function handleSelectItem(item) {
    setSelectedItem(item);
    setPanelOpen(true);
  }

  function handleClosePanel() {
    setPanelOpen(false);
  }

  if (status === "loading") {
    return <LoadingScreen cssVars={cssVars} />;
  }

  if (status === "error") {
    return <ErrorScreen cssVars={cssVars} />;
  }

  return (
    <div className="dml-root dml-theme-modern" style={cssVars} ref={rootRef}>
      <Header owner={owner} ref={headerRef} hidden={pastHero} />

      <CategoryHero
        ref={setHeroElement}
        categories={activeCategories}
        itemsByCategory={itemsByCategory}
        placeBackgroundUrl={owner ? owner.menu_owner_place_background_url : null}
        onSelect={handleCategorySelect}
      />

      <CategoryNav
        categories={activeCategories}
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
        visible={pastHero}
      />

      <main className="dml-main">
        {activeCategories.map((category, idx) => (
          <CategorySection
            key={category.label || category}
            index={idx}
            category={category}
            items={itemsByCategory}
            onSelectItem={handleSelectItem}
            sectionRef={getSectionRef}
          />
        ))}
      </main>

      <MenuChatWidget
        restaurantName={urlname}
        accentColor={config.background_color}
        itemSelect={handleSelectItem}
      />

      <QRCodeWidget
        urlname={urlname}
        accentColor={config.background_color}
      />

      <LocaleWidget
        accentColor={config.background_color}
      />

      <Footer owner={owner} />

      <ScrollToTopButton visible={pastHero} targetRef={rootRef} />

      <ItemDetailPanel
        item={selectedItem}
        open={panelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}