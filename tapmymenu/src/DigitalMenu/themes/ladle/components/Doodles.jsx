import React from "react";

// Hand-drawn chalk doodles (original): stars, a heart, a squiggle and
// the ladle. Stroke = currentColor, so they take the owner's ink.
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export function Star({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line}>
      <path d="M12 3l2.4 5.6 6 .6-4.6 4 1.4 6-5.2-3.2-5.2 3.2 1.4-6-4.6-4 6-.6z" />
    </svg>
  );
}

export function Heart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

export function Squiggle({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 10" preserveAspectRatio="none" {...line}>
      <path d="M2 6c8-6 12 4 20 0s12-6 20 0 12 4 20 0 12-6 20 0 12 4 20 0 10-4 16-1" />
    </svg>
  );
}

export function LadleDoodle({ className }) {
  return (
    <svg className={className} viewBox="0 0 160 70" {...line}>
      <path d="M150 8L62 40" />
      <path d="M154 6c3 2 2 6-2 7" />
      <path d="M14 38c0 12 10 22 24 22s24-10 24-22z" />
      <path d="M20 44c6 6 22 8 34 0" strokeWidth="1.4" />
    </svg>
  );
}
