import React from "react";

// Full-screen loader used for the first load and for every page change.
// The logo "draws" itself in (a clip sweep + un-blur, since owner logos
// are raster images rather than line art), then the name settles in with
// wide tracking. `cycle` remounts the inner content so the animation
// replays on each navigation.
export default function Splash({ owner, state, cycle }) {
  const name = owner.menu_owner_name || "";
  const logo = owner.menu_owner_logo_url;

  return (
    <div
      className={"nr-splash" + (state === "hidden" ? " nr-splash-hidden" : "")}
      aria-hidden={state === "hidden"}
      role="status"
      aria-label="Loading"
    >
      <div className="nr-splash-inner" key={cycle}>
        {logo ? (
          <img className="nr-splash-logo" src={logo} alt="" />
        ) : (
          <span className="nr-splash-mark" aria-hidden="true" />
        )}
        {name ? <p className="nr-splash-name">{name}</p> : null}
      </div>
    </div>
  );
}
