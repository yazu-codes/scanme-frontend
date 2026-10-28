import { useEffect, useRef, useState } from "react";

// Fade-and-rise as an element scrolls into view, once. Falls back to
// "already visible" where IntersectionObserver isn't available.
export default function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(
    typeof window !== "undefined" && !("IntersectionObserver" in window)
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return [ref, shown];
}
