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
      className={"dml-header" + (hasPlaceBackground ? " dml-header-has-bg" : "")}
    >
      {hasPlaceBackground ? (
        <>
          <img
            className="dml-header-bg-image"
            src={menu_owner_place_background_url}
            alt=""
            aria-hidden="true"
          />
          {/* A second, actually-blurred copy of the same photo, faded in
              toward the bottom — this is what feathers the photo into the
              nav's hairline separator. Sits below the scrim so it's real
              blurred image detail, not backdrop-filter blurring an
              already-dark scrim into a flat matte. */}
          <img
            className="dml-header-bg-blur"
            src={menu_owner_place_background_url}
            alt=""
            aria-hidden="true"
          />
          {/* Darkens the photo so the engraved name/slogan stay legible */}
          <div className="dml-header-bg-scrim" aria-hidden="true" />
        </>
      ) : null}

      <div className="dml-header-inner">
        <div className="dml-medallion">
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

        <h1 className="dml-owner-name">{menu_owner_name || "Menu"}</h1>

        {menu_owner_slogan ? (
          <>
            <div className="dml-owner-rule" aria-hidden="true" />
            <p className="dml-slogan">{menu_owner_slogan}</p>
          </>
        ) : null}
      </div>
    </header>
  );
}
