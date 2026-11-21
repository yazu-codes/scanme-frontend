import React, { memo } from "react";
import { DishCard, DishRow } from "./DishCard";
import { BandOrnament } from "./Ornaments";
import { countItems, visibleItems } from "../utils";

// A block of dishes: photo cards when any dish in it has a photo, the
// compact text list otherwise (drinks).
function Dishes({ items, onSelectItem }) {
  if (items.length === 0) return null;
  if (items.some((i) => i.picture_url)) {
    return (
      <div className="ln-grid">
        {items.map((item, i) => (
          <DishCard key={`${item.display_order_position}-${item.name}-${i}`} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    );
  }
  return (
    <div className="ln-rows">
      {items.map((item, i) => (
        <DishRow key={`${item.display_order_position}-${item.name}-${i}`} item={item} onSelect={onSelectItem} />
      ))}
    </div>
  );
}

// Sub-category, any depth. Depth 1 gets a framed heading, deeper levels
// a lighter one.
function SubSection({ node, path, depth, itemsByLabel, originalLabelOf, strings, onSelectItem }) {
  const count = countItems(node, itemsByLabel);
  return (
    <section className="ln-sub" data-depth={Math.min(depth, 3)} data-ln-path={path} aria-label={node.label}>
      <header className="ln-sub-head">
        <span className="ln-sub-rule" aria-hidden="true" />
        <div className="ln-sub-titles">
          <h3 className="ln-sub-title">{node.label}</h3>
          {originalLabelOf[node.label] ? (
            <p className="ln-orig ln-orig-head" lang="bg">
              {originalLabelOf[node.label]}
            </p>
          ) : null}
          <p className="ln-count">{strings.items(count)}</p>
        </div>
        <span className="ln-sub-rule" aria-hidden="true" />
      </header>
      <Dishes items={visibleItems(itemsByLabel, node.label)} onSelectItem={onSelectItem} />
      {node.children.map((child, j) => (
        <SubSection
          key={child.label}
          node={child}
          path={`${path}-${j}`}
          depth={depth + 1}
          itemsByLabel={itemsByLabel}
          originalLabelOf={originalLabelOf}
          strings={strings}
          onSelectItem={onSelectItem}
        />
      ))}
    </section>
  );
}

// One top-level category = one colour band. Bands alternate between the
// owner palette (tone A) and the owner palette inverted (tone B).
function Section({ node, index, itemsByLabel, originalLabelOf, strings, onSelectItem }) {
  const toneB = index % 2 === 1;
  const own = visibleItems(itemsByLabel, node.label);
  return (
    <section
      className={`ln-band ${toneB ? "ln-tone-b" : "ln-tone-a"}`}
      data-ln-path={String(index)}
      aria-label={node.label}
    >
      {index > 0 ? <BandOrnament index={index} /> : null}
      <header className="ln-band-head">
        <h2 className="ln-band-title">{node.label}</h2>
        {originalLabelOf[node.label] ? (
          <p className="ln-orig ln-orig-band" lang="bg">
            {originalLabelOf[node.label]}
          </p>
        ) : null}
        <p className="ln-band-intro">
          {strings.items(countItems(node, itemsByLabel))}
          {node.children.length > 0 ? ` · ${node.children.map((c) => c.label).join(" · ")}` : ""}
        </p>
      </header>
      <Dishes items={own} onSelectItem={onSelectItem} />
      {node.children.map((child, j) => (
        <SubSection
          key={child.label}
          node={child}
          path={`${index}-${j}`}
          depth={1}
          itemsByLabel={itemsByLabel}
          originalLabelOf={originalLabelOf}
          strings={strings}
          onSelectItem={onSelectItem}
        />
      ))}
    </section>
  );
}

export default memo(Section);
