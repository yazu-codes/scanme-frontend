import React from "react";

// A row of cross-stitches (×××). Drawn with a CSS mask in menu thread
// colours, see .st-xrow in stitch-theme.css.
export function CrossRow({ className = "" }) {
  return <div className={`st-xrow ${className}`} aria-hidden="true" />;
}

const ALPHABETS = {
  bg: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

// The sampler alphabet stitched across the top, in the guest's language,
// each letter in the next thread colour.
export function Sampler({ locale }) {
  const letters = (ALPHABETS[locale] || ALPHABETS.en).split("");
  return (
    <p className="st-sampler" aria-hidden="true">
      {letters.map((l, i) => (
        <span key={l} className={`st-thread-${(i % 3) + 1}`}>
          {l}
        </span>
      ))}
    </p>
  );
}

// Text split into words, each word in the next thread colour, like the
// reference's two-colour title.
export function ThreadWords({ text }) {
  return String(text)
    .split(/(\s+)/)
    .map((part, i) =>
      /^\s+$/.test(part) ? (
        part
      ) : (
        <span key={i} className={`st-thread-${(Math.floor(i / 2) % 2) + 1}`}>
          {part}
        </span>
      )
    );
}
