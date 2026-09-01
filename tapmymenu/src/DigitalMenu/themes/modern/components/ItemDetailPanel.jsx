import React, { useEffect, useRef } from "react";
import { formatPrice, parseAllergens } from "../../../core";
import AllergenTag from "./AllergenTag";

function PanelImagePlaceholder() {
  return (
    <div className="dml-panel-image dml-panel-image-placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
        <path
          d="M4 16.5 8.5 12l3 3L16 10l4 6.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Mobile-first: slides up from the bottom edge as a sheet, the standard
// native pattern on both iOS and Android, with a drag-handle affordance
// and safe-area padding so content never sits under the home indicator.
// At the desktop breakpoint (see modern-theme.css) it becomes a fixed-
// width side panel instead, same as Classic and Luxury — the component
// itself doesn't need to know which; that's handled entirely in CSS.
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
        className={"dml-panel-overlay" + (open ? " dml-panel-overlay-open" : "")}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={"dml-panel" + (open ? " dml-panel-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={item ? item.name : "Item details"}
      >
        {item ? (
          <>
            <span className="dml-panel-handle" aria-hidden="true" />

            <button
              type="button"
              className="dml-panel-close"
              onClick={onClose}
              ref={closeButtonRef}
              aria-label="Close item details"
            >
              <CloseIcon />
            </button>

            <div className="dml-panel-media">
              {item.picture_url ? (
                <img src={item.picture_url} alt={item.name} className="dml-panel-image" />
              ) : (
                <PanelImagePlaceholder />
              )}
            </div>

            <div className="dml-panel-content">
              <span className="dml-panel-category">{item.category}</span>
              <div className="dml-panel-title-row">
                <h2 className="dml-panel-name">{item.name}</h2>
                <span className="dml-panel-price">€{formatPrice(item.price)}</span>
              </div>

              {item.description ? (
                <p className="dml-panel-description">{item.description}</p>
              ) : null}

              <div className="dml-panel-allergens">
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
          </>
        ) : null}
      </aside>
    </>
  );
}
