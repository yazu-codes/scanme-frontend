import React from "react";
import Ornament, { PageTitle } from "./Ornament";
import CategoryStrip from "./CategoryStrip";
import DishCard, { DishRow } from "./DishCard";
import { visibleItems } from "../utils";

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A block of dishes. If any dish in it has a photo it's the photo-card
// layout; an all-text block (typical for drinks) uses the list layout.
function Dishes({ items, onSelectItem }) {
  if (items.length === 0) return null;
  const photographic = items.some((i) => i.picture_url);

  if (photographic) {
    return (
      <div className="nr-dish-grid">
        {items.map((item, i) => (
          <DishCard key={`${item.name}-${i}`} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    );
  }
  return (
    <div className="nr-row-list">
      {items.map((item, i) => (
        <DishRow key={`${item.name}-${i}`} item={item} onSelect={onSelectItem} />
      ))}
    </div>
  );
}

function SubSection({ node, itemsByCategory, originalLabelOf, onSelectItem, depth }) {
  return (
    <section className="nr-sub" data-depth={depth}>
      <div className="nr-sub-head">
        <h3 className="nr-sub-title">{node.label}</h3>
        {originalLabelOf[node.label] ? (
          <p className="nr-orig" lang="bg">
            {originalLabelOf[node.label]}
          </p>
        ) : null}
        <Ornament bare />
      </div>
      <Dishes items={visibleItems(itemsByCategory, node.label)} onSelectItem={onSelectItem} />
      {node.children.map((child) => (
        <SubSection
          key={child.label}
          node={child}
          itemsByCategory={itemsByCategory}
          originalLabelOf={originalLabelOf}
          onSelectItem={onSelectItem}
          depth={depth + 1}
        />
      ))}
    </section>
  );
}

export default function CategoryPage({
  nodes,
  index,
  itemsByCategory,
  originalLabelOf = {},
  iconKeyOf = {},
  strings,
  onStripStuck,
  locale,
  track,
  onSelectCategory,
  onSelectItem,
  onBack,
}) {
  const node = nodes[index];
  if (!node) return null;

  return (
    <div className="nr-page nr-page-category">
      <PageTitle title={strings.menu} />

      <CategoryStrip
        nodes={nodes}
        iconKeyOf={iconKeyOf}
        activeIndex={index}
        onSelect={onSelectCategory}
        onStuckChange={onStripStuck}
        locale={locale}
        track={track}
      />

      <section className="nr-category">
        <div className="nr-category-head">
          <p className="nr-eyebrow">{strings.category}</p>
          <h2 className="nr-category-title">{node.label}</h2>
          {originalLabelOf[node.label] ? (
            <p className="nr-orig" lang="bg">
              {originalLabelOf[node.label]}
            </p>
          ) : null}
        </div>

        <Dishes items={visibleItems(itemsByCategory, node.label)} onSelectItem={onSelectItem} />

        {node.children.map((child) => (
          <SubSection
            key={child.label}
            node={child}
            itemsByCategory={itemsByCategory}
            originalLabelOf={originalLabelOf}
            onSelectItem={onSelectItem}
            depth={1}
          />
        ))}
      </section>

      <div className="nr-back-wrap">
        <button type="button" className="nr-btn nr-btn-wide" onClick={onBack}>
          <ArrowLeft />
          {strings.backToMenu}
        </button>
      </div>
    </div>
  );
}
