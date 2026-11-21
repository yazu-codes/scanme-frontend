import React, { memo } from "react";
import {
  Allergens,
  OriginalName,
  collectItems,
  countItems,
  dishKey,
  formatEuro,
  pressable,
  splitWeight,
  visibleItems,
} from "../../shared/menuKit";
import HeartButton from "./Heart";

// Photo dish card: whole photo (4:3, never cropped), a tilted price
// sticker in one of the derived pop colours, a PROMO badge for dishes in
// the owner's Promotions category, and a ♥. Tap = open the feed here.
const Card = memo(function Card({ item, n, promo, data }) {
  const { weight } = splitWeight(item.description);
  const on = data.craved.has(item);
  return (
    <article
      className="cv-card"
      style={{ "--cv-n": n % 4 }}
      {...pressable(() => data.openFeed(item), `${item.name}, ${formatEuro(item.price)}`)}
    >
      <span className="cv-card-photo">
        <img src={item.picture_url} alt="" loading="lazy" decoding="async" />
        <span className="cv-price-sticker">{formatEuro(item.price)}</span>
        {promo ? <span className="cv-promo">{data.strings.promo}</span> : null}
      </span>
      <div className="cv-card-body">
        <h4 className="cv-card-name">{item.name}</h4>
        <OriginalName item={item} className="cv-orig" />
        {weight ? <p className="cv-weight">{weight}</p> : null}
      </div>
      <HeartButton
        on={on}
        className="cv-card-heart"
        label={on ? data.strings.uncrave : data.strings.crave}
        onToggle={(e) => data.toggleCrave(item, e)}
      />
    </article>
  );
});

// Photo-less dish (drinks): a punchy line. Tap = detail sheet.
const Row = memo(function Row({ item, promo, data }) {
  const { description, weight } = splitWeight(item.description);
  const on = data.craved.has(item);
  return (
    <article className="cv-row" {...pressable(() => data.openDetail(item), `${item.name}, ${formatEuro(item.price)}`)}>
      <div className="cv-row-body">
        <div className="cv-row-main">
          <h4 className="cv-row-name">
            {item.name}
            {promo ? <span className="cv-promo cv-promo-inline">{data.strings.promo}</span> : null}
          </h4>
          <span className="cv-row-dots" aria-hidden="true" />
          <span className="cv-row-price">{formatEuro(item.price)}</span>
        </div>
        <OriginalName item={item} className="cv-orig" />
        {weight || description ? (
          <p className="cv-row-sub">
            {weight ? <span className="cv-weight">{weight}</span> : null}
            {description ? <span className="cv-row-desc">{description}</span> : null}
          </p>
        ) : null}
        <Allergens allergens={item.allergens} className="cv-allergens" />
      </div>
      <HeartButton
        on={on}
        className="cv-row-heart"
        label={on ? data.strings.uncrave : data.strings.crave}
        onToggle={(e) => data.toggleCrave(item, e)}
      />
    </article>
  );
});

// A node's own dishes: photo dishes as a swipe strip (phones) / grid
// (wide screens), photo-less ones as lines.
function Dishes({ items, promo, data }) {
  if (items.length === 0) return null;
  const photos = items.filter((i) => i.picture_url);
  const lines = items.filter((i) => !i.picture_url);
  return (
    <>
      {photos.length ? (
        <div className="cv-strip">
          {photos.map((item, i) => (
            <Card key={dishKey(item, i)} item={item} n={i} promo={promo} data={data} />
          ))}
        </div>
      ) : null}
      {lines.length ? (
        <div className="cv-rows">
          {lines.map((item, i) => (
            <Row key={dishKey(item, i)} item={item} promo={promo} data={data} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function Sub({ node, path, data, depth, promo }) {
  const isPromo = promo || data.iconKeyOf[node.label] === "promo";
  const orig = data.originalLabelOf[node.label];
  return (
    <section className={`cv-sub cv-sub-${Math.min(depth, 3)}`} data-mk-path={path} aria-label={node.label}>
      <h3 className="cv-sub-title">
        <span className="cv-sub-text">{node.label}</span>
        <span className="cv-sub-count">{countItems(node, data.itemsByLabel)}</span>
      </h3>
      {orig ? (
        <p className="cv-orig cv-orig-head" lang="bg">
          {orig}
        </p>
      ) : null}
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} promo={isPromo} data={data} />
      {node.children.map((child, j) => (
        <Sub key={child.label} node={child} path={`${path}-${j}`} data={data} depth={depth + 1} promo={isPromo} />
      ))}
    </section>
  );
}

const Category = memo(function Category({ node, index, data }) {
  const promo = data.iconKeyOf[node.label] === "promo";
  const orig = data.originalLabelOf[node.label];
  const photoCount = collectItems(node, data.itemsByLabel).filter((i) => i.picture_url).length;
  return (
    <section className="cv-category" data-mk-path={String(index)} aria-label={node.label} style={{ "--cv-n": index % 4 }}>
      <header className="cv-cat-head">
        <h2 className="cv-cat-title">
          <span className="cv-highlight">{node.label}</span>
        </h2>
        {orig ? (
          <p className="cv-orig cv-orig-head" lang="bg">
            {orig}
          </p>
        ) : null}
        <div className="cv-cat-meta">
          <span className="cv-count-sticker">{data.strings.items(countItems(node, data.itemsByLabel))}</span>
          {photoCount > 1 ? (
            <button type="button" className="cv-play" onClick={() => data.openFeedAt(index)}>
              ▶ {data.strings.watch}
            </button>
          ) : null}
        </div>
      </header>
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} promo={promo} data={data} />
      {node.children.map((child, j) => (
        <Sub key={child.label} node={child} path={`${index}-${j}`} data={data} depth={1} promo={promo} />
      ))}
    </section>
  );
});

export default function Board({ data }) {
  return data.nodes.map((node, i) => <Category key={node.label} node={node} index={i} data={data} />);
}
