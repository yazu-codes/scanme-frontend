import { useCallback, useEffect, useRef } from "react";

// Lantern is one long page, so "navigation" means "scroll to a section".
// Every tap on a category (tab, chip, drawer) is mirrored to the URL hash
// and pushed onto history:
//
//   #c-2      third top-level category
//   #c-2-0-1  a sub-sub-category inside it (path from utils/nodePathMap)
//
// So the phone's back gesture returns to the previous section, and a
// category link can be shared: opening it lands on that section.
//
// Sections land just below the pinned category bar through CSS
// scroll-margin-top: var(--ln-pin-h), which works whether the window or
// a host container scrolls.

const HASH_RE = /^#c-(\d+(?:-\d+)*)$/;

export function readHashPath() {
  const m = HASH_RE.exec(window.location.hash || "");
  return m ? m[1] : null;
}

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function useHashNavigation({ ready, pathMap, rootRef, onLand }) {
  const lastHash = useRef(typeof window !== "undefined" ? window.location.hash : "");
  const onLandRef = useRef(onLand);
  useEffect(() => {
    onLandRef.current = onLand;
  }, [onLand]);

  const scrollToPath = useCallback(
    (path, smooth) => {
      const root = rootRef.current;
      if (!root) return;
      const behavior = smooth && !prefersReducedMotion() ? "smooth" : "auto";
      if (path == null) {
        window.scrollTo({ top: 0, behavior });
        root.scrollIntoView({ block: "start", behavior });
        return;
      }
      const el = root.querySelector(`[data-ln-path="${CSS.escape(path)}"]`);
      if (!el) return;
      // Long jumps: skip most of the distance instantly and glide only the
      // last screen, so a tap never animates for more than a moment.
      const dist = el.getBoundingClientRect().top;
      const screen = window.innerHeight;
      if (behavior === "smooth" && Math.abs(dist) > screen * 2) {
        window.scrollBy(0, dist - Math.sign(dist) * screen * 0.8);
      }
      el.scrollIntoView({ block: "start", behavior });
    },
    [rootRef]
  );

  // Tap on a category: record it in history, then glide there.
  const goTo = useCallback(
    (path, { replace = false } = {}) => {
      const base = window.location.pathname + window.location.search;
      const url = path == null ? base : `${base}#c-${path}`;
      const state = { lnPath: path };
      if (replace) window.history.replaceState(state, "", url);
      else window.history.pushState(state, "", url);
      lastHash.current = window.location.hash;
      if (onLandRef.current) onLandRef.current(path);
      scrollToPath(path, true);
    },
    [scrollToPath]
  );

  // Back / forward. Entries pushed by an open modal or drawer keep the
  // same hash, so they are ignored here (useBackToClose handles them).
  useEffect(() => {
    function onPop() {
      const hash = window.location.hash;
      if (hash === lastHash.current) return;
      lastHash.current = hash;
      const path = readHashPath();
      const valid = path != null && pathMap.has(path) ? path : null;
      if (onLandRef.current) onLandRef.current(valid);
      scrollToPath(valid, true);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [pathMap, scrollToPath]);

  // Shared link: land on the section once the menu (and its fonts) have
  // laid out, so the position doesn't drift.
  useEffect(() => {
    if (!ready) return undefined;
    const path = readHashPath();
    if (path == null || !pathMap.has(path)) return undefined;
    let cancelled = false;
    const land = () => {
      if (cancelled) return;
      if (onLandRef.current) onLandRef.current(path);
      scrollToPath(path, false);
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(land));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(land);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // Only on the first ready render: later tree changes must not yank
    // the guest back to the hash section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return { goTo, scrollToPath };
}
