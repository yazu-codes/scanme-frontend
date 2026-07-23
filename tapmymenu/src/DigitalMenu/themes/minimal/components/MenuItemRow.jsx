import React, { useState } from "react";
import { formatPrice, parseAllergens } from "../../../core";

// No slide-in panel here — details expand inline. Local, per-row state
// only; nothing shared, nothing to plumb up to the theme root.
export default function MenuItemRow({ item }) {
  const [expanded, setExpanded] = useState(false);
  const allergens = parseAllergens(item.allergens);
  const hasDetails = Boolean(item.description) || allergens.length > 0;

  return (
    <div className="dmm-item-row">
      <button
        type="button"
        className="dmm-item-header"
        onClick={() => hasDetails && setExpanded((v) => !v)}
        aria-expanded={expanded}
        disabled={!hasDetails}
      >
        <span className="dmm-item-name">{item.name}</span>
        <span className="dmm-item-leader" aria-hidden="true" />
        <span className="dmm-item-price">€{formatPrice(item.price)}</span>
      </button>

      {expanded ? (
        <div className="dmm-item-details">
          {item.description ? (
            <p className="dmm-item-description">{item.description}</p>
          ) : null}
          {allergens.length > 0 ? (
            <p className="dmm-item-allergens">Contains: {allergens.join(", ")}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
