import React from "react";
import { formatPrice, parseAllergens } from "../../../core";
import AllergenTag from "./AllergenTag";

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
      {item.picture_url ? (
        <div className="dml-item-media">
          <img
            src={item.picture_url}
            alt={item.name}
            loading="lazy"
            className="dml-item-image"
          />
        </div>
      ) : null}

      <div className="dml-item-body">
        <div className="dml-item-title-row">
          <h3 className="dml-item-name">{item.name}</h3>
          <span className="dml-item-price">
            €{formatPrice(item.price)}
          </span>
        </div>

        {item.description ? (
          <p className="dml-item-description">
            {item.description}
          </p>
        ) : null}

        {allergens.length > 0 ? (
          <div className="dml-item-allergens">
            <div className="dml-allergen-list">
              {allergens.map((a) => (
                <AllergenTag key={a} allergen={a} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}