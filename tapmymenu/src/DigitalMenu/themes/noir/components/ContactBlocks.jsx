import React from "react";

// Shared by the footer and the hamburger drawer: contacts list and the
// owner's review / social links (menu_owner_review_links).

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function hasContacts(owner) {
  return Boolean(owner.menu_owner_phone || owner.menu_owner_working_schedule || owner.menu_owner_wifi);
}

export function Contacts({ owner, strings }) {
  const { menu_owner_phone: phone, menu_owner_working_schedule: schedule, menu_owner_wifi: wifi } = owner;
  return (
    <ul className="nr-contacts">
      {phone ? (
        <li>
          <PhoneIcon />
          <a href={`tel:${String(phone).replace(/\s+/g, "")}`}>{phone}</a>
        </li>
      ) : null}
      {schedule ? (
        <li>
          <ClockIcon />
          <span className="nr-prewrap">{schedule}</span>
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

export function SocialLinks({ links }) {
  if (!Array.isArray(links) || links.length === 0) return null;
  return (
    <ul className="nr-social">
      {links
        .filter((l) => l && l.url)
        .map((link) => (
          <li key={link.url}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.title || link.url}>
              {link.image_url ? (
                <img src={link.image_url} alt="" loading="lazy" />
              ) : (
                <span>{(link.title || "•").charAt(0)}</span>
              )}
              <span className="nr-social-label">{link.title}</span>
            </a>
          </li>
        ))}
    </ul>
  );
}
