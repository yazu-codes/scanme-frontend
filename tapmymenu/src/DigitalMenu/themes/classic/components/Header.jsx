import React from "react";

export default function Header({ owner }) {
  const {
    menu_owner_name,
    menu_owner_slogan,
    menu_owner_logo_url,
    menu_owner_place_background_url,
  } = owner;

  const hasPlaceBackground = Boolean(menu_owner_place_background_url);

  return (
    <header
      className={"dm-header" + (hasPlaceBackground ? " dm-header-has-bg" : "")}
    >
      {hasPlaceBackground ? (
        <>
          <div
            className="dm-header-bg-image"
            style={{ backgroundImage: `url(${menu_owner_place_background_url})` }}
            aria-hidden="true"
          />
          {/* Darkens the photo slightly so the name/slogan stay legible */}
          <div className="dm-header-bg-scrim" aria-hidden="true" />
          {/* Soft blur feathering the photo into the nav's hairline separator */}
          {/* <div className="dm-header-bg-blur" aria-hidden="true" /> */}
        </>
      ) : null}

      <div className="dm-header-inner">
        {menu_owner_logo_url ? (
          <img
            className="dm-logo"
            src={menu_owner_logo_url}
            alt={menu_owner_name ? `${menu_owner_name} logo` : "Logo"}
          />
        ) : (
          <div className="dm-logo dm-logo-placeholder" aria-hidden="true">
            {menu_owner_name ? menu_owner_name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <h1 className="dm-owner-name">{menu_owner_name || "Menu"}</h1>
        {menu_owner_slogan ? (
          <p className="dm-slogan">{menu_owner_slogan}</p>
        ) : null}
      </div>
    </header>
  );
}
