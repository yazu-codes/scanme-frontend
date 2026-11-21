import React, { memo } from "react";
import {
  Allergens,
  CategoryIcon,
  OriginalName,
  countItems,
  dishKey,
  formatEuro,
  pressable,
  splitWeight,
  visibleItems,
} from "../../shared/menuKit";

// One dish as a diner price-list line: name · dotted leader · price, then
// the original name (translated menus), size and a one-line description.
// In a box where any dish has a photo, every line gets a small 4:3 frame
// on the left (whole photo, never cropped; empty frame when missing).
const Line = memo(function Line({ item, withThumb, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  return (
    <article className="dn-line" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      {withThumb ? (
        <span className="dn-thumb" aria-hidden="true">
          {item.picture_url ? <img src={item.picture_url} alt="" loading="lazy" decoding="async" /> : null}
        </span>
      ) : null}
      <div className="dn-line-body">
        <div className="dn-line-main">
          <h4 className="dn-line-name">{item.name}</h4>
          <span className="dn-dots" aria-hidden="true" />
          <span className="dn-price">{formatEuro(item.price)}</span>
        </div>
        <OriginalName item={item} className="dn-orig" />
        {weight || description ? (
          <p className="dn-line-sub">
            {weight ? <span className="dn-weight">{weight}</span> : null}
            {description ? <span className="dn-desc">{description}</span> : null}
          </p>
        ) : null}
        <Allergens allergens={item.allergens} className="dn-allergens" />
      </div>
    </article>
  );
});

function Lines({ items, onSelect }) {
  if (items.length === 0) return null;
  const withThumb = items.some((i) => i.picture_url);
  return (
    <div className="dn-lines">
      {items.map((item, i) => (
        <Line key={dishKey(item, i)} item={item} withThumb={withThumb} onSelect={onSelect} />
      ))}
    </div>
  );
}

// Deeper levels inside a box: a small heading and their lines.
function Nested({ node, path, kit }) {
  return (
    <div className="dn-nested" data-mk-path={path}>
      <h4 className="dn-nested-title">
        {node.label}
        {kit.originalLabelOf[node.label] ? (
          <span className="dn-orig-inline" lang="bg">
            {" "}
            · {kit.originalLabelOf[node.label]}
          </span>
        ) : null}
      </h4>
      <Lines items={visibleItems(kit.itemsByLabel, node.label)} onSelect={kit.selectItem} />
      {node.children.map((child, j) => (
        <Nested key={child.label} node={child} path={`${path}-${j}`} kit={kit} />
      ))}
    </div>
  );
}

// A boxed block like the reference's BURGER / SANDWICH panels: accent
// title with a round icon badge, then the price list.
function Box({ node, path, kit, title }) {
  return (
    <section className="dn-box" data-mk-path={path} aria-label={node.label}>
      {title ? (
        <header className="dn-box-head">
          <div className="dn-box-titles">
            <h3 className="dn-box-title">{node.label}</h3>
            {kit.originalLabelOf[node.label] ? (
              <p className="dn-orig" lang="bg">
                {kit.originalLabelOf[node.label]}
              </p>
            ) : null}
          </div>
          <span className="dn-icon" aria-hidden="true">
            <CategoryIcon iconKey={kit.iconKeyOf[node.label]} size={26} />
          </span>
        </header>
      ) : null}
      <Lines items={visibleItems(kit.itemsByLabel, node.label)} onSelect={kit.selectItem} />
      {node.children.map((child, j) => (
        <Nested key={child.label} node={child} path={`${path}-${j}`} kit={kit} />
      ))}
    </section>
  );
}

// A top-level category: banner heading, then its own dishes and each
// sub-category as boxes in a two-column board (one column on phones).
// A category with no sub-categories is a single box whose list flows in
// two columns on wide screens.
const Category = memo(function Category({ node, index, kit }) {
  const own = visibleItems(kit.itemsByLabel, node.label);
  const single = node.children.length === 0;
  return (
    <section className="dn-category" data-mk-path={String(index)} aria-label={node.label}>
      <header className="dn-banner">
        <span className="dn-banner-rule" aria-hidden="true" />
        <div className="dn-banner-text">
          <h2 className="dn-banner-title">{node.label}</h2>
          {kit.originalLabelOf[node.label] ? (
            <p className="dn-orig" lang="bg">
              {kit.originalLabelOf[node.label]}
            </p>
          ) : null}
          <p className="dn-count">{kit.strings.items(countItems(node, kit.itemsByLabel))}</p>
        </div>
        <span className="dn-banner-rule" aria-hidden="true" />
      </header>
      <div className={"dn-boxes" + (single ? " dn-boxes-single" : "")}>
        {own.length && !single ? (
          <section className="dn-box">
            <Lines items={own} onSelect={kit.selectItem} />
          </section>
        ) : null}
        {single ? (
          <section className="dn-box">
            <Lines items={own} onSelect={kit.selectItem} />
          </section>
        ) : (
          node.children.map((child, j) => (
            <Box key={child.label} node={child} path={`${index}-${j}`} kit={kit} title />
          ))
        )}
      </div>
    </section>
  );
});

export default function MenuBoard({ kit }) {
  return kit.nodes.map((node, i) => <Category key={node.label} node={node} index={i} kit={kit} />);
}
