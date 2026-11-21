import { useCallback, useEffect, useRef, useState } from "react";

// Which section is being read, for the pinned bar:
//   activeTop  index of the top-level category under the reading line
//   activeSub  path ("2-1") of that category's direct sub-category under
//              the line, or null (= "All", above its first sub-category)
//   pastHero   true once the guest has scrolled well into the menu (shows
//              the scroll-to-top button)
//
// The reading line sits just below the pinned bar. Reads happen at most
// once per animation frame, and state only changes when the answer does,
// so scrolling never re-renders the menu.
//
// lock(path) is called on a tap: it highlights the target at once and
// holds it while the smooth scroll passes the sections in between.
export default function useScrollSpy({ rootRef, nodes, enabled }) {
  const [spy, setSpy] = useState({ activeTop: 0, activeSub: null, pastHero: false });
  const lockUntil = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let frame = null;

    function read() {
      frame = null;
      const root = rootRef.current;
      if (!root) return;
      const pastHero = Math.max(0, -root.getBoundingClientRect().top) > 600;
      if (Date.now() < lockUntil.current) {
        setSpy((s) => (s.pastHero === pastHero ? s : { ...s, pastHero }));
        return;
      }
      const bar = root.querySelector(".mk-pin-bar");
      const line = (bar ? Math.max(bar.getBoundingClientRect().bottom, 0) : 0) + 24;

      let activeTop = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const el = root.querySelector(`[data-mk-path="${i}"]`);
        if (el && el.getBoundingClientRect().top <= line) activeTop = i;
      }
      let activeSub = null;
      const top = nodes[activeTop];
      if (top) {
        top.children.forEach((_, j) => {
          const path = `${activeTop}-${j}`;
          const el = root.querySelector(`[data-mk-path="${path}"]`);
          if (el && el.getBoundingClientRect().top <= line) activeSub = path;
        });
      }
      setSpy((s) =>
        s.activeTop === activeTop && s.activeSub === activeSub && s.pastHero === pastHero
          ? s
          : { activeTop, activeSub, pastHero }
      );
    }

    function schedule() {
      if (frame == null) frame = requestAnimationFrame(read);
    }

    document.addEventListener("scroll", schedule, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [rootRef, nodes, enabled]);

  const lock = useCallback((path) => {
    if (path == null) {
      lockUntil.current = Date.now() + 900;
      setSpy((s) => ({ ...s, activeTop: 0, activeSub: null }));
      return;
    }
    const parts = path.split("-");
    const activeTop = Number(parts[0]);
    const activeSub = parts.length > 1 ? `${parts[0]}-${parts[1]}` : null;
    lockUntil.current = Date.now() + 900;
    setSpy((s) => ({ ...s, activeTop, activeSub }));
  }, []);

  return { ...spy, lock };
}
