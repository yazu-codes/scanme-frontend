import { useEffect, useState } from "react";

// Measures the header's true rendered height (safe-area inset included)
// and writes it to --dml-header-h-live for other elements to read (the
// hero's top padding, the section scroll-margin, the nav-reveal
// threshold). Deliberately does NOT feed this back into the header's
// own layout — .dml-header-inner sizes itself from the separate static
// --dml-header-h var defined in the stylesheet instead. Measuring an
// element and then using that measurement to resize the same element
// is a feedback loop by construction (measure -> resize -> re-measure
// -> ...), which is almost certainly why the reveal hook's effect was
// never actually settling.
//
// Measured on mount and on window resize only — no ResizeObserver, so
// there's no way for a CSS change this hook makes to be the thing that
// triggers the next measurement.
export default function useHeaderHeightSync(rootRef, headerRef) {
  const [height, setHeight] = useState(64);

  useEffect(() => {
    const headerEl = headerRef.current;
    const rootEl = rootRef.current;
    if (!headerEl || !rootEl) return undefined;

    function apply() {
      const h = headerEl.getBoundingClientRect().height;
      setHeight(h);
      rootEl.style.setProperty("--dml-header-h-live", `${h}px`);
    }

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [rootRef, headerRef]);

  return height;
}