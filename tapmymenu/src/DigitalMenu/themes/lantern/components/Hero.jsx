import React from "react";
import { LanternOrnament } from "./Ornaments";

// Poster header from the reference: emblem centred above a huge heavy
// name, two small-caps flank labels beside the emblem, then the slogan.
// The owner logo takes the emblem's place when there is one.
export default function Hero({ owner, strings, itemCount, categoryCount }) {
  const name = owner.menu_owner_name || "";
  const logo = owner.menu_owner_logo_url;
  const slogan = owner.menu_owner_slogan;

  return (
    <header className="ln-hero ln-tone-a">
      <div className="ln-hero-top">
        <p className="ln-flank">{strings.categoriesCount(categoryCount)}</p>
        <div className="ln-emblem">
          {logo ? <img className="ln-emblem-logo" src={logo} alt="" /> : <LanternOrnament className="ln-emblem-orn" />}
        </div>
        <p className="ln-flank">{strings.items(itemCount)}</p>
      </div>
      {name ? <h1 className="ln-hero-name">{name}</h1> : null}
      <p className="ln-hero-tag">{strings.menu}</p>
      {slogan ? <p className="ln-hero-slogan">{slogan}</p> : null}
    </header>
  );
}
