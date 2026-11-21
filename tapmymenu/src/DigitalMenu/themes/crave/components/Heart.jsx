import React from "react";

export function HeartIcon({ filled, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.7c0 5.8-7.5 10.4-7.5 10.4z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The ♥ toggle used on cards, rows and the feed. Pops when it changes.
export default function HeartButton({ on, onToggle, label, className = "" }) {
  return (
    <button
      type="button"
      className={`cv-heart ${on ? "cv-heart-on" : ""} ${className}`}
      aria-pressed={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(e);
      }}
    >
      <HeartIcon filled={on} />
    </button>
  );
}
