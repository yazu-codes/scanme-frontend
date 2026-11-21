import React, { useEffect, useRef } from "react";
import { parseAllergens } from "../../../core";
import { formatEuro, splitWeight } from "../utils";
import { CloseIcon } from "./Icons";
import { BowlOrnament } from "./Ornaments";

// Dish detail: a bottom sheet on phones, a centred card from tablet up.
// Closes on ✕, backdrop tap, Escape and (through useBackToClose in
// Theme.jsx) the back gesture. Keeps showing the last dish while it
// animates out.
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
    <div className={"ln-modal ln-tone-a" + (open ? " ln-modal-open" : "")} aria-hidden={!open} onClick={onClose}>
      <div
        className="ln-sheet"
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
              className="ln-close"
              onClick={onClose}
              aria-label={strings.close}
              tabIndex={open ? 0 : -1}
            >
              <CloseIcon />
            </button>

            <div className={"ln-sheet-media" + (item.picture_url ? "" : " ln-sheet-media-empty")}>
              {item.picture_url ? (
                <img src={item.picture_url} alt={item.name} />
              ) : (
                <BowlOrnament className="ln-placeholder-orn" />
              )}
            </div>

            <div className="ln-sheet-body">
              {item.category ? <p className="ln-kicker">{item.category}</p> : null}
              <h2 className="ln-sheet-name">{item.name}</h2>
              {item.original_name ? (
                <p className="ln-orig" lang="bg">
                  {item.original_name}
                </p>
              ) : null}

              {description ? <p className="ln-sheet-desc">{description}</p> : null}

              {item.original_name || item.original_description ? (
                <div className="ln-staff" lang="bg">
                  <p className="ln-staff-label">{strings.showStaff}</p>
                  {item.original_name ? <p className="ln-staff-name">{item.original_name}</p> : null}
                  {item.original_description ? (
                    <p className="ln-staff-desc">{item.original_description}</p>
                  ) : null}
                </div>
              ) : null}

              {weight || allergens.length ? (
                <dl className="ln-facts">
                  {weight ? (
                    <div>
                      <dt>{strings.weight}</dt>
                      <dd>{weight}</dd>
                    </div>
                  ) : null}
                  {allergens.length ? (
                    <div>
                      <dt>{strings.allergens}</dt>
                      <dd>{allergens.join(", ")}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}

              <div className="ln-sheet-price">
                <span className="ln-kicker">{strings.price}</span>
                <span className="ln-sheet-price-value">{formatEuro(item.price)}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
