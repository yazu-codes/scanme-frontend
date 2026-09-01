import React from "react";
import { slugifyCategory } from "../../../core";
import MenuItemCard from "./MenuItemCard";

export default function CategorySection({ category, items, index, sectionRef, onSelectItem }) {
  const categoryLabel = category.label !== undefined ? category.label : category;
  const categoryItems = items[categoryLabel] || [];

  return (
    <section
      id={slugifyCategory(categoryLabel)}
      ref={sectionRef(categoryLabel)}
      className="dml-category-section"
    >
      <div className="dml-category-heading-row">
        <h2 className="dml-category-heading">{categoryLabel}</h2>
        <span className="dml-category-heading-rule" aria-hidden="true" />
        {categoryItems.length > 0 ? (
          <span className="dml-category-count">{categoryItems.length}</span>
        ) : null}
      </div>

      <div className="dml-item-grid">
        {categoryItems.map((item, idx) => (
          <MenuItemCard
            key={`${item.name}-${idx}`}
            item={item}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {category.children
        ? category.children.map((c, i) => (
            <CategorySection
              key={c.label || c}
              index={i}
              category={c}
              items={items}
              onSelectItem={onSelectItem}
              sectionRef={sectionRef}
            />
          ))
        : null}
    </section>
  );
}
