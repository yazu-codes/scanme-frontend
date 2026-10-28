import { useEffect, useState } from "react";

// How far the theme root has scrolled and in which direction. Measured
// from the root's own bounding box, so it works whether the window
// scrolls or the host app wraps the menu in its own scroll container
// (scroll events are caught in capture mode for the nested case).
export default function useScrollState(rootRef) {
  const [state, setState] = useState({ y: 0, dir: "up" });

  useEffect(() => {
    let frame = null;
    let lastY = 0;
    let lastDir = "up";

    function read() {
      frame = null;
      const el = rootRef.current;
      if (!el) return;
      const y = Math.max(0, -el.getBoundingClientRect().top);
      const delta = y - lastY;
      let dir = lastDir;
      if (Math.abs(delta) > 6) dir = delta > 0 ? "down" : "up";
      if (y < 10) dir = "up";
      if (dir !== lastDir || Math.abs(y - lastY) > 1) {
        lastDir = dir;
        lastY = y;
        setState((s) => (s.dir === dir && Math.round(s.y) === Math.round(y) ? s : { y, dir }));
      }
    }

    function schedule() {
      if (frame == null) frame = requestAnimationFrame(read);
    }

    document.addEventListener("scroll", schedule, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    read();
    return () => {
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [rootRef]);

  return state;
}
