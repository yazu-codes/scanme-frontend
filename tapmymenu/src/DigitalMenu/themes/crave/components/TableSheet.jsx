import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, dishIdentity, formatEuro } from "../../shared/menuKit";

function sum(items) {
  const cents = items.reduce((s, i) => s + Math.round(Number(i.price) * 100 || 0), 0);
  return cents / 100;
}

// "My table": the craved dishes, saved on this phone. One tap switches
// to "show the staff": big type, original (Bulgarian) names first, so a
// guest can just turn the phone around. Closes on ✕, backdrop, Escape
// and back (useBackToClose in Theme.jsx).
export default function TableSheet({ open, items, strings, onClose, onRemove, onClear, onOpenItem, covered }) {
  const [staffMode, setStaffMode] = useState(false);
  const closeRef = useRef(null);
  const coveredRef = useRef(covered);
  useEffect(() => {
    coveredRef.current = covered;
  }, [covered]);

  useEffect(() => {
    if (!open) {
      setStaffMode(false);
      return undefined;
    }
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    function onKey(e) {
      // The detail sheet above handles its own Escape.
      if (e.key === "Escape" && !coveredRef.current) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={"cv-table" + (open ? " cv-table-open" : "")} aria-hidden={!open} onClick={onClose}>
      <div
        className={"cv-table-sheet" + (staffMode ? " cv-table-staff" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={strings.myTable}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cv-table-head">
          <h2 className="cv-table-title">{staffMode ? strings.forStaff : strings.myTable}</h2>
          <button type="button" ref={closeRef} className="mk-close mk-close-static" onClick={onClose} aria-label={strings.close} tabIndex={open ? 0 : -1}>
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cv-table-empty">{strings.tableEmpty}</p>
        ) : (
          <>
            <ol className="cv-table-list">
              {items.map((item) => (
                <li key={dishIdentity(item)} className="cv-table-item">
                  <button type="button" className="cv-table-dish" onClick={() => onOpenItem(item)} tabIndex={open ? 0 : -1}>
                    {staffMode && item.original_name ? (
                      <>
                        <span className="cv-table-name" lang="bg">
                          {item.original_name}
                        </span>
                        <span className="cv-table-sub">{item.name}</span>
                      </>
                    ) : (
                      <>
                        <span className="cv-table-name">{item.name}</span>
                        {item.original_name ? (
                          <span className="cv-table-sub" lang="bg">
                            {item.original_name}
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>
                  <span className="cv-table-price">{formatEuro(item.price)}</span>
                  {staffMode ? null : (
                    <button type="button" className="cv-table-remove" onClick={() => onRemove(item)} aria-label={`${strings.remove}: ${item.name}`} tabIndex={open ? 0 : -1}>
                      <CloseIcon size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ol>
            <div className="cv-table-total">
              <span>{strings.total}</span>
              <span className="cv-table-total-value">{formatEuro(sum(items).toFixed(2))}</span>
            </div>
            <div className="cv-table-actions">
              <button type="button" className="cv-btn cv-btn-main" onClick={() => setStaffMode((s) => !s)} tabIndex={open ? 0 : -1}>
                {staffMode ? strings.backToList : strings.showStaffBtn}
              </button>
              {staffMode ? null : (
                <button type="button" className="cv-btn" onClick={onClear} tabIndex={open ? 0 : -1}>
                  {strings.clear}
                </button>
              )}
            </div>
            <p className="cv-table-note">{strings.tableNote}</p>
          </>
        )}
      </div>
    </div>
  );
}
