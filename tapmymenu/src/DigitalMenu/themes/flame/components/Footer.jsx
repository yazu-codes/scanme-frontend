import React from "react";
import { Contacts, ReviewLinks, hasContacts } from "../../shared/menuKit";

export default function Footer({ owner, strings }) {
  const name = owner.menu_owner_name || "";
  const phone = owner.menu_owner_phone;
  return (
    <footer className="fl-footer">
      {phone ? (
        <a className="fl-call" href={`tel:${String(phone).replace(/\s+/g, "")}`}>
          <span className="fl-call-label">{strings.call}</span>
          <span className="fl-call-number">{phone}</span>
        </a>
      ) : null}
      {hasContacts(owner) ? <Contacts owner={{ ...owner, menu_owner_phone: undefined }} strings={strings} /> : null}
      <div className="fl-footer-reviews">
        <ReviewLinks links={owner.menu_owner_review_links} />
      </div>
      <p className="fl-legal">
        © {new Date().getFullYear()}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
