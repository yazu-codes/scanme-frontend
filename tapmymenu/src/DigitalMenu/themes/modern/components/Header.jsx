import React, { forwardRef } from "react";

// Modern's header is a slim identity bar — logo and name only, fixed to
// the true top of the viewport. It's the only thing pinned there while
// the picture hero is in view; once the visitor scrolls past the hero,
// Theme swaps it out for CategoryNav in that exact same top slot (see
// the `hidden` prop) rather than stacking both bars at once.
const Header = forwardRef(function Header({ owner, hidden }, ref) {
  const { menu_owner_name, menu_owner_slogan, menu_owner_logo_url } = owner;

  return (
    <header
      ref={ref}
      className={"dml-header" + (hidden ? " dml-header-hidden" : "")}
      aria-hidden={hidden}
    >
      <div className="dml-header-inner">
        <div className="dml-logo-frame">
          {menu_owner_logo_url ? (
            <img
              className="dml-logo"
              src={menu_owner_logo_url}
              alt={menu_owner_name ? `${menu_owner_name} logo` : "Logo"}
            />
          ) : (
            <div className="dml-logo dml-logo-placeholder" aria-hidden="true">
              {menu_owner_name ? menu_owner_name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>

        <div className="dml-header-text">
          <h1 className="dml-owner-name">{menu_owner_name || "Menu"}</h1>
          {menu_owner_slogan ? (
            <p className="dml-slogan">{menu_owner_slogan}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
});

export default Header;
