import React from "react";
import { formatPrice, parseAllergens } from "../../../core";
import AllergenTag from "./AllergenTag";

function ItemImagePlaceholder() {
  return (
    <div className="dm-item-image dm-item-image-placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
        <path
          d="M4 16.5 8.5 12l3 3L16 10l4 6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.6" fill="currentColor" />
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export default function MenuItemCard({ item, onSelect }) {
  const allergens = parseAllergens(item.allergens);

  return (
    <article
      className="dm-item-card"
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
      <div className="dm-item-media">
        {item.picture_url ? (
          <img
            src={item.picture_url}
            alt={item.name}
            loading="lazy"
            className="dm-item-image"
          />
        ) : (
          <ItemImagePlaceholder />
        )}
      </div>

      <div className="dm-item-body">
        <div className="dm-item-title-row">
          <h3 className="dm-item-name">{item.name}</h3>
          <span className="dm-item-price">€{formatPrice(item.price)}</span>
        </div>

        {item.description ? (
          <p className="dm-item-description">{item.description}</p>
        ) : null}

        <div className="dm-item-allergens">
          <span className="dm-allergen-label">Allergens</span>
          {allergens.length > 0 ? (
            <div className="dm-allergen-list">
              {allergens.map((a) => (
                <AllergenTag key={a} allergen={a} />
              ))}
            </div>
          ) : (
            <span className="dm-allergen-empty">None listed</span>
          )}
        </div>
      </div>
    </article>
  );
}
