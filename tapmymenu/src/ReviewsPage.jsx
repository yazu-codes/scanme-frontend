import { useCallback, useEffect, useState } from "react";

/**
 * ReviewsPage
 *
 * Public "leave us a review" page. Fetches:
 *   GET https://{API_BASE}/reviews/{urlname}
 *   -> { reviewLinks: [{ url, title, image_url }, ...] }
 */

const API_BASE = process.env.REACT_APP_API_BASE;

/* ------------------------------------------------------------------- utils */

/**
 * Makes a stored link safe to put in an href.
 *
 * "google.com/x"          -> "https://google.com/x"
 * "//google.com/x"        -> "https://google.com/x"
 * "http://google.com/x"   -> unchanged (already absolute)
 * "HTTPS://Google.com"    -> unchanged (case-insensitive match)
 *
 * Returns "" for anything unusable, so callers can skip rendering the link.
 */
export function toAbsoluteUrl(raw) {
  if (typeof raw !== "string") return "";

  const url = raw.trim();
  if (!url) return "";

  // Already absolute http(s).
  if (/^https?:\/\//i.test(url)) return url;

  // Some other scheme (mailto:, tel:, javascript:, ...) - only allow safe ones.
  const scheme = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme) {
    const name = scheme[1].toLowerCase();
    return name === "mailto" || name === "tel" ? url : "";
  }

  // Protocol-relative.
  if (url.startsWith("//")) return `https:${url}`;

  // Bare host, possibly with stray leading slashes: "/google.com" or "google.com".
  return `https://${url.replace(/^\/+/, "")}`;
}

/* ---------------------------------------------------------------- logo tile */

function hueFrom(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

function Logo({ src, title, size }) {
  const [broken, setBroken] = useState(false);
  const href = toAbsoluteUrl(src);

  useEffect(() => setBroken(false), [href]);

  if (!href || broken) {
    const hue = hueFrom(title);
    return (
      <span
        className="rvw-logo rvw-logo--mono"
        data-size={size}
        style={{
          background: `linear-gradient(150deg, hsl(${hue} 62% 58%), hsl(${(hue + 38) % 360} 66% 42%))`,
        }}
        aria-hidden="true"
      >
        {(title || "?").trim().charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="rvw-logo" data-size={size}>
      <img src={href} alt="" loading="lazy" onError={() => setBroken(true)} />
    </span>
  );
}

/* ----------------------------------------------------------------- skeleton */

function Skeleton() {
  return (
    <div className="rvw-skeleton" aria-hidden="true">
      <div className="rvw-sk rvw-sk--hero" />
      <div className="rvw-sk-group">
        <div className="rvw-sk rvw-sk--row" />
        <div className="rvw-sk rvw-sk--row" />
        <div className="rvw-sk rvw-sk--row" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- component */

export default function ReviewsPage({ urlname }) {
  const [links, setLinks] = useState([]);
  const [state, setState] = useState("loading"); // loading | live | empty | error
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState("loading");

    fetch(`https://${API_BASE}/reviews/${urlname}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.reviewLinks)
          ? data.reviewLinks
              .map((l) => ({ ...l, url: toAbsoluteUrl(l?.url) }))
              .filter((l) => l.url)
          : [];
        setLinks(list);
        setState(list.length ? "live" : "empty");
      })
      .catch(() => {
        if (cancelled) return;
        setLinks([]);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [urlname, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const [hero, ...rest] = links;

  return (
    <div className="rvw">
      <style>{CSS}</style>

      <div className="rvw-glow" aria-hidden="true" />

      <main className="rvw-shell">
        <header className="rvw-head">
          <h1 className="rvw-title">How was it?</h1>
          <p className="rvw-sub">
            {state === "live"
              ? "Pick where you'd like to leave a few words. It opens in a new tab and takes about a minute."
              : "Tell us about your visit."}
          </p>
        </header>

        {state === "loading" && <Skeleton />}

        {state === "error" && (
          <section className="rvw-state" role="alert">
            <p className="rvw-state-title">This page didn't load</p>
            <p className="rvw-state-body">
              The connection dropped on the way. Check your signal and load it
              again.
            </p>
            <button type="button" className="rvw-btn" onClick={retry}>
              Try again
            </button>
          </section>
        )}

        {state === "empty" && (
          <section className="rvw-state">
            <p className="rvw-state-title">No review links yet</p>
            <p className="rvw-state-body">
              This place hasn't added anywhere to review it. Do mention it to
              them - they'll want to know.
            </p>
          </section>
        )}

        {state === "live" && (
          <>
            {hero && (
              <a
                className="rvw-hero"
                href={hero.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ "--i": 0 }}
              >
                <Logo src={hero.image_url} title={hero.title} size="lg" />
                <span className="rvw-hero-body">
                  <span className="rvw-pill">Start here</span>
                  <span className="rvw-hero-title">{hero.title}</span>
                  <span className="rvw-hero-cta">Write a review</span>
                </span>
                <Chevron />
              </a>
            )}

            {rest.length > 0 && (
              <nav className="rvw-group" aria-label="Other review sites">
                {rest.map((link, i) => (
                  <a
                    key={link.url + i}
                    className="rvw-row"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ "--i": i + 1 }}
                  >
                    <Logo src={link.image_url} title={link.title} size="sm" />
                    <span className="rvw-row-title">{link.title}</span>
                    <Chevron />
                  </a>
                ))}
              </nav>
            )}

            <footer className="rvw-foot">
              <p className="rvw-note">Thanks for taking the time.</p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

function Chevron() {
  return (
    <svg className="rvw-chev" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------- css */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..700,0..100,0..1&family=Manrope:wght@400;500;600;700&display=swap');

.rvw {
  --ink: #17121F;
  --plum: #2B2036;
  --surface: rgba(255,255,255,0.055);
  --surface-hi: rgba(255,255,255,0.085);
  --line: rgba(255,255,255,0.09);
  --amber: #F0A75E;
  --amber-soft: #FFD3A1;
  --text: #F7F2EC;
  --muted: #A79BB5;

  position: relative;
  min-height: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(120% 70% at 50% -10%, #3A2B45 0%, rgba(58,43,69,0) 62%),
    linear-gradient(180deg, var(--plum) 0%, var(--ink) 46%, #120E19 100%);
  color: var(--text);
  font-family: Manrope, ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.rvw-glow {
  position: absolute;
  top: -170px; left: 50%;
  width: 460px; height: 380px;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgba(240,167,94,0.30), rgba(240,167,94,0));
  filter: blur(14px);
  pointer-events: none;
}

.rvw-shell {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 52px 20px calc(40px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

/* ---- header ---- */

.rvw-head { margin-bottom: 30px; }

.rvw-title {
  margin: 0;
  font-family: Fraunces, Georgia, serif;
  font-variation-settings: 'opsz' 96, 'SOFT' 40, 'WONK' 1;
  font-weight: 600;
  font-size: clamp(38px, 12vw, 52px);
  line-height: 0.98;
  letter-spacing: -0.02em;
}

.rvw-sub {
  margin: 12px 0 0;
  max-width: 32ch;
  font-size: 15px;
  line-height: 1.5;
  color: var(--muted);
}

/* ---- hero card ---- */

.rvw-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 14px;
  border: 1px solid rgba(240,167,94,0.30);
  border-radius: 22px;
  background:
    linear-gradient(145deg, rgba(240,167,94,0.16), rgba(240,167,94,0.04) 58%),
    var(--surface-hi);
  box-shadow: 0 18px 40px -26px rgba(0,0,0,0.9);
  text-decoration: none;
  color: inherit;
  transition: transform 180ms cubic-bezier(.22,1,.36,1), border-color 180ms ease;
}

.rvw-hero-body { display: flex; flex-direction: column; gap: 5px; min-width: 0; flex: 1; }

.rvw-pill {
  align-self: flex-start;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(240,167,94,0.18);
  color: var(--amber-soft);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.rvw-hero-title {
  font-family: Fraunces, Georgia, serif;
  font-variation-settings: 'opsz' 48, 'SOFT' 30;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rvw-hero-cta { font-size: 14px; font-weight: 600; color: var(--amber); }

/* ---- grouped rows ---- */

.rvw-group {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  overflow: hidden;
}

.rvw-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 18px;
  text-decoration: none;
  color: inherit;
  transition: background 160ms ease, transform 180ms cubic-bezier(.22,1,.36,1);
}

.rvw-row + .rvw-row { box-shadow: inset 0 1px 0 var(--line); }

.rvw-row-title {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- logo ---- */

.rvw-logo {
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 14px;
  background: rgba(255,255,255,0.94);
  overflow: hidden;
}
.rvw-logo[data-size='lg'] { width: 62px; height: 62px; border-radius: 18px; }
.rvw-logo[data-size='sm'] { width: 40px; height: 40px; }
.rvw-logo img { width: 68%; height: 68%; object-fit: contain; }

.rvw-logo--mono {
  color: #fff;
  font-family: Fraunces, Georgia, serif;
  font-weight: 700;
  font-size: 20px;
}
.rvw-logo--mono[data-size='lg'] { font-size: 28px; }

/* ---- chevron ---- */

.rvw-chev {
  flex: none;
  width: 18px; height: 18px;
  color: rgba(255,255,255,0.34);
  transition: transform 180ms cubic-bezier(.22,1,.36,1), color 160ms ease;
}

/* ---- press / hover / focus ---- */

@media (hover: hover) {
  .rvw-hero:hover { border-color: rgba(240,167,94,0.55); }
  .rvw-row:hover { background: rgba(255,255,255,0.05); }
  .rvw-hero:hover .rvw-chev,
  .rvw-row:hover .rvw-chev { transform: translateX(3px); color: var(--amber); }
  .rvw-btn:hover { background: rgba(240,167,94,0.16); }
}

.rvw-hero:active { transform: scale(0.985); }
.rvw-row:active { background: rgba(255,255,255,0.07); transform: scale(0.99); }
.rvw-btn:active { transform: scale(0.97); }

.rvw a:focus-visible,
.rvw button:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 3px;
  border-radius: 18px;
}

/* ---- empty / error ---- */

.rvw-state {
  padding: 30px 24px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
  text-align: center;
}

.rvw-state-title {
  margin: 0;
  font-family: Fraunces, Georgia, serif;
  font-variation-settings: 'opsz' 48, 'SOFT' 30;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.rvw-state-body {
  margin: 8px auto 0;
  max-width: 30ch;
  font-size: 14px;
  line-height: 1.55;
  color: var(--muted);
}

.rvw-btn {
  margin-top: 20px;
  padding: 12px 22px;
  border: 1px solid rgba(240,167,94,0.45);
  border-radius: 999px;
  background: rgba(240,167,94,0.10);
  color: var(--amber-soft);
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 160ms ease, transform 180ms cubic-bezier(.22,1,.36,1);
}

/* ---- footer ---- */

.rvw-foot { margin-top: 22px; }

.rvw-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(167,155,181,0.7);
  text-align: center;
}

/* ---- skeleton ---- */

.rvw-sk {
  border-radius: 20px;
  background: linear-gradient(100deg, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0.05) 70%);
  background-size: 220% 100%;
  animation: rvw-shimmer 1.5s linear infinite;
}
.rvw-sk--hero { height: 102px; margin-bottom: 14px; border-radius: 22px; }
.rvw-sk--row { height: 70px; border-radius: 0; background-color: transparent; }
.rvw-sk-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
}

@keyframes rvw-shimmer {
  from { background-position: 120% 0; }
  to { background-position: -120% 0; }
}

/* ---- entrance ---- */

.rvw-hero, .rvw-row, .rvw-state {
  animation: rvw-rise 520ms cubic-bezier(.22,1,.36,1) backwards;
  animation-delay: calc(var(--i, 0) * 55ms + 60ms);
}

@keyframes rvw-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .rvw-hero, .rvw-row, .rvw-state, .rvw-sk { animation: none; }
  .rvw *, .rvw *::before { transition-duration: 1ms !important; }
}
`;