import React, { useEffect, useRef } from "react";
import { formatPrice, parseAllergens } from "../../../core";
import AllergenTag from "./AllergenTag";

function PanelImagePlaceholder() {
  return (
    <div className="dm-panel-image dm-panel-image-placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="44" height="44" fill="none">
        <path
          d="M4 16.5 8.5 12l3 3L16 10l4 6.5"
          stroke="currentColor"
          strokeWidth="1.4"
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
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Slide-in detail panel. Enters from the right edge of the screen and
// covers the full viewport width on mobile, narrowing to a fixed-width
// side panel on larger screens.
export default function ItemDetailPanel({ item, open, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const allergens = item ? parseAllergens(item.allergens) : [];

  return (
    <>
      <div
        className={"dm-panel-overlay" + (open ? " dm-panel-overlay-open" : "")}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={"dm-panel" + (open ? " dm-panel-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={item ? item.name : "Item details"}
      >
        {item ? (
          <>
            <button
              type="button"
              className="dm-panel-close"
              onClick={onClose}
              ref={closeButtonRef}
              aria-label="Close item details"
            >
              <CloseIcon />
            </button>

            <div className="dm-panel-media">
              {item.picture_url ? (
                <img
                  src={item.picture_url}
                  alt={item.name}
                  className="dm-panel-image"
                />
              ) : (
                <PanelImagePlaceholder />
              )}
            </div>

            <div className="dm-panel-content">
              <span className="dm-panel-category">{item.category}</span>
              <div className="dm-panel-title-row">
                <h2 className="dm-panel-name">{item.name}</h2>
                <span className="dm-panel-price">€{formatPrice(item.price)}</span>
              </div>

              {item.description ? (
                <p className="dm-panel-description">{item.description}</p>
              ) : null}

              <div className="dm-panel-allergens">
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
          </>
        ) : null}
      </aside>
    </>
  );
}
