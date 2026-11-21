import React, { memo } from "react";
import { parseAllergens } from "../../../core";
import useReveal from "../hooks/useReveal";
import { formatEuro, splitWeight } from "../utils";
import { BowlOrnament } from "./Ornaments";

function activate(e, fn) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
}

const MAX_PILLS = 3;

function AllergenPills({ allergens }) {
  if (allergens.length === 0) return null;
  const shown = allergens.slice(0, MAX_PILLS);
  const rest = allergens.length - shown.length;
  return (
    <span className="ln-pills">
      {shown.map((a) => (
        <span key={a} className="ln-pill">
          {a}
        </span>
      ))}
      {rest > 0 ? <span className="ln-pill">+{rest}</span> : null}
    </span>
  );
}

// Poster card from the reference: the whole photo on top (never cropped),
// then name + allergen pills with the price on the right, the portion
// size as a small-caps line, and a two-line description.
// A dish without a photo inside a photo section gets a quiet placeholder
// in the same frame, so the grid stays even.
export const DishCard = memo(function DishCard({ item, onSelect }) {
  const [ref, shown] = useReveal();
  const { description, weight } = splitWeight(item.description);
  const allergens = parseAllergens(item.allergens);
  const open = () => onSelect(item);

  return (
    <article
      ref={ref}
      className={"ln-card" + (shown ? " ln-in" : "")}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => activate(e, open)}
      aria-label={`${item.name}, ${formatEuro(item.price)}`}
    >
      <div className={"ln-card-media" + (item.picture_url ? "" : " ln-card-media-empty")}>
        {item.picture_url ? (
          <img src={item.picture_url} alt="" loading="lazy" decoding="async" />
        ) : (
          <BowlOrnament className="ln-placeholder-orn" />
        )}
      </div>
      <div className="ln-card-body">
        <div className="ln-card-head">
          <div className="ln-card-title">
            <h4 className="ln-card-name">{item.name}</h4>
            {item.original_name ? (
              <p className="ln-orig" lang="bg">
                {item.original_name}
              </p>
            ) : null}
            <AllergenPills allergens={allergens} />
          </div>
          <span className="ln-price">{formatEuro(item.price)}</span>
        </div>
        {weight ? <p className="ln-meta">{weight}</p> : null}
        {description ? <p className="ln-card-desc">{description}</p> : null}
      </div>
    </article>
  );
});

// Compact text row for photo-less sections (typically drinks):
// name · dotted leader · price, then original name, size and a one-line
// description. Keeps a 60-item wine list easy to scan.
export const DishRow = memo(function DishRow({ item, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  const open = () => onSelect(item);

  return (
    <article
      className="ln-row"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => activate(e, open)}
      aria-label={`${item.name}, ${formatEuro(item.price)}`}
    >
      <div className="ln-row-main">
        <h4 className="ln-row-name">{item.name}</h4>
        <span className="ln-row-dots" aria-hidden="true" />
        <span className="ln-price">{formatEuro(item.price)}</span>
      </div>
      {item.original_name ? (
        <p className="ln-orig" lang="bg">
          {item.original_name}
        </p>
      ) : null}
      {weight || description ? (
        <p className="ln-row-sub">
          {weight ? <span className="ln-meta ln-meta-inline">{weight}</span> : null}
          {description ? <span className="ln-row-desc">{description}</span> : null}
        </p>
      ) : null}
    </article>
  );
});
