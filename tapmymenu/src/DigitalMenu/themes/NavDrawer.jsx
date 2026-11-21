import React from "react";
import { BurgerIcon, InfoIcon, PhoneIcon } from "./Icons";
import { hasContacts } from "./ContactBlocks";

// The reference's thin outlined action row (CALL · DIRECTIONS · ORDER
// ONLINE), built only from what the owner has filled in: the full menu,
// a tel: link, and contacts/hours/Wi-Fi (opens the drawer at contacts).
export default function ActionBar({ owner, strings, onMenu, onInfo }) {
  const phone = owner.menu_owner_phone;
  return (
    <div className="ln-actions">
      <button type="button" className="ln-action" onClick={onMenu}>
        <BurgerIcon size={14} />
        <span>{strings.menu}</span>
      </button>
      {phone ? (
        <a className="ln-action" href={`tel:${String(phone).replace(/\s+/g, "")}`}>
          <PhoneIcon />
          <span>{strings.call}</span>
        </a>
      ) : null}
      {hasContacts(owner) ? (
        <button type="button" className="ln-action" onClick={onInfo}>
          <InfoIcon />
          <span>{strings.info}</span>
        </button>
      ) : null}
    </div>
  );
}
