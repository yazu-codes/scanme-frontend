import React from "react";

// Hairline — three diamonds — hairline. `bare` drops the lines.
export default function Ornament({ bare = false, className = "" }) {
  return (
    <span
      className={"nr-ornament" + (bare ? " nr-ornament-bare" : "") + (className ? ` ${className}` : "")}
      aria-hidden="true"
    >
      <i />
      <b />
      <b className="nr-ornament-mid" />
      <b />
      <i />
    </span>
  );
}

export function PageTitle({ eyebrow, title }) {
  return (
    <div className="nr-page-title">
      {eyebrow ? <p className="nr-eyebrow">{eyebrow}</p> : null}
      <h1 className="nr-display">{title}</h1>
      <Ornament />
    </div>
  );
}
