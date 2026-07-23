import React, { useState } from "react";
import "./luxury-theme.css";

import useBodyBackgroundSync from "../shared/hooks/useBodyBackgroundSync";
import usePanelScrollLock from "../shared/hooks/usePanelScrollLock";
import useCategoryScrollSpy from "../shared/hooks/useCategoryScrollSpy";
import useGoogleFont from "../shared/hooks/useGoogleFont";

import useThemeVars from "./useThemeVars";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import Footer from "./components/Footer";
import ItemDetailPanel from "./components/ItemDetailPanel";
import { LoadingScreen, ErrorScreen } from "./components/StatusScreen";

const parseMenuTree = (value) => {
  if (!value) return null;

  try {
    let parsed = JSON.parse(value)
    console.log(parsed) 
    return parsed
  } catch (err) {
    console.error("Invalid menu tree JSON", err);
    return null;
  }
};

// "Luxury" — an antique-gold, serif-display take for premium menus.
// Cards give way to a certificate-bracket frame, the pill nav becomes
// an underlined tab strip, and course headings pick up a roman-numeral
// eyebrow. Every configurable field the owner has set — background
// and font color, font size, custom Google font, logo, slogan, place
// photo, phone — still comes through exactly as it does in Classic;
// only the presentation layer is new.
//
// Every prop here comes straight from core/useDigitalMenu — this
// component is purely presentational.
export default function LuxuryTheme({ status, owner, config, categories, itemsByCategory }) {
  const tree = parseMenuTree(config.category_order);

  const [selectedItem, setSelectedItem] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const backgroundColor = config.background_color || "#0B0A08";
  const fontColor = config.font_color || "#F1E9D8";

  useBodyBackgroundSync(backgroundColor);
  const resolvedFont = useGoogleFont(config.font_family);
  const { activeCategory, handleCategorySelect, getSectionRef } =
    useCategoryScrollSpy(categories);
  usePanelScrollLock(panelOpen);

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
    <div className="dml-root" style={cssVars}>
      <Header owner={owner} />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
      />

      <main className="dml-main">
        {tree != null ? tree.map((category, idx) => (
          <CategorySection
            key={category}
            index={idx}
            category={category}
            items={itemsByCategory}
            onSelectItem={handleSelectItem}
            sectionRef={getSectionRef}
          />
        )) : categories.map((category, idx) => (
          <CategorySection
            key={category}
            index={idx}
            category={category}
            items={itemsByCategory}
            onSelectItem={handleSelectItem}
            sectionRef={getSectionRef}
          />
        ))}
      </main>

      <Footer owner={owner} />

      <ItemDetailPanel
        item={selectedItem}
        open={panelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}
