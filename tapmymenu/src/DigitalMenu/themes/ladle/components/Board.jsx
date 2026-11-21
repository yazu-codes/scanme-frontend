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
import { Squiggle } from "./Doodles";

// A dish the reference's way: bold name with the price on the right,
// a small chalky description under it. In a group with photos, the
// whole photo sits in a small 4:3 frame on the right.
const Dish = memo(function Dish({ item, withThumb, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  return (
    <article className="tl-dish" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      <div className="tl-dish-body">
        <div className="tl-dish-head">
          <h4 className="tl-dish-name">{item.name}</h4>
          <span className="tl-price">{formatEuro(item.price)}</span>
        </div>
        <OriginalName item={item} className="tl-orig" />
        {description || weight ? (
          <p className="tl-dish-desc">
            {description}
            {description && weight ? " · " : ""}
            {weight ? <span className="tl-weight">{weight}</span> : null}
          </p>
        ) : null}
        <Allergens allergens={item.allergens} className="tl-allergens" />
      </div>
      {withThumb ? (
        <span className="tl-thumb" aria-hidden="true">
          {item.picture_url ? <img src={item.picture_url} alt="" loading="lazy" decoding="async" /> : null}
        </span>
      ) : null}
    </article>
  );
});

function Dishes({ items, onSelect }) {
  if (items.length === 0) return null;
  const withThumb = items.some((i) => i.picture_url);
  return (
    <div className="tl-dishes">
      {items.map((item, i) => (
        <Dish key={dishKey(item, i)} item={item} withThumb={withThumb} onSelect={onSelect} />
      ))}
    </div>
  );
}

// Deeper levels: a smaller hand-lettered heading.
function Nested({ node, path, data }) {
  const orig = data.originalLabelOf[node.label];
  return (
    <div className="tl-nested" data-mk-path={path}>
      <h4 className="tl-nested-title">
        {node.label}
        {orig ? (
          <span className="tl-note" lang="bg">
            {" "}
            {orig}
          </span>
        ) : null}
      </h4>
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Nested key={child.label} node={child} path={`${path}-${j}`} data={data} />
      ))}
    </div>
  );
}

// The reference's group: a filled round icon, the title and a small
// script note (original title in translated menus, else the count).
function Group({ node, path, data }) {
  const orig = data.originalLabelOf[node.label];
  return (
    <section className="tl-group" data-mk-path={path} aria-label={node.label}>
      <header className="tl-group-head">
        <span className="tl-icon" aria-hidden="true">
          <CategoryIcon iconKey={data.iconKeyOf[node.label]} size={30} />
        </span>
        <div className="tl-group-titles">
          <h3 className="tl-group-title">{node.label}</h3>
          <p className="tl-note" lang={orig ? "bg" : undefined}>
            {orig || data.strings.items(countItems(node, data.itemsByLabel))}
          </p>
        </div>
      </header>
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Nested key={child.label} node={child} path={`${path}-${j}`} data={data} />
      ))}
    </section>
  );
}

// A top-level category: big chalk title with a squiggle and a tilted
// sticker with the count, then its groups two-up on wide screens.
const Category = memo(function Category({ node, index, data }) {
  const own = visibleItems(data.itemsByLabel, node.label);
  const orig = data.originalLabelOf[node.label];
  const hasChildren = node.children.length > 0;
  return (
    <section className="tl-category" data-mk-path={String(index)} aria-label={node.label}>
      <header className="tl-cat-head">
        <h2 className="tl-cat-title">{node.label}</h2>
        {orig ? (
          <p className="tl-note tl-cat-orig" lang="bg">
            {orig}
          </p>
        ) : null}
        <Squiggle className="tl-squiggle" />
        <span className={"tl-sticker" + (index % 2 ? " tl-sticker-right" : "")}>
          {data.strings.items(countItems(node, data.itemsByLabel))}
        </span>
      </header>
      <div className={"tl-groups" + (hasChildren ? "" : " tl-groups-single")}>
        {own.length ? (
          <section className="tl-group">
            <Dishes items={own} onSelect={data.selectItem} />
          </section>
        ) : null}
        {node.children.map((child, j) => (
          <Group key={child.label} node={child} path={`${index}-${j}`} data={data} />
        ))}
      </div>
    </section>
  );
});

export default function Board({ data }) {
  return data.nodes.map((node, i) => <Category key={node.label} node={node} index={i} data={data} />);
}
