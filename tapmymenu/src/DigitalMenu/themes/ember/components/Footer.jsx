import React from "react";
import { Contacts, ReviewLinks, hasContacts } from "../../shared/menuKit";

// A smoked-glass panel with hours, phone and Wi-Fi, then reviews.
export default function Footer({ owner, strings }) {
  const name = owner.menu_owner_name || "";
  return (
    <footer className="em-footer">
      {hasContacts(owner) ? (
        <div className="em-footer-panel">
          <p className="em-footer-kicker">{strings.contacts}</p>
          <Contacts owner={owner} strings={strings} />
        </div>
      ) : null}
      <div className="em-footer-reviews">
        <ReviewLinks links={owner.menu_owner_review_links} />
      </div>
      {name ? <p className="em-footer-name">{name}</p> : null}
      <p className="em-legal">
        © {new Date().getFullYear()}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
