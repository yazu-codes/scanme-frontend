import React, { useEffect, useRef } from "react";
import Ornament from "./Ornament";
import { parseAllergens } from "../../../core";
import { formatEuro, splitWeight } from "../utils";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Centred card over a blurred, dimmed page. Keeps rendering the last
// item while it animates out.
export default function DishModal({ item, open, onClose, strings }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const { description, weight } = splitWeight(item ? item.description : "");
  const allergens = item ? parseAllergens(item.allergens) : [];

  return (
    <div
      className={"nr-modal" + (open ? " nr-modal-open" : "")}
      aria-hidden={!open}
      onClick={onClose}
    >
      <div
        className="nr-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={item ? item.name : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {item ? (
          <>
            <button
              type="button"
              ref={closeRef}
              className="nr-modal-close"
              onClick={onClose}
              aria-label={strings.close}
              tabIndex={open ? 0 : -1}
            >
              <CloseIcon />
            </button>

            {item.picture_url ? (
              <div className="nr-modal-media">
                <img src={item.picture_url} alt={item.name} />
              </div>
            ) : (
              <div className="nr-modal-spacer" />
            )}

            <div className="nr-modal-body">
              <p className="nr-modal-kicker">{item.category}</p>
              <h2 className="nr-modal-name">{item.name}</h2>
              <Ornament bare className="nr-ornament-left" />
              {description ? <p className="nr-modal-desc">{description}</p> : null}

              {item.original_name || item.original_description ? (
                <div className="nr-staff" lang="bg">
                  <p className="nr-staff-label">{strings.showStaff}</p>
                  {item.original_name ? <p className="nr-staff-name">{item.original_name}</p> : null}
                  {item.original_description ? (
                    <p className="nr-staff-desc">{item.original_description}</p>
                  ) : null}
                </div>
              ) : null}

              {weight || allergens.length ? (
                <dl className="nr-modal-facts">
                  {weight ? (
                    <div>
                      <dt>{strings.weight}:</dt>
                      <dd>{weight}</dd>
                    </div>
                  ) : null}
                  {allergens.length ? (
                    <div>
                      <dt>{strings.allergens}:</dt>
                      <dd>{allergens.join(", ")}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}

              <div className="nr-modal-price">
                <span className="nr-modal-price-label">{strings.price}</span>
                <span className="nr-modal-price-value">{formatEuro(item.price)}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
