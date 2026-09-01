import React from "react";

// Supports both shapes the engine hands us: a flat array of category
// name strings, or a tree of { label, children } nodes (only the
// top-level label is shown here; nested children get their own
// sub-headings inside CategorySection).
export default function CategoryNav({ categories, activeCategory, onSelect, visible }) {
  const isTree = categories.length > 0 && categories[0].label !== undefined;

  return (
    <nav
      className={"dml-category-nav" + (visible ? " dml-category-nav-visible" : "")}
      aria-label="Jump to category"
      aria-hidden={!visible}
    >
      <div className="dml-category-scroll">
        {categories.map((category) => {
          const label = isTree ? category.label : category;
          return (
            <button
              key={label}
              type="button"
              className={
                "dml-category-tab" +
                (label === activeCategory ? " dml-category-tab-active" : "")
              }
              onClick={() => onSelect(label)}
              tabIndex={visible ? 0 : -1}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
