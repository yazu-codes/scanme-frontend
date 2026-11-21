import { useEffect } from "react";

// Makes the phone's back gesture close an open layer (dish detail,
// navigation drawer) instead of leaving the page.
//
// Opening the layer pushes a history entry with the SAME url (so the hash
// navigation ignores it). Back pops it and closes the layer. Closing the
// layer any other way (✕, backdrop, Escape) steps back over that entry so
// history doesn't fill up with dead entries.
//
// skipRef: set skipRef.current = true right before closing when the
// caller REPLACES the layer's entry itself (e.g. the drawer navigating to
// a category with history.replaceState). Then no step back is taken.
//
// Layers may stack: each entry records the open layers (mkLayers), and a
// layer only closes when its own entry has been popped.
//
// `close` must be stable (useCallback) or the entry is re-pushed.
let counter = 0;

export default function useBackToClose(open, close, skipRef) {
  useEffect(() => {
    if (!open) return undefined;
    counter += 1;
    const token = `mk-layer-${counter}`;
    const base = window.history.state || {};
    window.history.pushState(
      { ...base, lnLayer: token, mkLayers: [...(base.mkLayers || []), token] },
      "",
      window.location.href
    );
    let popped = false;
    // Layers can stack (dish sheet over a feed). A popstate closes this
    // layer only when ITS entry is gone, not when a layer above it closes.
    function onPop() {
      const layers = (window.history.state && window.history.state.mkLayers) || [];
      if (layers.includes(token)) return;
      popped = true;
      close();
    }
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      const skip = Boolean(skipRef && skipRef.current);
      if (skipRef) skipRef.current = false;
      const state = window.history.state;
      if (!popped && !skip && state && state.lnLayer === token) window.history.back();
    };
  }, [open, close, skipRef]);
}
