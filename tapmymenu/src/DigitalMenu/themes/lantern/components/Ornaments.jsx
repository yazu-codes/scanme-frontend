import React from "react";

// Original line ornaments, drawn in the owner's colours: the stroke is
// the current tone's ink, the fill its band colour (set in CSS through
// .ln-orn). They stand in for the reference design's mascot and dumpling
// illustrations and are restaurant-neutral.

export function LanternOrnament({ className = "" }) {
  return (
    <svg className={`ln-orn ${className}`} viewBox="0 0 64 84" aria-hidden="true" focusable="false">
      <path className="ln-orn-line" d="M32 2v9" />
      <rect x="21" y="11" width="22" height="7" rx="2.5" />
      <path d="M12 34c0-10 9-16 20-16s20 6 20 16v14c0 10-9 16-20 16s-20-6-20-16z" />
      <path className="ln-orn-line" d="M32 18v46M22.5 20c-5 9-5 33 0 42M41.5 20c5 9 5 33 0 42M12 41h40" />
      <rect x="21" y="64" width="22" height="7" rx="2.5" />
      <path className="ln-orn-line" d="M32 71v5M27 76h10M28.5 76l-1.5 6M32 76v7M35.5 76l1.5 6" />
    </svg>
  );
}

export function CloudOrnament({ className = "" }) {
  return (
    <svg className={`ln-orn ${className}`} viewBox="0 0 104 52" aria-hidden="true" focusable="false">
      <path d="M10 44h78c8 0 13-6 11-13-2-6-9-8-14-5 1-9-7-16-16-14-4-9-17-11-24-3-7-5-17 0-17 9-9-1-16 6-13 14 1 6 6 10 13 12z" />
      <path className="ln-orn-line" d="M36 36c-6 0-8-8-2-9 4 0 4 5 1 5M60 30c0-6 8-7 9-2 0 4-5 4-5 1M78 38c4-1 6 3 3 5" />
    </svg>
  );
}

export function BowlOrnament({ className = "" }) {
  return (
    <svg className={`ln-orn ${className}`} viewBox="0 0 68 60" aria-hidden="true" focusable="false">
      <path className="ln-orn-line" d="M46 3L28 26M55 6L35 27" />
      <path d="M6 28h56c0 15-12 24-28 24S6 43 6 28z" />
      <path d="M24 52h20v4H24z" />
      <path className="ln-orn-line" d="M14 36c6 5 34 5 40 0M17 20c-3-3 3-5 0-9M27 20c-3-3 3-5 0-9" />
    </svg>
  );
}

const BAND_ORNAMENTS = [CloudOrnament, BowlOrnament];

// Ornament that sits on a band's top edge, alternating side and motif.
export function BandOrnament({ index }) {
  const Ornament = BAND_ORNAMENTS[index % BAND_ORNAMENTS.length];
  return (
    <span className={`ln-band-orn ${index % 2 === 0 ? "ln-band-orn-right" : "ln-band-orn-left"}`}>
      <Ornament />
    </span>
  );
}
