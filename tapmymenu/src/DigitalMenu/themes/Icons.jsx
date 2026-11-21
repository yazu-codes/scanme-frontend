import React from "react";
import { Contacts, ReviewLinks, hasContacts } from "./ContactBlocks";
import { LanternOrnament } from "./Ornaments";

export default function Footer({ owner, strings }) {
  const name = owner.menu_owner_name || "";
  const reviews = owner.menu_owner_review_links;
  const year = new Date().getFullYear();

  return (
    <footer className="ln-footer ln-tone-a">
      <LanternOrnament className="ln-footer-orn" />
      {name ? <p className="ln-footer-name">{name}</p> : null}
      {owner.menu_owner_slogan ? <p className="ln-footer-slogan">{owner.menu_owner_slogan}</p> : null}
      {hasContacts(owner) ? <Contacts owner={owner} strings={strings} /> : null}
      <ReviewLinks links={reviews} />
      <p className="ln-legal">
        © {year}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
