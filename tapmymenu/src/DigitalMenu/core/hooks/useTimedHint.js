import { useEffect, useState } from "react";

// Drives the little helper bubble next to a floating widget button
// ("Ask YummGPT!", "Share menu via QR!", "Choose Your Language!"):
// it pops in, stays readable for `visibleMs`, fades out, then unmounts
// so it stops taking up screen space. Lives in the widget's own state,
// so it shows once per page load and doesn't come back after the
// widget's panel is opened and closed.
//
// Returns "shown" | "leaving" | "gone".
export const HINT_POP_IN_DELAY_MS = 300; // matches the label's pop-in delay
export const HINT_FADE_MS = 350;

export default function useTimedHint(visibleMs = 2000) {
  const [phase, setPhase] = useState("shown");

  useEffect(() => {
    const leaveAt = HINT_POP_IN_DELAY_MS + visibleMs;
    const t1 = setTimeout(() => setPhase("leaving"), leaveAt);
    const t2 = setTimeout(() => setPhase("gone"), leaveAt + HINT_FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visibleMs]);

  return phase;
}
