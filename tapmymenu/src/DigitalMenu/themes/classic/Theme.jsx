import React, { useState } from "react";
import "./theme.css";

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

// "Classic" — cards with photos, sticky pill nav, slide-in detail panel.
// Honors the menu's own configured background/font/text color.
//
// Every prop here comes straight from core/useDigitalMenu — this
// component is purely presentational.
export default function ClassicTheme({ status, owner, config, categories, itemsByCategory }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const backgroundColor = config.background_color || "#FAF7F0";
  const fontColor = config.font_color || "#26241F";

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
    <div className="dm-root" style={cssVars}>
      <Header owner={owner} />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
      />

      <main className="dm-main">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={itemsByCategory[category]}
            onSelectItem={handleSelectItem}
            sectionRef={getSectionRef(category)}
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
