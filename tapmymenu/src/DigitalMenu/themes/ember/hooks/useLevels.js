import { useCallback, useEffect, useRef, useState } from "react";

// Ember shows ONE level of the menu at a time, like a game's level
// select: home (all top-level categories) -> a category -> its
// sub-category -> … down to the dishes. Same idea as Noir's cover /
// category pages, but at every depth.
//
//   path null      home
//   path "2"       third top-level category
//   path "2-0-1"   a sub-sub-category inside it (menuKit nodePathMap)
//
// Each step is mirrored to the URL hash (#c-<path>) and pushed onto
// history, so the phone's back gesture goes up one level and a category
// link can be shared. Entries pushed by the dish sheet or the drawer keep
// the same hash and are ignored here (menuKit useBackToClose owns them).
//
// "Explored" levels are remembered for the visit (sessionStorage), so the
// level select can mark where the guest has already been.

const HASH_RE = /^#c-(\d+(?:-\d+)*)$/;

function readHash(pathMap) {
  const m = HASH_RE.exec(window.location.hash || "");
  return m && pathMap.has(m[1]) ? m[1] : null;
}

function depth(path) {
  return path == null ? 0 : path.split("-").length;
}

export function parentPath(path) {
  if (path == null) return null;
  const parts = path.split("-");
  return parts.length > 1 ? parts.slice(0, -1).join("-") : null;
}

function urlFor(p) {
  const base = window.location.pathname + window.location.search;
  return p == null ? base : `${base}#c-${p}`;
}

function loadExplored(key) {
  try {
    const raw = window.sessionStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list : []);
  } catch (e) {
    return new Set();
  }
}

export default function useLevels({ ready, pathMap, urlname, onEnter }) {
  const [view, setView] = useState({ path: null, dir: "in" });
  const pathRef = useRef(null);
  const storageKey = `dm-ember-explored:${urlname}`;
  const [explored, setExplored] = useState(() => loadExplored(storageKey));
  const lastHash = useRef(typeof window !== "undefined" ? window.location.hash : "");
  const pushed = useRef(0);
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  const markExplored = useCallback(
    (p) => {
      if (p == null) return;
      setExplored((prev) => {
        if (prev.has(p)) return prev;
        const next = new Set(prev);
        next.add(p);
        return next;
      });
    },
    []
  );

  // Persist explored levels for the visit.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify([...explored]));
    } catch (e) {
      // storage unavailable: keep it in memory
    }
  }, [storageKey, explored]);

  // Switch the visible level (no history work here).
  const show = useCallback(
    (next) => {
      const from = pathRef.current;
      pathRef.current = next;
      setView({ path: next, dir: depth(next) >= depth(from) ? "in" : "out" });
      markExplored(next);
      window.scrollTo(0, 0);
    },
    [markExplored]
  );

  // Enter a level (tile tap, drawer pick). replace: overwrite the current
  // history entry instead of adding one (used for the drawer's own entry).
  const go = useCallback(
    (next, { replace = false } = {}) => {
      const state = { emberPath: next };
      if (replace) window.history.replaceState(state, "", urlFor(next));
      else {
        window.history.pushState(state, "", urlFor(next));
        pushed.current += 1;
      }
      lastHash.current = window.location.hash;
      if (next != null && onEnterRef.current) onEnterRef.current(next);
      show(next);
    },
    [show]
  );

  // ◀ in the HUD: one level up. Uses history when we put the entry there
  // (so the button and the back gesture agree), else replaces it.
  const up = useCallback(() => {
    const target = parentPath(pathRef.current);
    if (pushed.current > 0) {
      window.history.back();
      return;
    }
    window.history.replaceState({ emberPath: target }, "", urlFor(target));
    lastHash.current = window.location.hash;
    show(target);
  }, [show]);

  // Back / forward gesture.
  useEffect(() => {
    function onPop() {
      const hash = window.location.hash;
      if (hash === lastHash.current) return; // a layer (sheet/drawer) entry
      lastHash.current = hash;
      pushed.current = Math.max(0, pushed.current - 1);
      show(readHash(pathMap));
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [pathMap, show]);

  // Shared link: open that level once the menu is ready.
  const booted = useRef(false);
  useEffect(() => {
    // status turns "ready" one render before the tree exists: wait for it.
    if (!ready || booted.current || pathMap.size === 0) return;
    booted.current = true;
    const start = readHash(pathMap);
    if (start != null) show(start);
  }, [ready, pathMap, show]);

  return { path: view.path, dir: view.dir, explored, go, up };
}
