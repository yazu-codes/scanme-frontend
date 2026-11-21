import React from "react";

// The reference's quiet trattoria masthead: letter-spaced small caps,
// the name in a heavy serif, an italic line under it.
export default function Header({ owner, strings, categoryCount }) {
  const name = owner.menu_owner_name || strings.menu;
  return (
    <header className="tr-header">
      {owner.menu_owner_logo_url ? <img className="tr-logo" src={owner.menu_owner_logo_url} alt="" /> : null}
      <p className="tr-kicker">
        {strings.menu} · {strings.categoriesCount(categoryCount)}
      </p>
      <h1 className="tr-name">{name}</h1>
      {owner.menu_owner_slogan ? <p className="tr-tagline">{owner.menu_owner_slogan}</p> : null}
    </header>
  );
}
