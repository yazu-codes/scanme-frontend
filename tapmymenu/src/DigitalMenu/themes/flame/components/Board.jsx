import React, { memo } from "react";
import {
  Allergens,
  OriginalName,
  countItems,
  dishKey,
  formatEuro,
  pressable,
  splitWeight,
  visibleItems,
} from "../../shared/menuKit";
import Brush from "./Brush";

// Photo dish: the whole photo floating on a glow (never cropped), then
// the name in condensed caps and the price.
const DishCard = memo(function DishCard({ item, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  return (
    <article className="fl-card" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      <span className="fl-card-photo">
        {item.picture_url ? <img src={item.picture_url} alt="" loading="lazy" decoding="async" /> : null}
      </span>
      <div className="fl-card-body">
        <div className="fl-card-head">
          <h4 className="fl-dish-name">{item.name}</h4>
          <span className="fl-price">{formatEuro(item.price)}</span>
        </div>
        <OriginalName item={item} className="fl-orig" />
        {description || weight ? (
          <p className="fl-dish-desc">
            {description}
            {description && weight ? ", " : ""}
            {weight}
          </p>
        ) : null}
        <Allergens allergens={item.allergens} className="fl-allergens" />
      </div>
    </article>
  );
});

// Text dish the flyer's way: NAME in caps, then the description running
// into a dotted leader that ends at the price.
const DishLine = memo(function DishLine({ item, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  const text = [description, weight].filter(Boolean).join(", ");
  return (
    <article className="fl-line" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      <h4 className="fl-dish-name">{item.name}</h4>
      <OriginalName item={item} className="fl-orig" />
      <p className="fl-line-tail">
        <span className="fl-line-desc">{text}</span>
        <span className="fl-line-dots" aria-hidden="true" />
        <span className="fl-price">{formatEuro(item.price)}</span>
      </p>
    </article>
  );
});

function Dishes({ items, onSelect }) {
  if (items.length === 0) return null;
  if (items.some((i) => i.picture_url)) {
    return (
      <div className="fl-cards">
        {items.map((item, i) => (
          <DishCard key={dishKey(item, i)} item={item} onSelect={onSelect} />
        ))}
      </div>
    );
  }
  return (
    <div className="fl-lines">
      {items.map((item, i) => (
        <DishLine key={dishKey(item, i)} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

function Sub({ node, path, data, level }) {
  const orig = data.originalLabelOf[node.label];
  return (
    <section className={`fl-sub fl-sub-${Math.min(level, 2)}`} data-mk-path={path} aria-label={node.label}>
      <h3 className="fl-sub-title">
        {node.label}
        {orig ? (
          <span className="fl-orig-inline" lang="bg">
            {" "}
            · {orig}
          </span>
        ) : null}
      </h3>
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Sub key={child.label} node={child} path={`${path}-${j}`} data={data} level={level + 1} />
      ))}
    </section>
  );
}

// A top-level category under a big brush-stroke banner.
const Category = memo(function Category({ node, index, data }) {
  const orig = data.originalLabelOf[node.label];
  return (
    <section className="fl-category" data-mk-path={String(index)} aria-label={node.label}>
      <header className="fl-cat-head">
        <Brush as="h2" className="fl-cat-title">
          {node.label}
        </Brush>
        {orig ? (
          <p className="fl-orig" lang="bg">
            {orig}
          </p>
        ) : null}
        <p className="fl-count">{data.strings.items(countItems(node, data.itemsByLabel))}</p>
      </header>
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Sub key={child.label} node={child} path={`${index}-${j}`} data={data} level={1} />
      ))}
    </section>
  );
});

export default function Board({ data }) {
  return data.nodes.map((node, i) => <Category key={node.label} node={node} index={i} data={data} />);
}
