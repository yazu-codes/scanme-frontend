import React from "react";
import { Contacts, SocialLinks, hasContacts } from "./ContactBlocks";

export default function Footer({ owner, nodes, strings, onOpenCategory }) {
  const name = owner.menu_owner_name || "";
  const logo = owner.menu_owner_logo_url;
  const links = owner.menu_owner_review_links;
  const year = new Date().getFullYear();

  return (
    <footer className="nr-footer">
      <div className="nr-footer-inner">
        <div className="nr-footer-brand">
          {logo ? <img className="nr-footer-logo" src={logo} alt="" /> : null}
          {name ? <p className="nr-footer-name">{name}</p> : null}
          {owner.menu_owner_slogan ? <p className="nr-footer-text">{owner.menu_owner_slogan}</p> : null}
        </div>

        {nodes.length ? (
          <div className="nr-footer-col">
            <p className="nr-footer-heading">{strings.navigation}</p>
            <ul className="nr-footer-nav">
              {nodes.map((node, i) => (
                <li key={node.label}>
                  <button type="button" onClick={() => onOpenCategory(i)}>
                    {node.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasContacts(owner) ? (
          <div className="nr-footer-col">
            <p className="nr-footer-heading">{strings.contacts}</p>
            <Contacts owner={owner} strings={strings} />
          </div>
        ) : null}

        {Array.isArray(links) && links.length ? (
          <div className="nr-footer-col">
            <p className="nr-footer-heading">{strings.followUs}</p>
            <SocialLinks links={links} />
          </div>
        ) : null}
      </div>

      <p className="nr-footer-legal">
        © {year} {name}. {strings.rights}
      </p>
    </footer>
  );
}
