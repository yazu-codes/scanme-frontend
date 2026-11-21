import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Allergens, CloseIcon, InfoIcon, OriginalName, formatEuro, splitWeight } from "../../shared/menuKit";
import HeartButton from "./Heart";

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 15V3M7 8l5-5 5 5" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M2.5 5v6M4.5 5v6M3.5 11v9M21 5c-1.5 1-2 3-2 6h2v9" />
    </svg>
  );
}

// Name split into words that slide up one after another when the reel
// becomes the active one (.cv-reel-active .cv-reel-word).
function Words({ text }) {
  return (
    <h2 className="cv-reel-name" aria-label={text}>
      {String(text)
        .split(/\s+/)
        .map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 ? " " : null}
            <span className="cv-reel-word" style={{ "--cv-i": i }} aria-hidden="true">
              {w}
            </span>
          </React.Fragment>
        ))}
    </h2>
  );
}

// The dish feed: full-screen reels, one dish per screen, swiped
// vertically (CSS scroll-snap). Double-tap the photo to crave it (heart +
// confetti + haptic), ♥ toggles, ↗ shares, ⓘ opens the full detail sheet,
// the plate opens "My table". Closes on ✕, Escape and back.
export default function Feed({
  open,
  items,
  startIndex,
  title,
  strings,
  craved,
  onCrave,
  onToggleCrave,
  onClose,
  onInfo,
  onShare,
  tableCount,
  onOpenTable,
  covered,
}) {
  const scrollerRef = useRef(null);
  const closeRef = useRef(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const [active, setActive] = useState(startIndex);
  const [hint, setHint] = useState(false);

  // Land on the tapped dish before the first paint.
  useLayoutEffect(() => {
    if (!open || !scrollerRef.current) return;
    const el = scrollerRef.current;
    el.scrollTop = startIndex * el.clientHeight;
    setActive(startIndex);
  }, [open, startIndex, items]);

  // Which reel is on screen.
  useEffect(() => {
    if (!open || !scrollerRef.current || typeof IntersectionObserver === "undefined") return undefined;
    const root = scrollerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        });
      },
      { root, threshold: 0.6 }
    );
    root.querySelectorAll(".cv-reel").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [open, items]);

  // "Swipe up" hint, once per visit, when there is something to swipe to.
  useEffect(() => {
    if (!open || items.length < 2) return undefined;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem("dm-crave-hint") === "1";
      window.sessionStorage.setItem("dm-crave-hint", "1");
    } catch (e) {
      seen = false;
    }
    if (seen) return undefined;
    setHint(true);
    const t = setTimeout(() => setHint(false), 2600);
    return () => clearTimeout(t);
  }, [open, items.length]);

  // Escape closes; arrow keys move between reels; focus the ✕. Keys are
  // ignored while a layer above (detail sheet, My table) is open.
  const coveredRef = useRef(covered);
  useEffect(() => {
    coveredRef.current = covered;
  }, [covered]);
  useEffect(() => {
    if (!open) return undefined;
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    function onKey(e) {
      if (coveredRef.current) return;
      const el = scrollerRef.current;
      if (e.key === "Escape") onClose();
      else if (el && (e.key === "ArrowDown" || e.key === "PageDown")) {
        e.preventDefault();
        el.scrollBy({ top: el.clientHeight, behavior: "smooth" });
      } else if (el && (e.key === "ArrowUp" || e.key === "PageUp")) {
        e.preventDefault();
        el.scrollBy({ top: -el.clientHeight, behavior: "smooth" });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onPhotoTap = useCallback(
    (item, e) => {
      const now = Date.now();
      const prev = lastTap.current;
      const near = Math.abs(e.clientX - prev.x) < 40 && Math.abs(e.clientY - prev.y) < 40;
      if (now - prev.t < 320 && near) {
        lastTap.current = { t: 0, x: 0, y: 0 };
        onCrave(item, e, true);
      } else {
        lastTap.current = { t: now, x: e.clientX, y: e.clientY };
      }
    },
    [onCrave]
  );

  const n = items.length;
  return (
    <div className={"cv-feed" + (open ? " cv-feed-open" : "")} role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open}>
      <div className="cv-feed-top">
        <div className="cv-feed-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${n ? (active + 1) / n : 0})` }} />
        </div>
        <div className="cv-feed-bar">
          <span className="cv-feed-title">{title}</span>
          <span className="cv-feed-count">
            {n ? active + 1 : 0} / {n}
          </span>
          <button type="button" ref={closeRef} className="cv-feed-close" onClick={onClose} aria-label={strings.close} tabIndex={open ? 0 : -1}>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="cv-feed-scroller" ref={scrollerRef}>
        {open
          ? items.map((item, i) => {
              const near = Math.abs(i - active) <= 2;
              const { description, weight } = splitWeight(item.description);
              const on = craved.has(item);
              return (
                <section key={`${item.display_order_position}-${item.name}-${i}`} className={"cv-reel" + (i === active ? " cv-reel-active" : "")} data-i={i} aria-label={item.name}>
                  {near ? <div className="cv-reel-bg" style={{ backgroundImage: `url(${JSON.stringify(item.picture_url)})` }} /> : null}
                  <div className="cv-reel-photo" onPointerUp={(e) => onPhotoTap(item, e)}>
                    {near ? <img src={item.picture_url} alt="" draggable="false" /> : null}
                  </div>
                  <div className="cv-reel-info">
                    <span className="cv-reel-price">{formatEuro(item.price)}</span>
                    <Words text={item.name} />
                    <OriginalName item={item} className="cv-orig" />
                    {description ? <p className="cv-reel-desc">{description}</p> : null}
                    <div className="cv-reel-meta">
                      {weight ? <span className="cv-weight">{weight}</span> : null}
                      <Allergens allergens={item.allergens} className="cv-allergens" />
                    </div>
                  </div>
                  <div className="cv-reel-rail">
                    <div className="cv-rail-item">
                      <HeartButton
                        on={on}
                        className="cv-rail-btn"
                        label={on ? strings.uncrave : strings.crave}
                        onToggle={(e) => onToggleCrave(item, e)}
                      />
                      <span>{strings.craveShort}</span>
                    </div>
                    <div className="cv-rail-item">
                      <button type="button" className="cv-rail-btn" onClick={() => onShare(item)} aria-label={strings.share}>
                        <ShareIcon />
                      </button>
                      <span>{strings.share}</span>
                    </div>
                    <div className="cv-rail-item">
                      <button type="button" className="cv-rail-btn" onClick={() => onInfo(item)} aria-label={strings.details}>
                        <InfoIcon size={22} />
                      </button>
                      <span>{strings.details}</span>
                    </div>
                    <div className="cv-rail-item">
                      <button type="button" className="cv-rail-btn cv-rail-table" onClick={onOpenTable} aria-label={strings.myTable}>
                        <TableIcon />
                        {tableCount ? <span className="cv-rail-badge" key={tableCount}>{tableCount}</span> : null}
                      </button>
                      <span>{strings.myTableShort}</span>
                    </div>
                  </div>
                </section>
              );
            })
          : null}
      </div>
      {hint ? (
        <div className="cv-swipe-hint" aria-hidden="true">
          <span className="cv-swipe-arrow">↑</span>
          {strings.swipeHint}
        </div>
      ) : null}
    </div>
  );
}
