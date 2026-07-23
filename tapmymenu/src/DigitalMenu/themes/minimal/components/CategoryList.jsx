import React from "react";
import { slugifyCategory } from "../../../core";

// Minimal doesn't use scroll-spy or a sticky nav — just a plain list of
// jump links at the top of the page. Deliberately not the same pattern
// as Classic's CategoryNav, to show a theme can rethink navigation
// entirely rather than only restyling it.
export default function CategoryList({ categories }) {
  return (
    <nav className="dmm-category-list" aria-label="Menu categories">
      {categories.map((category, idx) => (
        <React.Fragment key={category}>
          {idx > 0 ? <span className="dmm-category-sep">·</span> : null}
          <a href={`#${slugifyCategory(category)}`} className="dmm-category-link">
            {category}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}
