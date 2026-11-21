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
import { CrossRow } from "./Stitches";

// A dish as in the reference: bold name, price on the right in the
// stitch face, an italic line of description under it. In a frame with
// photos, the whole photo sits in a small 4:3 "hoop" on the left.
const Dish = memo(function Dish({ item, withThumb, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  return (
    <article className="st-dish" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      {withThumb ? (
        <span className="st-thumb" aria-hidden="true">
          {item.picture_url ? <img src={item.picture_url} alt="" loading="lazy" decoding="async" /> : null}
        </span>
      ) : null}
      <div className="st-dish-body">
        <div className="st-dish-head">
          <h4 className="st-dish-name">{item.name}</h4>
          <span className="st-price">{formatEuro(item.price)}</span>
        </div>
        <OriginalName item={item} className="st-orig" />
        {description || weight ? (
          <p className="st-dish-desc">
            {description}
            {description && weight ? ", " : ""}
            {weight}
          </p>
        ) : null}
        <Allergens allergens={item.allergens} className="st-allergens" />
      </div>
    </article>
  );
});

function Dishes({ items, onSelect }) {
  if (items.length === 0) return null;
  const withThumb = items.some((i) => i.picture_url);
  return (
    <div className="st-dishes">
      {items.map((item, i) => (
        <Dish key={dishKey(item, i)} item={item} withThumb={withThumb} onSelect={onSelect} />
      ))}
    </div>
  );
}

function Nested({ node, path, data }) {
  const orig = data.originalLabelOf[node.label];
  return (
    <div className="st-nested" data-mk-path={path}>
      <h4 className="st-nested-title">
        {node.label}
        {orig ? (
          <span className="st-orig-inline" lang="bg">
            {" "}
            · {orig}
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

// A stitched frame (double dashed border) in one of the three thread
// shades, with the title and icon stitched in the same thread.
function Frame({ node, path, data, thread, title }) {
  const orig = node && data.originalLabelOf[node.label];
  return (
    <section
      className={`st-frame st-frame-${thread}`}
      data-mk-path={path}
      aria-label={node ? node.label : undefined}
    >
      {title ? (
        <header className="st-frame-head">
          <span className="st-frame-icon" aria-hidden="true">
            <CategoryIcon iconKey={data.iconKeyOf[node.label]} size={28} />
          </span>
          <div className="st-frame-titles">
            <h3 className="st-frame-title">{node.label}</h3>
            {orig ? (
              <p className="st-orig" lang="bg">
                {orig}
              </p>
            ) : null}
          </div>
        </header>
      ) : null}
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Nested key={child.label} node={child} path={`${path}-${j}`} data={data} />
      ))}
    </section>
  );
}

const Category = memo(function Category({ node, index, data }) {
  const own = visibleItems(data.itemsByLabel, node.label);
  const orig = data.originalLabelOf[node.label];
  const single = node.children.length === 0;
  return (
    <section className="st-category" data-mk-path={String(index)} aria-label={node.label}>
      <header className="st-cat-head">
        <h2 className={`st-cat-title st-thread-${(index % 3) + 1}`}>{node.label}</h2>
        {orig ? (
          <p className="st-orig" lang="bg">
            {orig}
          </p>
        ) : null}
        <p className="st-count">{data.strings.items(countItems(node, data.itemsByLabel))}</p>
        <CrossRow className="st-xrow-short" />
      </header>
      <div className={"st-frames" + (single ? " st-frames-single" : "")}>
        {single ? (
          <section className={`st-frame st-frame-${(index % 3) + 1}`}>
            <Dishes items={own} onSelect={data.selectItem} />
          </section>
        ) : (
          <>
            {own.length ? (
              <section className={`st-frame st-frame-${(index % 3) + 1}`}>
                <Dishes items={own} onSelect={data.selectItem} />
              </section>
            ) : null}
            {node.children.map((child, j) => (
              <Frame
                key={child.label}
                node={child}
                path={`${index}-${j}`}
                data={data}
                thread={((index + j + 1) % 3) + 1}
                title
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
});

export default function Board({ data }) {
  return data.nodes.map((node, i) => <Category key={node.label} node={node} index={i} data={data} />);
}
