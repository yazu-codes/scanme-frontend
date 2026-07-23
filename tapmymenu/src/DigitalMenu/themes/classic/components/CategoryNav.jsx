import React from "react";

export default function CategoryNav({ categories, activeCategory, onSelect }) {
  return (
    <nav className="dm-category-nav" aria-label="Menu categories">
      <div className="dm-category-scroll">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              "dm-category-pill" +
              (category === activeCategory ? " dm-category-pill-active" : "")
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
