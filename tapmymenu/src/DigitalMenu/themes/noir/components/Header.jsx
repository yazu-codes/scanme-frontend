import React from "react";
import LangSwitch from "./LangSwitch";

export function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// Fixed top bar: logo stacked over the tracked-out name on the left,
// BG / EN and the hamburger on the right. Slides away on scroll down and
// back on scroll up (cover page); on a category page the sticky icon
// strip takes over the top edge once you scroll, so it simply hides.
export default function Header({ owner, hidden, solid, locale, track, onBrand, onMenu, strings }) {
  const name = owner.menu_owner_name || "";
  const logo = owner.menu_owner_logo_url;

  return (
    <header
      className={
        "nr-header" + (hidden ? " nr-header-hidden" : "") + (solid ? " nr-header-solid" : "")
      }
    >
      <div className="nr-header-inner">
        <button type="button" className="nr-brand" onClick={onBrand} aria-label={name || "Home"}>
          {logo ? <img className="nr-brand-logo" src={logo} alt="" /> : null}
          {name ? <span className="nr-brand-name">{name}</span> : null}
        </button>

        <div className="nr-header-actions">
          <LangSwitch locale={locale} track={track} />
          <button type="button" className="nr-burger" onClick={onMenu} aria-label={strings.openMenu}>
            <BurgerIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
