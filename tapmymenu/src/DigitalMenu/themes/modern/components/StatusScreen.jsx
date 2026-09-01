import React from "react";

export function LoadingScreen({ cssVars }) {
  return (
    <div className="dml-root dml-theme-modern dml-state-message" style={cssVars}>
      <span className="dml-pulse-dot" aria-hidden="true" />
      <p className="dml-state-text">Setting the table…</p>
    </div>
  );
}

export function ErrorScreen({ cssVars }) {
  return (
    <div className="dml-root dml-theme-modern dml-state-message" style={cssVars}>
      <p className="dml-state-text">
        We couldn't load this menu. Please try again shortly.
      </p>
    </div>
  );
}
