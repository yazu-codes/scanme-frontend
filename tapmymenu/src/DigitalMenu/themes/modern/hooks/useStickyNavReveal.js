import { useEffect, useState } from "react";

/**
 * Reveals the sticky category nav once the image category nav
 * has completely scrolled above the fixed header.
 *
 * Works with window scrolling and nested overflow-y scroll containers.
 *
 * @param {HTMLElement | null} heroElement
 * @param {number} headerHeight
 * @returns {boolean}
 */
export default function useStickyNavReveal(
  heroElement,
  headerHeight = 0
) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!heroElement) {
      setRevealed(false);
      return undefined;
    }

    const offset = Math.max(
      0,
      Math.round(Number(headerHeight) || 0)
    );

    let frameId = null;
    let lastRevealed = null;

    const checkPosition = () => {
      const rect = heroElement.getBoundingClientRect();
      const nextRevealed = rect.bottom <= offset;

      if (lastRevealed !== nextRevealed) {
        lastRevealed = nextRevealed;
        setRevealed(nextRevealed);
      }
    };

    const scheduleCheck = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        checkPosition();
      });
    };

    const handleResize = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        checkPosition();
      });
    };

    // Scroll does not bubble normally, so capture mode lets us catch
    // scrolls from nested overflow-y containers too.
    document.addEventListener("scroll", scheduleCheck, true);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", handleResize);

    checkPosition();

    return () => {
      document.removeEventListener("scroll", scheduleCheck, true);
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", handleResize);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [heroElement, headerHeight]);

  return revealed;
}