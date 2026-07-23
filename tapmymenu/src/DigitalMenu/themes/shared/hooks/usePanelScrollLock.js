import { useEffect } from "react";

// Locks vertical scroll on the body while a detail panel/modal is open,
// so the page behind it doesn't scroll along with it. Opt-in — a theme
// that doesn't use a slide-in/modal item view has no reason to call this.
export default function usePanelScrollLock(panelOpen) {
  useEffect(() => {
    const previousOverflowY = document.body.style.overflowY;
    if (panelOpen) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = previousOverflowY;
    };
  }, [panelOpen]);
}
