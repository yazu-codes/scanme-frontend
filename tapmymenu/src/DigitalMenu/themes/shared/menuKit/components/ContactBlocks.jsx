import React from "react";
import { ClockIcon, PhoneIcon, WifiIcon } from "./Icons";

// Shared by the footer and the navigation drawer. Each line renders only
// when the owner has filled it in.

export function hasContacts(owner) {
  return Boolean(owner.menu_owner_phone || owner.menu_owner_working_schedule || owner.menu_owner_wifi);
}

export function Contacts({ owner, strings }) {
  const { menu_owner_phone: phone, menu_owner_working_schedule: schedule, menu_owner_wifi: wifi } = owner;
  return (
    <ul className="mk-contacts">
      {phone ? (
        <li>
          <PhoneIcon />
          <a href={`tel:${String(phone).replace(/\s+/g, "")}`}>{phone}</a>
        </li>
      ) : null}
      {schedule ? (
        <li>
          <ClockIcon />
          <span className="mk-prewrap">{schedule}</span>
        </li>
      ) : null}
      {wifi ? (
        <li>
          <WifiIcon />
          <span>
            {strings.wifi}: {wifi}
          </span>
        </li>
      ) : null}
    </ul>
  );
}

export function ReviewLinks({ links }) {
  const list = Array.isArray(links) ? links.filter((l) => l && l.url) : [];
  if (list.length === 0) return null;
  return (
    <ul className="mk-reviews">
      {list.map((link) => (
        <li key={link.url}>
          <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.title || link.url}>
            {link.image_url ? (
              <img src={link.image_url} alt="" loading="lazy" />
            ) : (
              <span className="mk-review-letter">{(link.title || "•").charAt(0)}</span>
            )}
            {link.title ? <span className="mk-review-label">{link.title}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
