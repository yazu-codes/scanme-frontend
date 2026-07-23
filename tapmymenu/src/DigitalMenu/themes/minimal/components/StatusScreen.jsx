import React from "react";

export function LoadingScreen() {
  return (
    <div className="dmm-root dmm-state-message">
      <p>Loading menu…</p>
    </div>
  );
}

export function ErrorScreen() {
  return (
    <div className="dmm-root dmm-state-message">
      <p>We couldn't load this menu. Please try again shortly.</p>
    </div>
  );
}
