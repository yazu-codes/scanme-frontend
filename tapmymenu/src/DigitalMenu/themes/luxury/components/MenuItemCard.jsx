import React from "react";
import { formatPrice, parseAllergens } from "../../../core";
import AllergenTag from "./AllergenTag";

function ItemImagePlaceholder() {
  return (
    // <div className="dml-item-image dml-item-image-placeholder" aria-hidden="true">
    //   <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
    //     <path
    //       d="M4 16.5 8.5 12l3 3L16 10l4 6.5"
    //       stroke="currentColor"
    //       strokeWidth="1.3"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     />
    //     <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    //     <rect
    //       x="3"
    //       y="4"
    //       width="18"
    //       height="16"
    //       rx="1"
    //       stroke="currentColor"
    //       strokeWidth="1.3"
    //     />
    //   </svg>
    // </div>
    <div></div>
  );
}

export default function MenuItemCard({ item, onSelect }) {
  const allergens = parseAllergens(item.allergens);

  return (
    <article
      className="dml-item-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className="dml-item-media">
        {item.picture_url ? (
          <img
            src={item.picture_url}
            alt={item.name}
            loading="lazy"
            className="dml-item-image"
          />
        ) : (
          <ItemImagePlaceholder />
        )}
      </div>

      <div className="dml-item-body">
        <div className="dml-item-title-row">
          <h3 className="dml-item-name">{item.name}</h3>
          <span className="dml-item-price">€{formatPrice(item.price)}</span>
        </div>

        {item.description ? (
          <p className="dml-item-description">{item.description}</p>
        ) : null}

        <div className="dml-item-allergens">
          <span className="dml-allergen-label">Allergens</span>
          {allergens.length > 0 ? (
            <div className="dml-allergen-list">
              {allergens.map((a) => (
                <AllergenTag key={a} allergen={a} />
              ))}
            </div>
          ) : (
            <span className="dml-allergen-empty">None listed</span>
          )}
        </div>
      </div>
    </article>
  );
}
