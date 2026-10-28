import React from "react";
import useReveal from "../hooks/useReveal";
import { formatEuro, splitWeight } from "../utils";

function activate(e, fn) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
}

// Photo card: big image, serif name, two-line description, portion size
// bottom-left and the gold price bottom-right. Dishes without a photo in
// a photo section get the same card minus the image.
export default function DishCard({ item, onSelect }) {
  const [ref, shown] = useReveal();
  const { description, weight } = splitWeight(item.description);
  const open = () => onSelect(item);

  return (
    <article
      ref={ref}
      className={"nr-dish" + (item.picture_url ? "" : " nr-dish-text") + (shown ? " nr-in" : "")}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => activate(e, open)}
      aria-label={`${item.name}, ${formatEuro(item.price)}`}
    >
      {item.picture_url ? (
        <div className="nr-dish-media">
          <img className="nr-dish-image" src={item.picture_url} alt={item.name} loading="lazy" />
        </div>
      ) : null}

      <div className="nr-dish-body">
        <h3 className="nr-dish-name">{item.name}</h3>
        {item.original_name ? (
          <p className="nr-orig" lang="bg">
            {item.original_name}
          </p>
        ) : null}
        {description ? <p className="nr-dish-desc">{description}</p> : null}
        <div className="nr-dish-foot">
          <span className="nr-dish-weight">{weight}</span>
          <span className="nr-price">{formatEuro(item.price)}</span>
        </div>
      </div>
    </article>
  );
}

// Text-only row from the reference's set-menu page: name left, price
// right, portion size underneath.
export function DishRow({ item, onSelect }) {
  const [ref, shown] = useReveal();
  const { description, weight } = splitWeight(item.description);
  const open = () => onSelect(item);

  return (
    <article
      ref={ref}
      className={"nr-row" + (shown ? " nr-in" : "")}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => activate(e, open)}
      aria-label={`${item.name}, ${formatEuro(item.price)}`}
    >
      <div className="nr-row-main">
        <h3 className="nr-row-name">{item.name}</h3>
        <span className="nr-price">{formatEuro(item.price)}</span>
      </div>
      {item.original_name ? (
        <p className="nr-orig" lang="bg">
          {item.original_name}
        </p>
      ) : null}
      {weight ? <p className="nr-row-weight">{weight}</p> : null}
      {description ? <p className="nr-row-desc">{description}</p> : null}
    </article>
  );
}
