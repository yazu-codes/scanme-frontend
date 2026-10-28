import { useCallback, useEffect, useRef, useState } from "react";

// Noir is two "pages" inside one component: the menu cover (all
// category cards) and a single category. Every move between them is
// routed through the full-screen splash, the way the reference site does
// a page load: splash fades in -> view swaps underneath + scroll resets
// -> short hold -> splash fades out.
//
// The current page is mirrored to the URL hash (#c-3) and pushed onto
// history, so the phone's back button/gesture returns to the cover
// instead of leaving the menu, and a category link can be shared.

const FADE_IN_MS = 320;
const HOLD_MS = 480;
const BOOT_MIN_MS = 1700;

function readHash() {
  const m = /^#c-(\d+)$/.exec(window.location.hash || "");
  return m ? Number(m[1]) : null;
}

function writeHash(index, push) {
  const base = window.location.pathname + window.location.search;
  const url = index == null ? base : `${base}#c-${index}`;
  const fn = push ? "pushState" : "replaceState";
  window.history[fn]({ noirView: index }, "", url);
}

export default function useMenuNavigation({ ready, categoryCount, rootRef }) {
  const [view, setView] = useState(() => readHash()); // null = cover page
  const [splash, setSplash] = useState("shown"); // "shown" | "hidden"
  const [splashCycle, setSplashCycle] = useState(0); // restarts logo animation
  const timers = useRef([]);
  const busy = useRef(false);
  const bootStarted = useRef(Date.now());
  const pushedRef = useRef(0); // history entries we pushed this session

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const resetScroll = useCallback(() => {
    window.scrollTo(0, 0);
    if (rootRef.current) rootRef.current.scrollIntoView({ block: "start" });
  }, [rootRef]);

  // Boot: keep the splash up until data is ready AND the intro animation
  // has had time to play, then reveal.
  useEffect(() => {
    if (!ready) return undefined;
    const elapsed = Date.now() - bootStarted.current;
    const t = setTimeout(() => {
      setView((v) => (v != null && v >= categoryCount ? null : v));
      setSplash("hidden");
    }, Math.max(0, BOOT_MIN_MS - elapsed));
    return () => clearTimeout(t);
  }, [ready, categoryCount]);

  const navigate = useCallback(
    (index, { push = true } = {}) => {
      if (busy.current) clearTimers();
      busy.current = true;
      setSplashCycle((c) => c + 1);
      setSplash("shown");
      later(() => {
        setView(index);
        if (push) writeHash(index, true);
        resetScroll();
      }, FADE_IN_MS);
      later(() => {
        setSplash("hidden");
        busy.current = false;
      }, FADE_IN_MS + HOLD_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetScroll]
  );

  // Browser back/forward.
  useEffect(() => {
    function onPop() {
      const next = readHash();
      if (next == null) pushedRef.current = Math.max(0, pushedRef.current - 1);
      else pushedRef.current += 1;
      navigate(next != null && next < categoryCount ? next : null, { push: false });
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [navigate, categoryCount]);

  useEffect(() => clearTimers, []);

  const openCategory = useCallback(
    (index) => {
      if (index === view) return;
      // Category -> category replaces the entry so "back" always lands
      // on the cover, like the reference site's back-to-menu flow.
      if (view == null) {
        pushedRef.current += 1;
        navigate(index);
      } else {
        navigate(index, { push: false });
        later(() => writeHash(index, false), FADE_IN_MS);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, view]
  );

  const goHome = useCallback(() => {
    if (view == null) {
      resetScroll();
      return;
    }
    // Arrived here from the cover (we pushed this entry): step back
    // through history so the back button doesn't bounce into the
    // category again. Deep-linked straight in: replace the entry.
    if (pushedRef.current > 0) {
      window.history.back(); // popstate -> navigate(null), decrements the count
    } else {
      navigate(null, { push: false });
      later(() => writeHash(null, false), FADE_IN_MS);
    }
  }, [view, navigate, resetScroll]);

  return { view, splash, splashCycle, openCategory, goHome };
}
