import React from "react";
import { CategoryIcon } from "../../shared/menuKit";

// Title screen: emblem in a brass ring, tracked small caps, the name in
// a large light serif, the slogan, a brass hairline. Shown on the home
// level only.
export default function Header({ owner, strings, itemCount }) {
  const name = owner.menu_owner_name || strings.menu;
  return (
    <header className="em-header">
      <div className="em-emblem">
        {owner.menu_owner_logo_url ? (
          <img src={owner.menu_owner_logo_url} alt="" />
        ) : (
          <CategoryIcon iconKey="hookah" size={40} />
        )}
      </div>
      <p className="em-kicker">
        {strings.lounge} · {strings.items(itemCount)}
      </p>
      <h1 className="em-name">{name}</h1>
      {owner.menu_owner_slogan ? <p className="em-slogan">{owner.menu_owner_slogan}</p> : null}
      <span className="em-rule" aria-hidden="true" />
    </header>
  );
}
