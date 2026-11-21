import React from "react";
import { Heart, Squiggle, Star } from "./Doodles";

// Chalkboard header from the reference: a small caps line, the name in a
// big rounded hand-lettered face with chalk doodles around it, then the
// slogan as a little subtitle under a squiggle.
export default function Header({ owner, strings, itemCount }) {
  const name = owner.menu_owner_name || strings.menu;
  return (
    <header className="tl-header">
      <p className="tl-topline">
        {strings.menu} · {strings.items(itemCount)}
      </p>
      <div className="tl-title-wrap">
        <Star className="tl-doodle tl-doodle-star" />
        <Heart className="tl-doodle tl-doodle-heart" />
        {owner.menu_owner_logo_url ? (
          <img className="tl-logo" src={owner.menu_owner_logo_url} alt="" />
        ) : null}
        <h1 className="tl-title">{name}</h1>
      </div>
      <Squiggle className="tl-squiggle tl-squiggle-head" />
      {owner.menu_owner_slogan ? <p className="tl-subtitle">{owner.menu_owner_slogan}</p> : null}
    </header>
  );
}
