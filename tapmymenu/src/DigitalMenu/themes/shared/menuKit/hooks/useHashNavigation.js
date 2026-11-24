import { useCallback, useEffect, useRef } from "react";

// menuKit themes are one long page, so "navigation" means "scroll to a section".
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
// scroll-margin-top: var(--mk-pin-h), which works whether the window or
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

// enabled=false: the hook only provides goTo/scrollToPath and doesn't
// react to back/forward or a shared link (for themes with their own
// screen navigation).
export default function useHashNavigation({ ready, pathMap, rootRef, onLand, enabled = true }) {
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
      const el = root.querySelector(`[data-mk-path="${CSS.escape(path)}"]`);
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
    if (!enabled) return undefined;
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
  }, [pathMap, scrollToPath, enabled]);

  // Shared link: land on the section once the menu (and its fonts) have
  // laid out, so the position doesn't drift. Waits for the category tree:
  // status turns "ready" one render before the tree exists. Runs once;
  // later tree updates (originals arriving) must not yank the guest back.
  const booted = useRef(false);
  const unmounted = useRef(false);
  useEffect(() => () => {
    unmounted.current = true;
  }, []);
  useEffect(() => {
    if (!ready || !enabled || booted.current || pathMap.size === 0) return;
    booted.current = true;
    const path = readHashPath();
    if (path == null || !pathMap.has(path)) return;
    // Content above the target can still grow after landing (fonts, and
    // in translated menus the original names arriving a moment later), so
    // keep re-landing on every layout change until the guest takes over
    // (touch, wheel, key) or 4 s pass.
    let settled = false;
    let ro = null;
    const stop = () => {
      settled = true;
      if (ro) ro.disconnect();
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => window.removeEventListener(t, stop, true));
    };
    const land = () => {
      if (unmounted.current || settled) return;
      if (onLandRef.current) onLandRef.current(path);
      scrollToPath(path, false);
    };
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => window.addEventListener(t, stop, true));
    setTimeout(stop, 4000);
    if (typeof ResizeObserver !== "undefined" && rootRef.current) {
      ro = new ResizeObserver(() => requestAnimationFrame(land));
      ro.observe(rootRef.current);
    }
    requestAnimationFrame(() => requestAnimationFrame(land));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(land);
  }, [ready, enabled, pathMap, scrollToPath, rootRef]);

  return { goTo, scrollToPath };
}
