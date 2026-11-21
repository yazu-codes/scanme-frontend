import React from "react";

// An endless ticker of the category names between the hero and the menu.
// Two identical halves slide left forever; purely decorative.
export default function Marquee({ words }) {
  if (!words.length) return null;
  const half = (
    <span className="cv-marquee-half">
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span className="cv-marquee-word">{w}</span>
          <span className="cv-marquee-star">✦</span>
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="cv-marquee" aria-hidden="true">
      <div className="cv-marquee-track">
        {half}
        {half}
      </div>
    </div>
  );
}
