import React from "react";

export default function CategoryNav({ categories, activeCategory, onSelect }) {
  if (categories[0].label !== undefined) {
    console.log("Printing with Tree")
    return (
      <nav className="dml-category-nav" aria-label="Menu categories">
        <div className="dml-category-scroll">
          {categories.map((category) => (
            <button
              key={category.label}
              type="button"
              className={
                "dml-category-tab" +
                (category.label === activeCategory ? " dml-category-tab-active" : "")
              }
              onClick={() => onSelect(category.label)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>
    )
  }

  
  
  let compoWithCategories = (
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
  
  return compoWithCategories
}
