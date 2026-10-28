import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CategoryIcon from "./CategoryIcon";
import { BurgerIcon } from "./Header";

// Horizontally scrolling row of line-icon tiles. The active category
// sits on a filled champagne tile and is kept centred; a slim thumb
// underneath tracks the strip's horizontal scroll position. Once pinned
// (the header has slid away) it carries the hamburger button, so the
// full category tree stays one tap away. It's sticky,
// and once the header has slid away it carries the BG / EN switch too.
//
// Pinning uses position: fixed + a placeholder of the same height rather
// than position: sticky: the shared useBodyBackgroundSync hook puts
// overflow-x: hidden on <html> and <body>, which turns <body> into a
// scroll container and silently breaks sticky positioning.
export default function CategoryStrip({ nodes, iconKeyOf = {}, activeIndex, onSelect, onStuckChange, onMenu, menuLabel }) {
  const holderRef = useRef(null);
  const navRef = useRef(null);
  const scrollerRef = useRef(null);
  const tileRefs = useRef([]);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });
  const [stuck, setStuck] = useState(false);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    let frame = null;
    let last = null;
    function check() {
      frame = null;
      const holder = holderRef.current;
      if (!holder) return;
      const next = holder.getBoundingClientRect().top <= 0;
      if (next !== last) {
        last = next;
        setStuck(next);
        if (onStuckChange) onStuckChange(next);
      }
    }
    function schedule() {
      if (frame == null) frame = requestAnimationFrame(check);
    }
    function measureHeight() {
      if (navRef.current) {
        const h = navRef.current.offsetHeight;
        setHeight(h);
        // Lets section anchors land just below the pinned strip.
        const page = holderRef.current && holderRef.current.parentElement;
        if (page) page.style.setProperty("--nr-strip-h", `${h}px`);
      }
      schedule();
    }
    measureHeight();
    document.addEventListener("scroll", schedule, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measureHeight);
    return () => {
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measureHeight);
      if (frame != null) cancelAnimationFrame(frame);
      if (onStuckChange) onStuckChange(false);
    };
  }, [onStuckChange]);

  function measure() {
    const el = scrollerRef.current;
    if (!el) return;
    const ratio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    const width = Math.min(100, ratio * 100);
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? el.scrollLeft / max : 0;
    setThumb({ width, left: (100 - width) * progress });
  }

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    const tile = tileRefs.current[activeIndex];
    if (el && tile) {
      el.scrollLeft = tile.offsetLeft - (el.clientWidth - tile.offsetWidth) / 2;
    }
    measure();
  }, [activeIndex, nodes.length]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="nr-strip-holder" ref={holderRef} style={height ? { height } : undefined}>
    <nav ref={navRef} className={"nr-strip" + (stuck ? " nr-strip-stuck" : "")} aria-label="Categories">
      <div className="nr-strip-row">
        <div className="nr-strip-scroller" ref={scrollerRef} onScroll={measure}>
          {nodes.map((node, i) => (
            <button
              key={node.label}
              ref={(el) => (tileRefs.current[i] = el)}
              type="button"
              className={"nr-tile" + (i === activeIndex ? " nr-tile-active" : "")}
              aria-current={i === activeIndex ? "page" : undefined}
              onClick={() => onSelect(i)}
            >
              <CategoryIcon iconKey={iconKeyOf[node.label]} />
              <span className="nr-tile-label">{node.label}</span>
            </button>
          ))}
        </div>
        <div className="nr-strip-menu">
          <button
            type="button"
            className="nr-burger"
            onClick={onMenu}
            aria-label={menuLabel}
            tabIndex={stuck ? 0 : -1}
          >
            <BurgerIcon />
          </button>
        </div>
      </div>

      <div className="nr-strip-track" aria-hidden="true">
        {thumb.width < 100 ? (
          <span className="nr-strip-thumb" style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }} />
        ) : null}
      </div>
    </nav>
    </div>
  );
}
