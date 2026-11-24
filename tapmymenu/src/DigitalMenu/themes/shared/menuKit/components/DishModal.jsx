import React, { useEffect, useRef } from "react";
import { parseAllergens } from "../../../../core";
import { formatEuro, splitWeight } from "../menuData";
import { CloseIcon } from "./Icons";
import CategoryIcon from "./CategoryIcon";

// placeholder: a node, or a function (item) => node, shown when the dish
// has no photo (defaults to the cloche icon).
//
// Shared dish detail for menuKit themes (styled by menu-kit.css and the
// theme's --mk-* variables). A bottom sheet on phones, a centred card from tablet up.
// Closes on ✕, backdrop tap, Escape and (through useBackToClose in
// useMenuKit) the back gesture. Keeps showing the last dish while it
// animates out.
export default function DishModal({ item, open, onClose, strings, placeholder }) {
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
    <div className={"mk-modal" + (open ? " mk-modal-open" : "")} aria-hidden={!open} onClick={onClose}>
      <div
        className="mk-sheet"
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
              className="mk-close"
              onClick={onClose}
              aria-label={strings.close}
              tabIndex={open ? 0 : -1}
            >
              <CloseIcon />
            </button>

            <div className={"mk-sheet-media" + (item.picture_url ? "" : " mk-sheet-media-empty")}>
              {item.picture_url ? (
                <img src={item.picture_url} alt={item.name} />
              ) : (
                <span className="mk-placeholder">
                  {(typeof placeholder === "function" ? placeholder(item) : placeholder) || (
                    <CategoryIcon iconKey="cloche" size={56} />
                  )}
                </span>
              )}
            </div>

            <div className="mk-sheet-body">
              {item.category ? <p className="mk-kicker">{item.category}</p> : null}
              <h2 className="mk-sheet-name">{item.name}</h2>
              {item.original_name ? (
                <p className="mk-orig" lang="bg">
                  {item.original_name}
                </p>
              ) : null}

              {description ? <p className="mk-sheet-desc">{description}</p> : null}

              {item.original_name || item.original_description ? (
                <div className="mk-staff" lang="bg">
                  <p className="mk-staff-label">{strings.showStaff}</p>
                  {item.original_name ? <p className="mk-staff-name">{item.original_name}</p> : null}
                  {item.original_description ? (
                    <p className="mk-staff-desc">{item.original_description}</p>
                  ) : null}
                </div>
              ) : null}

              {weight || allergens.length ? (
                <dl className="mk-facts">
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

              <div className="mk-sheet-price">
                <span className="mk-kicker">{strings.price}</span>
                <span className="mk-sheet-price-value">{formatEuro(item.price)}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
