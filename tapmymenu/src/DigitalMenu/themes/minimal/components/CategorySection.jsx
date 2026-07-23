import React from "react";
import { slugifyCategory } from "../../../core";
import MenuItemRow from "./MenuItemRow";

export default function CategorySection({ category, items }) {
  return (
    <section id={slugifyCategory(category)} className="dmm-category-section">
      <h2 className="dmm-category-heading">{category}</h2>
      <div className="dmm-item-list">
        {items.map((item, idx) => (
          <MenuItemRow key={`${item.name}-${idx}`} item={item} />
        ))}
      </div>
    </section>
  );
}
