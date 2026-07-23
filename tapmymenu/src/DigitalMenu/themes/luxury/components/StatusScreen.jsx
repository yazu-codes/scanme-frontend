import React from "react";

export function LoadingScreen({ cssVars }) {
  return (
    <div className="dml-root dml-state-message" style={cssVars}>
      <div className="dml-seal" aria-hidden="true" />
      <p className="dml-state-eyebrow">Preparing your table…</p>
    </div>
  );
}

export function ErrorScreen({ cssVars }) {
  return (
    <div className="dml-root dml-state-message" style={cssVars}>
      <p className="dml-state-eyebrow">
        We couldn't load this menu. Please try again shortly.
      </p>
    </div>
  );
}
