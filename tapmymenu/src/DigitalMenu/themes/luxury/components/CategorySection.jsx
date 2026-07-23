import React from "react";
import { slugifyCategory } from "../../../core";
import MenuItemCard from "./MenuItemCard";

// Menu categories are read top to bottom as a real course order
// (starters, mains, desserts...), so a roman numeral is an honest
// marker of sequence here rather than decoration.
function toRoman(num) {
  const table = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = num;
  let result = "";
  for (const [value, symbol] of table) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

export default function CategorySection({ category, items, index, sectionRef, onSelectItem }) {
  let categoryLabel = ""
  if (category.label == undefined) {
    categoryLabel = category
  } else {
    categoryLabel = category.label
  }

  return (
    <section
      id={slugifyCategory(categoryLabel)}
      ref={sectionRef(categoryLabel)}
      className="dml-category-section"
    >
      <div className="dml-category-heading-row">
        <span className="dml-category-eyebrow" aria-hidden="true">
          {toRoman((index ?? 0) + 1)}
        </span>
        <h2 className="dml-category-heading">{categoryLabel}</h2>
        <span className="dml-category-heading-rule" aria-hidden="true" />
      </div>
      <div className="dml-item-grid">
        {(items[categoryLabel] ? items[categoryLabel].map((item, idx) => (
          <MenuItemCard
            key={`${item.name}-${idx}`}
            item={item}
            onSelect={onSelectItem}
          />
        )) : "")}
      </div>

      {(category.children ? category.children.map((c, i) => (
                <CategorySection
                  key={c}
                  index={i}
                  category={c}
                  items={items}
                  onSelectItem={onSelectItem}
                  sectionRef={sectionRef}
                />
              )) : "")}
    </section>
  );
}
