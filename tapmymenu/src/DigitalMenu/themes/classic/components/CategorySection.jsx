import React from "react";
import { slugifyCategory } from "../../../core";
import MenuItemCard from "./MenuItemCard";

export default function CategorySection({ category, items, sectionRef, onSelectItem }) {
  return (
    <section
      id={slugifyCategory(category)}
      ref={sectionRef}
      className="dm-category-section"
    >
      <h2 className="dm-category-heading">{category}</h2>
      <div className="dm-item-grid">
        {items.map((item, idx) => (
          <MenuItemCard
            key={`${item.name}-${idx}`}
            item={item}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}
