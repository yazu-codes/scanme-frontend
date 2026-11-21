import React from "react";
import { firstImage } from "../../shared/menuKit";
import Brush from "./Brush";

// Flyer header: the restaurant name in small caps, a huge slanted MENU,
// then the two first categories that have photos, each shown by one of
// its dishes (whole photo, floating on a glow) over a brush-stroke label
// that jumps to that category.
export default function Hero({ owner, strings, nodes, itemsByLabel, onSelect }) {
  const featured = [];
  nodes.forEach((node, i) => {
    if (featured.length >= 2) return;
    const img = firstImage(node, itemsByLabel);
    if (img) featured.push({ label: node.label, img, index: i });
  });

  return (
    <header className="fl-hero">
      {owner.menu_owner_logo_url ? <img className="fl-logo" src={owner.menu_owner_logo_url} alt="" /> : null}
      {owner.menu_owner_name ? <p className="fl-name">{owner.menu_owner_name}</p> : null}
      <h1 className="fl-menu-word">{strings.menu}</h1>
      {owner.menu_owner_slogan ? <p className="fl-slogan">{owner.menu_owner_slogan}</p> : null}
      {featured.length ? (
        <div className={"fl-featured" + (featured.length === 1 ? " fl-featured-one" : "")}>
          {featured.map((f) => (
            <button key={f.label} type="button" className="fl-feature" onClick={() => onSelect(f.index)}>
              <span className="fl-feature-photo">
                <img src={f.img} alt="" />
              </span>
              <Brush className="fl-feature-label">{f.label}</Brush>
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}
