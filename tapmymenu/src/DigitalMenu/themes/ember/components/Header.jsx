import React from "react";
import { CategoryIcon } from "../../shared/menuKit";

// Quiet editorial masthead in Noir's spirit: a tracked small-caps line,
// the name in a large light serif, an italic slogan, a brass hairline.
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
