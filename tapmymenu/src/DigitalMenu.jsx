import React, { useEffect, useMemo, useRef, useState } from "react";
import { Phone, X, UtensilsCrossed } from "lucide-react";

/**
 * DigitalMenu
 * -----------
 * Fetches a menu from the backend and renders it. Data shape matches the
 * Menu/MenuItem/MenuOwner/MenuConfiguration structs (font family, font size,
 * background/font color, logo, hero image, slogan, phone, items, categories,
 * allergens — everything comes from the fetched payload, nothing hardcoded).
 *
 * Usage: <DigitalMenu urlname="the-bite" />
 * Fetches: https://{REACT_APP_API_BASE}/{urlname}  →  { menu: {...} }
 */

const API_BASE = process.env.REACT_APP_API_BASE;

// Google Fonts we can reasonably serve on demand for whatever family the
// config specifies. Anything outside this list falls back to Roboto so we
// never fire a request for a font family we can't safely resolve.
const GOOGLE_FONT_WHITELIST = new Set([
  "Roboto",
  "Poppins",
  "Montserrat",
  "Inter",
  "Lato",
  "Open Sans",
  "Oswald",
  "Nunito",
  "Merriweather",
  "Work Sans",
  "Rubik",
  "DM Sans",
  "Fraunces",
  "Playfair Display",
]);
const FALLBACK_FONT = "Roboto";

function loadGoogleFont(fontFamily) {
  if (!fontFamily) return;
  const id = `dm-font-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
    /\s+/g,
    "+"
  )}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function formatPrice(value) {
  const n = Number(value) || 0;
  const rounded = Math.round(n * 100) / 100;
  return `${rounded.toFixed(2)} лв`;
}

// Allergens arrive as a single string. The delimiter varies across real
// entries (comma, semicolon, or slash), so split on any of them and drop
// empties/whitespace.
function splitAllergens(raw) {
  if (!raw) return [];
  return raw
    .split(/[,;/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function DigitalMenu({ urlname }) {
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [contactOpen, setContactOpen] = useState(false);

  // ---- Fetch the menu from the backend ---------------------------------
  useEffect(() => {
    if (!urlname) {
      setStatus("error");
      return;
    }
    let cancelled = false;

    async function fetchMenu() {
      setStatus("loading");
      try {
        const res = await fetch(`https://${API_BASE}/${urlname}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setMenu(data.menu);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load menu", err);
          setStatus("error");
        }
      }
    }

    fetchMenu();
    return () => {
      cancelled = true;
    };
  }, [urlname]);

  const owner = menu?.menu_owner || {};
  const config = menu?.menu_configuration || {};
  const items = menu?.menu_items || [];

  // No category_order field is guaranteed on every payload: derive category
  // order from first appearance in menu_items instead of a fixed list, so
  // an uneven category "tree" (a 3-item category next to a 15-item one) is
  // handled the same way regardless of which categories exist.
  const categories = useMemo(() => {
    const seen = [];
    items.forEach((i) => {
      if (i.category && !seen.includes(i.category)) seen.push(i.category);
    });
    return seen;
  }, [items]);

  const grouped = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat] = items
        .filter((i) => i.category === cat)
        .sort((a, b) => (a.display_order_position ?? 0) - (b.display_order_position ?? 0));
    });
    return map;
  }, [categories, items]);

  const [active, setActive] = useState("");
  useEffect(() => {
    if (categories.length && !active) setActive(categories[0]);
  }, [categories, active]);

  const navRefs = useRef({});
  const sectionRefs = useRef({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !categories.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.dataset.category);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const btn = navRefs.current[active];
    if (btn) setUnderline({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [active, categories]);

  const scrollToCategory = (cat) => {
    const el = sectionRefs.current[cat];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ---- Font family from config, loaded on demand -----------------------
  const resolvedFont = useMemo(() => {
    const requested = (config.font_family || "").trim();
    return requested && GOOGLE_FONT_WHITELIST.has(requested) ? requested : FALLBACK_FONT;
  }, [config.font_family]);

  useEffect(() => {
    loadGoogleFont(resolvedFont);
  }, [resolvedFont]);

  const rootStyle = {
    "--bg": config.background_color || "#000000",
    "--fg": config.font_color || "#ff6a00",
    "--font-family": `'${resolvedFont}', sans-serif`,
    "--font-size": `${config.font_size || 16}px`,
  };

  // ---- Loading / error states --------------------------------------------
  if (status === "loading") {
    return (
      <div className="dm-root dm-state" style={rootStyle}>
        <style>{CSS}</style>
        <div className="dm-spinner" aria-hidden="true" />
        <p>Зареждане на менюто…</p>
      </div>
    );
  }

  if (status === "error" || !menu) {
    return (
      <div className="dm-root dm-state" style={rootStyle}>
        <style>{CSS}</style>
        <p>Менюто не можа да се зареди. Опитайте отново след малко.</p>
      </div>
    );
  }

  // ---- Ready ---------------------------------------------------------
  return (
    <div className="dm-root" style={rootStyle}>
      <style>{CSS}</style>

      {/* ---------------- Hero ---------------- */}
      <header
        className="dm-hero"
        style={{
          backgroundImage: owner.menu_owner_place_background_url
            ? `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 55%, var(--bg) 96%), url(${owner.menu_owner_place_background_url})`
            : "none",
        }}
      >
        <div className="dm-hero-inner">
          {owner.menu_owner_logo_url && (
            <div className="dm-logo">
              <img src={owner.menu_owner_logo_url} alt={`${owner.menu_owner_name} logo`} />
            </div>
          )}
          <h1 className="dm-title">{owner.menu_owner_name}</h1>
          {owner.menu_owner_slogan && <p className="dm-slogan">{owner.menu_owner_slogan}</p>}
        </div>
      </header>

      {/* ---------------- Sticky category nav ---------------- */}
      <nav className="dm-nav" aria-label="Категории от менюто">
        <div className="dm-nav-track">
          {categories.map((cat) => (
            <button
              key={cat}
              ref={(el) => (navRefs.current[cat] = el)}
              className={`dm-nav-btn${active === cat ? " is-active" : ""}`}
              onClick={() => scrollToCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <span
            className="dm-nav-underline"
            style={{ transform: `translateX(${underline.left}px)`, width: underline.width }}
          />
        </div>
      </nav>

      {/* ---------------- Menu sections ---------------- */}
      <main className="dm-main">
        {categories.map((cat) => {
          const list = grouped[cat] || [];
          return (
            <section
              key={cat}
              className="dm-section"
              data-category={cat}
              ref={(el) => (sectionRefs.current[cat] = el)}
            >
              <div className="dm-section-head">
                <h2>{cat}</h2>
                <span>{list.length}</span>
              </div>

              <div className="dm-grid">
                {list.map((item, idx) => {
                  const allergens = splitAllergens(item.allergens);
                  const hasPhoto = !!item.picture_url;
                  return (
                    <article
                      key={`${cat}-${idx}`}
                      className={`dm-item${hasPhoto ? "" : " dm-item--no-photo"}`}
                    >
                      {hasPhoto && (
                        <div className="dm-item-photo">
                          <img src={item.picture_url} alt={item.name} loading="lazy" />
                        </div>
                      )}
                      <div className="dm-item-body">
                        <div className="dm-leader-row">
                          <span className="dm-item-name">{item.name}</span>
                          <span className="dm-dots" aria-hidden="true" />
                          <span className="dm-item-price">{formatPrice(item.price)}</span>
                        </div>
                        {item.description && <p className="dm-item-desc">{item.description}</p>}
                        {allergens.length > 0 && (
                          <p className="dm-item-allergens">{allergens.join(" · ")}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* ---------------- Floating contact ---------------- */}
      {owner.menu_owner_phone && (
        <div className={`dm-contact${contactOpen ? " is-open" : ""}`}>
          {contactOpen && (
            <div className="dm-contact-panel">
              <button className="dm-contact-close" onClick={() => setContactOpen(false)} aria-label="Затвори">
                <X size={16} strokeWidth={1.75} />
              </button>
              <p className="dm-contact-eyebrow">{owner.menu_owner_name}</p>
              <a className="dm-contact-call" href={`tel:${owner.menu_owner_phone.replace(/\s+/g, "")}`}>
                <Phone size={14} strokeWidth={1.75} />
                {owner.menu_owner_phone}
              </a>
            </div>
          )}
          <button
            className="dm-contact-fab"
            onClick={() => setContactOpen((v) => !v)}
            aria-expanded={contactOpen}
            aria-label="Контакт"
          >
            <UtensilsCrossed size={18} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}

const CSS = `
.dm-root {
  --muted: color-mix(in srgb, var(--fg) 55%, var(--bg) 45%);
  --line: color-mix(in srgb, var(--fg) 20%, transparent);
  --surface: color-mix(in srgb, var(--fg) 6%, var(--bg) 94%);
  --fg-dim: color-mix(in srgb, var(--fg) 32%, var(--bg) 68%);

  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-family);
  font-size: var(--font-size);
  min-height: 100vh;
  position: relative;
  line-height: 1.5;
}

.dm-root * { box-sizing: border-box; }

/* ---------- Loading / error state ---------- */

.dm-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 24px;
  font-size: 14px;
  color: var(--fg);
}

.dm-spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--fg) 25%, transparent);
  border-top-color: var(--fg);
  animation: dmSpin 0.8s linear infinite;
}

@keyframes dmSpin {
  to { transform: rotate(360deg); }
}

/* ---------- Hero ---------- */

.dm-hero {
  position: relative;
  min-height: 62vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 40px 24px 64px;
  text-align: center;
}

.dm-hero-inner {
  max-width: 640px;
  animation: dmRise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dm-logo {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--fg) 55%, transparent);
  margin-bottom: 18px;
  background: var(--surface);
}

.dm-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }

.dm-title {
  margin: 0;
  font-size: clamp(38px, 9vw, 64px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 24px rgba(0,0,0,0.5);
}

.dm-slogan {
  margin: 14px 0 0;
  font-weight: 400;
  font-size: 15px;
  color: color-mix(in srgb, var(--fg) 85%, transparent);
}

@keyframes dmRise {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- Nav ---------- */

.dm-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.dm-nav-track {
  position: relative;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0 16px;
  max-width: 960px;
  margin: 0 auto;
}

.dm-nav-track::-webkit-scrollbar { display: none; }

.dm-nav-btn {
  flex: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 14px 12px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--muted);
  transition: color 0.25s ease;
  white-space: nowrap;
}

.dm-nav-btn.is-active { color: var(--fg); font-weight: 700; }

.dm-nav-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--fg);
  transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1), width 0.35s cubic-bezier(0.65, 0, 0.35, 1);
}

/* ---------- Sections ---------- */

.dm-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 20px 140px;
}

.dm-section { padding-top: 48px; scroll-margin-top: 64px; }
.dm-section:first-child { padding-top: 32px; }

.dm-section-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
  margin-bottom: 24px;
}

.dm-section-head h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.dm-section-head span {
  font-size: 12px;
  color: var(--fg-dim);
}

.dm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 26px 22px;
}

.dm-item { display: flex; flex-direction: column; }

.dm-item-photo {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 6px;
  background: var(--surface);
}

.dm-item-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.dm-item:hover .dm-item-photo img { transform: scale(1.05); }

.dm-item-body { padding-top: 10px; }

.dm-item--no-photo .dm-item-body { padding-top: 0; }

.dm-leader-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.dm-item-name {
  font-size: 15.5px;
  font-weight: 500;
}

.dm-dots {
  flex: 1;
  border-bottom: 2px dotted var(--line);
  transform: translateY(-4px);
  min-width: 10px;
}

.dm-item-price {
  font-size: 14px;
  font-weight: 700;
  color: var(--fg);
  white-space: nowrap;
}

.dm-item-desc {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.dm-item-allergens {
  margin: 6px 0 0;
  font-size: 10.5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--fg-dim);
}

/* ---------- Floating contact ---------- */

.dm-contact {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.dm-contact-fab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: var(--fg);
  color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 26px rgba(0,0,0,0.45);
}

.dm-contact-panel {
  position: relative;
  width: 210px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.45);
  animation: dmPanelIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes dmPanelIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dm-contact-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
}

.dm-contact-eyebrow {
  margin: 0 0 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-dim);
}

.dm-contact-call {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 9px 12px;
}

/* ---------- Responsive ---------- */

@media (max-width: 560px) {
  .dm-hero { min-height: 52vh; padding: 28px 18px 48px; }
  .dm-contact { right: 12px; bottom: 12px; }
}

/* ---------- Motion preference ---------- */

@media (prefers-reduced-motion: reduce) {
  .dm-root *, .dm-root *::before, .dm-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;
