import React from "react";

// The reference's neon-diner sign: a rounded badge in the accent colour
// with a script word on top and the restaurant name in tall condensed
// capitals, flanked by racing stripes. The owner logo sits above it.
export default function Sign({ owner, strings }) {
  const name = owner.menu_owner_name || strings.menu;
  return (
    <header className="dn-header">
      {owner.menu_owner_logo_url ? (
        <img className="dn-logo" src={owner.menu_owner_logo_url} alt="" />
      ) : null}
      <div className="dn-sign">
        <span className="dn-stripes dn-stripes-left" aria-hidden="true" />
        <div className="dn-badge">
          <p className="dn-script">{strings.welcome}</p>
          <h1 className="dn-name">{name}</h1>
        </div>
        <span className="dn-stripes dn-stripes-right" aria-hidden="true" />
      </div>
      {owner.menu_owner_slogan ? <p className="dn-slogan">{owner.menu_owner_slogan}</p> : null}
    </header>
  );
}
