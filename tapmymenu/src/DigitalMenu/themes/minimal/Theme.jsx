import React from "react";
import "./theme.css";

import useBodyBackgroundSync from "../shared/hooks/useBodyBackgroundSync";
import useGoogleFont from "../shared/hooks/useGoogleFont";

import Header from "./components/Header";
import CategoryList from "./components/CategoryList";
import CategorySection from "./components/CategorySection";
import Footer from "./components/Footer";
import { LoadingScreen, ErrorScreen } from "./components/StatusScreen";

// "Minimal" — plain editorial list, no images/cards, no slide-in panel
// (items expand inline instead), no sticky/scroll-spy nav. Deliberately
// ignores the menu's configured colors and always uses its own fixed
// palette (see theme.css) — proving a theme can override config, not
// just apply it.
//
// Same props as every other theme, straight from core/useDigitalMenu.
export default function MinimalTheme({ status, owner, categories, itemsByCategory }) {
  useBodyBackgroundSync("#fdfcf9");
  useGoogleFont("Fraunces");

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") return <ErrorScreen />;

  return (
    <div className="dmm-root">
      <Header owner={owner} />
      <CategoryList categories={categories} />

      <main className="dmm-main">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={itemsByCategory[category]}
          />
        ))}
      </main>

      <Footer owner={owner} />
    </div>
  );
}
