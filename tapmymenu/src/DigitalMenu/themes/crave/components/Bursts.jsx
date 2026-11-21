import React from "react";
import { HeartIcon } from "./Heart";

// Heart + confetti bursts at the point of a crave (double-tap or ♥).
// Fixed layer above everything; each burst removes itself (Theme.jsx
// clears it after ~900 ms). Colours: the derived pop colours.
export default function Bursts({ bursts }) {
  return (
    <div className="cv-bursts" aria-hidden="true">
      {bursts.map((b) => (
        <span key={b.id} className="cv-burst" style={{ left: b.x, top: b.y }}>
          <span className="cv-burst-heart">
            <HeartIcon filled size={b.big ? 96 : 40} />
          </span>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="cv-confetti" style={{ "--cv-a": `${i * 36}deg`, "--cv-c": (i % 4) + 1 }} />
          ))}
        </span>
      ))}
    </div>
  );
}
