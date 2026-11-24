import React from "react";
import { BurgerIcon, CategoryIcon } from "../../shared/menuKit";
import { levelCode } from "../utils";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

// The game HUD, always on top: ◀ one level up (or the emblem at home),
// the current level's code and name (at home just "Menu": the title
// screen below shows the name), ☰ for the map (the whole tree).
// Constant height, so nothing ever hides under it.
export default function Hud({ path, title, parentTitle, owner, strings, onUp, onMap }) {
  const home = path == null;
  return (
    <header className="em-hud">
      <div className="em-hud-inner">
        {home ? (
          <span className="em-hud-emblem" aria-hidden="true">
            {owner.menu_owner_logo_url ? <img src={owner.menu_owner_logo_url} alt="" /> : <CategoryIcon iconKey="hookah" size={24} />}
          </span>
        ) : (
          <button type="button" className="em-hud-btn" onClick={onUp} aria-label={strings.back}>
            <BackIcon />
          </button>
        )}
        <div className="em-hud-title" aria-live="polite">
          <span className="em-hud-code">{home ? strings.menu : levelCode(path)}</span>
          {home ? null : <span className="em-hud-name">{title}</span>}
          {!home && parentTitle ? <span className="em-hud-parent">{parentTitle}</span> : null}
        </div>
        <button type="button" className="em-hud-btn" onClick={onMap} aria-label={strings.openMenu}>
          <BurgerIcon />
        </button>
      </div>
    </header>
  );
}
