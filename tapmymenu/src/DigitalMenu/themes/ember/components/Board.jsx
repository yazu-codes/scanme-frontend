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
  useReveal,
  visibleItems,
} from "../../shared/menuKit";

// Flavour notes, honestly: taken from what the owner wrote in the
// description ("мента, лимон и лед" -> мента · лимон · лед). There is no
// strength or popularity data in the API, so none is shown.
export function flavourNotes(description) {
  const text = String(description || "").trim();
  if (!text) return { notes: [], text: "" };
  const parts = text
    .split(/\s*(?:,|;|\+|&|\/|\s+и\s+|\s+and\s+|\s+with\s+|\s+с\s+)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2 || parts.length > 6 || parts.some((p) => p.length > 24)) return { notes: [], text };
  return { notes: parts, text: "" };
}

// Shisha flavour tile: a smoked-glass tile that glows on touch, the
// flavour in serif, its notes as small brass-outlined chips.
const FlavourTile = memo(function FlavourTile({ item, icon, onSelect }) {
  const [ref, shown] = useReveal();
  const { description, weight } = splitWeight(item.description);
  const { notes, text } = flavourNotes(description);
  return (
    <article
      ref={ref}
      className={"em-flavour" + (shown ? " em-in" : "")}
      {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}
    >
      <span className="em-flavour-icon" aria-hidden="true">
        <CategoryIcon iconKey={icon} size={26} />
      </span>
      <h4 className="em-flavour-name">{item.name}</h4>
      <OriginalName item={item} className="em-orig" />
      {notes.length ? (
        <p className="em-notes">
          {notes.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </p>
      ) : text ? (
        <p className="em-flavour-text">{text}</p>
      ) : null}
      <p className="em-flavour-foot">
        <span className="em-price">{formatEuro(item.price)}</span>
        {weight ? <span className="em-weight">{weight}</span> : null}
      </p>
    </article>
  );
});

// Dish with a photo: smoked-glass card, whole photo (4:3, never cropped)
// on the left, text on the right.
const GlassCard = memo(function GlassCard({ item, onSelect }) {
  const [ref, shown] = useReveal();
  const { description, weight } = splitWeight(item.description);
  return (
    <article
      ref={ref}
      className={"em-card" + (shown ? " em-in" : "")}
      {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}
    >
      <span className="em-card-photo">
        {item.picture_url ? <img src={item.picture_url} alt="" loading="lazy" decoding="async" /> : null}
      </span>
      <div className="em-card-body">
        <h4 className="em-card-name">{item.name}</h4>
        <OriginalName item={item} className="em-orig" />
        {description ? <p className="em-card-desc">{description}</p> : null}
        <p className="em-card-foot">
          <span className="em-price">{formatEuro(item.price)}</span>
          {weight ? <span className="em-weight">{weight}</span> : null}
        </p>
      </div>
    </article>
  );
});

// Everything else (cocktails, drinks): a quiet line with a hairline.
const Line = memo(function Line({ item, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  return (
    <article className="em-line" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      <div className="em-line-main">
        <h4 className="em-line-name">{item.name}</h4>
        <span className="em-line-rule" aria-hidden="true" />
        <span className="em-price">{formatEuro(item.price)}</span>
      </div>
      <OriginalName item={item} className="em-orig" />
      {weight || description ? (
        <p className="em-line-sub">
          {weight ? <span className="em-weight">{weight}</span> : null}
          {description ? <span className="em-line-desc">{description}</span> : null}
        </p>
      ) : null}
      <Allergens allergens={item.allergens} className="em-allergens" />
    </article>
  );
});

function Dishes({ items, shisha, onSelect }) {
  if (items.length === 0) return null;
  if (shisha) {
    return (
      <div className="em-flavours">
        {items.map((item, i) => (
          <FlavourTile key={dishKey(item, i)} item={item} icon="hookah" onSelect={onSelect} />
        ))}
      </div>
    );
  }
  const photos = items.filter((i) => i.picture_url);
  const lines = items.filter((i) => !i.picture_url);
  return (
    <>
      {photos.length ? (
        <div className="em-cards">
          {photos.map((item, i) => (
            <GlassCard key={dishKey(item, i)} item={item} onSelect={onSelect} />
          ))}
        </div>
      ) : null}
      {lines.length ? (
        <div className="em-lines">
          {lines.map((item, i) => (
            <Line key={dishKey(item, i)} item={item} onSelect={onSelect} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function Sub({ node, path, data, depth, shisha }) {
  const isShisha = shisha || data.iconKeyOf[node.label] === "hookah";
  const orig = data.originalLabelOf[node.label];
  return (
    <section className={`em-sub em-sub-${Math.min(depth, 3)}`} data-mk-path={path} aria-label={node.label}>
      <h3 className="em-sub-title">
        <span>{node.label}</span>
        <span className="em-sub-count">{countItems(node, data.itemsByLabel)}</span>
      </h3>
      {orig ? (
        <p className="em-orig em-orig-head" lang="bg">
          {orig}
        </p>
      ) : null}
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} shisha={isShisha} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Sub key={child.label} node={child} path={`${path}-${j}`} data={data} depth={depth + 1} shisha={isShisha} />
      ))}
    </section>
  );
}

const Category = memo(function Category({ node, index, data }) {
  const shisha = data.iconKeyOf[node.label] === "hookah";
  const orig = data.originalLabelOf[node.label];
  return (
    <section
      className={"em-category" + (shisha ? " em-category-shisha" : "")}
      data-mk-path={String(index)}
      aria-label={node.label}
    >
      <header className="em-cat-head">
        <span className="em-cat-no">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="em-cat-title">{node.label}</h2>
        {orig ? (
          <p className="em-orig em-orig-head" lang="bg">
            {orig}
          </p>
        ) : null}
        <p className="em-cat-count">{data.strings.items(countItems(node, data.itemsByLabel))}</p>
      </header>
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} shisha={shisha} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Sub key={child.label} node={child} path={`${index}-${j}`} data={data} depth={1} shisha={shisha} />
      ))}
    </section>
  );
});

export default function Board({ data }) {
  return data.nodes.map((node, i) => <Category key={node.label} node={node} index={i} data={data} />);
}
