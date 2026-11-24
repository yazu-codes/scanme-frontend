import React from "react";

// The lounge light: an ember glow low in the room that slowly breathes,
// a fainter glow up top, and three soft smoke wisps drifting upward.
// Fixed behind the menu; transform/opacity animation only; still for
// guests who prefer reduced motion.
export default function Ambience() {
  return (
    <div className="em-ambience" aria-hidden="true">
      <span className="em-glow em-glow-low" />
      <span className="em-glow em-glow-high" />
      <span className="em-smoke em-smoke-1" />
      <span className="em-smoke em-smoke-2" />
      <span className="em-smoke em-smoke-3" />
      <span className="em-grain" />
    </div>
  );
}
