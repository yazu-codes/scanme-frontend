import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BurgerIcon } from "./Icons";
import { countItems } from "../menuData";
import CategoryIcon from "./CategoryIcon";

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Keep the active tab / chip in view inside its horizontal scroller.
function useCentre(scrollerRef, itemRef, key) {
  useEffect(() => {
    const row = scrollerRef.current;
    const item = itemRef();
    if (!row || !item) return;
    const left = item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2;
    if (typeof row.scrollTo === "function") {
      row.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    } else {
      row.scrollLeft = left;
    }
    // itemRef reads refs, which never change identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, scrollerRef]);
}

// Pinned category bar shared by menuKit themes: a row of top-level
// category tabs (optionally with icons: pass iconKeyOf), plus a second row
// of sub-category chips ("All" + one per sub-category of the category
// being read). Both rows pin to the top once the guest scrolls past them.
//
// Pinning is position: fixed + a placeholder of the same height, NOT
// position: sticky: useBodyBackgroundSync puts overflow-x: hidden on
// <html>/<body>, which breaks sticky. The bar's height is published as
// --mk-pin-h on the theme root, so sections land just below it
// (scroll-margin-top) and the reading line of the scroll-spy matches.
//
// The chip row is always present (same height) whenever the menu has any
// sub-categories; for a category without any it shows the item count.
// A constant height keeps every landing exact.
export default function PinnedNav({
  rootRef,
  nodes,
  itemsByLabel,
  activeTop,
  activeSub,
  strings,
  onSelectTop,
  onSelectSub,
  onMenu,
  iconKeyOf,
}) {
  const holderRef = useRef(null);
  const barRef = useRef(null);
  const tabsRef = useRef(null);
  const chipsRef = useRef(null);
  const tabRefs = useRef([]);
  const chipRefs = useRef({});
  const [stuck, setStuck] = useState(false);
  const [height, setHeight] = useState(null);
  const hasSubRow = nodes.some((n) => n.children.length > 0);
  const top = nodes[activeTop];

  // Height -> placeholder + --mk-pin-h. Re-measured when fonts load or
  // the viewport changes.
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    function measure() {
      const h = bar.offsetHeight;
      setHeight(h);
      if (rootRef.current) rootRef.current.style.setProperty("--mk-pin-h", `${h}px`);
    }
    measure();
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(bar);
    } else {
      window.addEventListener("resize", measure);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, [rootRef]);

  useEffect(() => {
    let frame = null;
    function check() {
      frame = null;
      const holder = holderRef.current;
      if (!holder) return;
      const next = holder.getBoundingClientRect().top <= 0;
      setStuck((prev) => (prev === next ? prev : next));
    }
    function schedule() {
      if (frame == null) frame = requestAnimationFrame(check);
    }
    schedule();
    document.addEventListener("scroll", schedule, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, []);

  useCentre(tabsRef, () => tabRefs.current[activeTop], activeTop);
  useCentre(chipsRef, () => chipRefs.current[activeSub == null ? "" : activeSub], `${activeTop}|${activeSub}`);

  return (
    <div className="mk-pin" ref={holderRef} style={height ? { height } : undefined}>
      <nav
        ref={barRef}
        className={"mk-pin-bar" + (stuck ? " mk-pin-stuck" : "")}
        aria-label={strings.categories}
      >
        <div className="mk-pin-inner">
          <div className="mk-tabs-row">
            <div className="mk-tabs" ref={tabsRef}>
              {nodes.map((node, i) => (
                <button
                  key={node.label}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  className={"mk-tab" + (i === activeTop ? " mk-tab-active" : "")}
                  aria-current={i === activeTop ? "true" : undefined}
                  onClick={() => onSelectTop(i)}
                >
                  {iconKeyOf ? (
                    <span className="mk-tab-icon">
                      <CategoryIcon iconKey={iconKeyOf[node.label]} size={22} />
                    </span>
                  ) : null}
                  <span className="mk-tab-label">{node.label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="mk-burger" onClick={onMenu} aria-label={strings.openMenu}>
              <BurgerIcon />
            </button>
          </div>

          {hasSubRow ? (
            <div className="mk-chips" ref={chipsRef} aria-label={strings.subcategories}>
              {top && top.children.length > 0 ? (
                <>
                  <button
                    type="button"
                    ref={(el) => {
                      chipRefs.current[""] = el;
                    }}
                    className={"mk-chip" + (activeSub == null ? " mk-chip-active" : "")}
                    aria-pressed={activeSub == null}
                    onClick={() => onSelectSub(String(activeTop))}
                  >
                    {strings.all}
                  </button>
                  {top.children.map((child, j) => {
                    const path = `${activeTop}-${j}`;
                    return (
                      <button
                        key={child.label}
                        type="button"
                        ref={(el) => {
                          chipRefs.current[path] = el;
                        }}
                        className={"mk-chip" + (activeSub === path ? " mk-chip-active" : "")}
                        aria-pressed={activeSub === path}
                        onClick={() => onSelectSub(path)}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </>
              ) : (
                <span className="mk-chips-note">
                  {top ? `${top.label} · ${strings.items(countItems(top, itemsByLabel))}` : ""}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
