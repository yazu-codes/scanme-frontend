import { useEffect } from "react";

// Kinetic type: publishes the scroll speed as --cv-v (-1..1) on the theme
// root, so headings can lean into the scroll with pure CSS. Written to a
// CSS variable, never to React state, so scrolling re-renders nothing.
// Off for guests who prefer reduced motion.
export default function useScrollVelocity(rootRef, enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    let lastY = window.scrollY;
    let v = 0;
    let frame = null;

    function tick() {
      const y = window.scrollY;
      const target = Math.max(-1, Math.min(1, (y - lastY) / 40));
      lastY = y;
      v += (target - v) * 0.25;
      if (Math.abs(v) < 0.005 && Math.abs(target) < 0.005) v = 0;
      if (rootRef.current) rootRef.current.style.setProperty("--cv-v", v.toFixed(3));
      frame = v === 0 ? null : requestAnimationFrame(tick);
    }
    function onScroll() {
      if (frame == null) frame = requestAnimationFrame(tick);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [rootRef, enabled]);
}
