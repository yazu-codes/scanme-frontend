import React, { useEffect, useRef } from "react";
import { Contacts, SocialLinks, hasContacts } from "./ContactBlocks";

// Full-screen hamburger menu: categories as large serif links, then
// contacts and social links. Fades in, links rise in one after another.
export default function NavDrawer({ open, owner, nodes, activeIndex, strings, onClose, onHome, onOpenCategory }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const name = owner.menu_owner_name || "";

  return (
    <div className={"nr-drawer" + (open ? " nr-drawer-open" : "")} aria-hidden={!open}>
      <div className="nr-drawer-top">
        <button type="button" className="nr-brand" onClick={onHome} tabIndex={open ? 0 : -1}>
          {owner.menu_owner_logo_url ? <img className="nr-brand-logo" src={owner.menu_owner_logo_url} alt="" /> : null}
          {name ? <span className="nr-brand-name">{name}</span> : null}
        </button>
        <button
          type="button"
          ref={closeRef}
          className="nr-modal-close nr-drawer-close"
          onClick={onClose}
          aria-label={strings.close}
          tabIndex={open ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="nr-drawer-body" aria-label={strings.navigation}>
        <p className="nr-footer-heading">{strings.menu}</p>
        <ul className="nr-drawer-links">
          {nodes.map((node, i) => (
            <li key={node.label} style={{ "--i": i }}>
              <button
                type="button"
                className={i === activeIndex ? "nr-drawer-active" : ""}
                onClick={() => onOpenCategory(i)}
                tabIndex={open ? 0 : -1}
              >
                {node.label}
              </button>
            </li>
          ))}
        </ul>

        {hasContacts(owner) ? (
          <div className="nr-drawer-block">
            <p className="nr-footer-heading">{strings.contacts}</p>
            <Contacts owner={owner} strings={strings} />
          </div>
        ) : null}

        {Array.isArray(owner.menu_owner_review_links) && owner.menu_owner_review_links.length ? (
          <div className="nr-drawer-block">
            <p className="nr-footer-heading">{strings.followUs}</p>
            <SocialLinks links={owner.menu_owner_review_links} />
          </div>
        ) : null}
      </nav>
    </div>
  );
}
