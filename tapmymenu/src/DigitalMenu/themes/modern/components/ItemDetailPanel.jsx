import React, { useEffect, useRef } from "react";
import { formatPrice, parseAllergens } from "../../../core";
import AllergenTag from "./AllergenTag";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ItemDetailPanel({
  item,
  open,
  onClose,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "keydown",
        handleKeyDown
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  const allergens = item
    ? parseAllergens(item.allergens)
    : [];

  return (
    <>
      <div
        className={
          "dml-panel-overlay" +
          (open ? " dml-panel-overlay-open" : "")
        }
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={
          "dml-panel" +
          (open ? " dml-panel-open" : "")
        }
        role="dialog"
        aria-modal="true"
        aria-label={item ? item.name : "Item details"}
      >
        {item ? (
          <>
            <span
              className="dml-panel-handle"
              aria-hidden="true"
            />

            <button
              type="button"
              className="dml-panel-close"
              onClick={onClose}
              ref={closeButtonRef}
              aria-label="Close item details"
            >
              <CloseIcon />
            </button>

            {item.picture_url ? (
              <div className="dml-panel-media">
                <img
                  src={item.picture_url}
                  alt={item.name}
                  className="dml-panel-image"
                />
              </div>
            ) : null}

            <div className="dml-panel-content">
              <span className="dml-panel-category">
                {item.category}
              </span>

              <div className="dml-panel-title-row">
                <h2 className="dml-panel-name">
                  {item.name}
                </h2>

                <span className="dml-panel-price">
                  €{formatPrice(item.price)}
                </span>
              </div>

              {item.description ? (
                <p className="dml-panel-description">
                  {item.description}
                </p>
              ) : null}

              <div className="dml-panel-allergens">
                <span className="dml-allergen-label">
                  Allergens
                </span>

                {allergens.length > 0 ? (
                  <div className="dml-allergen-list">
                    {allergens.map((a) => (
                      <AllergenTag
                        key={a}
                        allergen={a}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="dml-allergen-empty">
                    None listed
                  </span>
                )}
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}