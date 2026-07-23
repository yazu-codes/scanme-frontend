import React from "react";

export default function CategoryNav({ categories, activeCategory, onSelect }) {
  return (
    <nav className="dml-category-nav" aria-label="Menu categories">
      <div className="dml-category-scroll">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              "dml-category-tab" +
              (category === activeCategory ? " dml-category-tab-active" : "")
            }
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}
