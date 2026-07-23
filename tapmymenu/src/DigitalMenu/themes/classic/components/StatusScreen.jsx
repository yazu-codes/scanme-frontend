import React from "react";

export function LoadingScreen({ cssVars }) {
  return (
    <div className="dm-root dm-state-message" style={cssVars}>
      <div className="dm-spinner" aria-hidden="true" />
      <p>Loading menu…</p>
    </div>
  );
}

export function ErrorScreen({ cssVars }) {
  return (
    <div className="dm-root dm-state-message" style={cssVars}>
      <p>We couldn't load this menu. Please try again shortly.</p>
    </div>
  );
}
