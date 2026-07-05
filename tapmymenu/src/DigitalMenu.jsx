import React, { useEffect, useMemo, useRef, useState } from "react";

// ---- Config ---------------------------------------------------------

const API_BASE = process.env.REACT_APP_API_BASE;
const FALLBACK_FONT = "Roboto";

// A small, safe allow-list of fonts we know how to load from Google
// Fonts on demand. Anything outside this list falls back to Roboto,
// per the requirement.
const GOOGLE_FONT_WHITELIST = new Set([
  "Inter",
  "Roboto",
  "Poppins",
  "Lato",
  "Montserrat",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Work Sans",
  "Rubik",
  "DM Sans",
  "Fraunces",
]);

// ---- Helpers ----------------------------------------------------------

function slugifyCategory(category) {
  return "cat-" + category.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

function loadGoogleFont(fontFamily) {
  if (!fontFamily) return;
  const id = `font-${fontFamily.replace(/\s+/g, "-")}`;
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

function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return n.toFixed(2).replace(/\.00$/, "");
}

// Allergens may come in as a proper array, or as a single string using
// ';' as a separator (e.g. "gluten; dairy; nuts"). Normalize either shape
// into a clean array of trimmed, non-empty strings.
function parseAllergens(allergens) {
  if (Array.isArray(allergens)) {
    return allergens.map((a) => String(a).trim()).filter(Boolean);
  }
  if (typeof allergens === "string") {
    return allergens
      .split(";")
      .map((a) => a.trim())
      .filter(Boolean);
  }
  return [];
}

// Rough luminance check so the placeholder logo and other "on background"
// elements can pick a sensible contrasting tint without extra config.
function isLightColor(hex) {
  if (!hex) return true;
  const c = hex.replace("#", "");
  const full =
    c.length === 3
      ? c
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : c;
  if (full.length !== 6) return true;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

// ---- Sub-components -----------------------------------------------------

function Header({ owner }) {
  const {
    menu_owner_name,
    menu_owner_slogan,
    menu_owner_logo_url,
    menu_owner_place_background_url,
  } = owner;

  const hasPlaceBackground = Boolean(menu_owner_place_background_url);

  return (
    <header
      className={"dm-header" + (hasPlaceBackground ? " dm-header-has-bg" : "")}
    >
      {hasPlaceBackground ? (
        <>
          <div
            className="dm-header-bg-image"
            style={{ backgroundImage: `url(${menu_owner_place_background_url})` }}
            aria-hidden="true"
          />
          {/* Darkens the photo slightly so the name/slogan stay legible */}
          <div className="dm-header-bg-scrim" aria-hidden="true" />
          {/* Soft blur feathering the photo into the nav's hairline separator */}
          <div className="dm-header-bg-blur" aria-hidden="true" />
        </>
      ) : null}

      <div className="dm-header-inner">
        {menu_owner_logo_url ? (
          <img
            className="dm-logo"
            src={menu_owner_logo_url}
            alt={menu_owner_name ? `${menu_owner_name} logo` : "Logo"}
          />
        ) : (
          <div className="dm-logo dm-logo-placeholder" aria-hidden="true">
            {menu_owner_name ? menu_owner_name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <h1 className="dm-owner-name">{menu_owner_name || "Menu"}</h1>
        {menu_owner_slogan ? (
          <p className="dm-slogan">{menu_owner_slogan}</p>
        ) : null}
      </div>
    </header>
  );
}

function CategoryNav({ categories, activeCategory, onSelect, navRef }) {
  return (
    <nav className="dm-category-nav" aria-label="Menu categories" ref={navRef}>
      <div className="dm-category-scroll">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              "dm-category-pill" +
              (category === activeCategory ? " dm-category-pill-active" : "")
            }
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}

function AllergenTag({ allergen }) {
  return <span className="dm-allergen-tag">{allergen}</span>;
}

function MenuItemCard({ item, onSelect }) {
  const allergens = parseAllergens(item.allergens);

  return (
    <article
      className="dm-item-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className="dm-item-media">
        {item.picture_url ? (
          <img
            src={item.picture_url}
            alt={item.name}
            loading="lazy"
            className="dm-item-image"
          />
        ) : (
          <div className="dm-item-image dm-item-image-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <path
                d="M4 16.5 8.5 12l3 3L16 10l4 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="8" r="1.6" fill="currentColor" />
              <rect
                x="3"
                y="4"
                width="18"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="dm-item-body">
        <div className="dm-item-title-row">
          <h3 className="dm-item-name">{item.name}</h3>
          <span className="dm-item-price">€{formatPrice(item.price)}</span>
        </div>

        {item.description ? (
          <p className="dm-item-description">{item.description}</p>
        ) : null}

        <div className="dm-item-allergens">
          <span className="dm-allergen-label">Allergens</span>
          {allergens.length > 0 ? (
            <div className="dm-allergen-list">
              {allergens.map((a) => (
                <AllergenTag key={a} allergen={a} />
              ))}
            </div>
          ) : (
            <span className="dm-allergen-empty">None listed</span>
          )}
        </div>
      </div>
    </article>
  );
}

function CategorySection({ category, items, sectionRef, onSelectItem }) {
  return (
    <section
      id={slugifyCategory(category)}
      ref={sectionRef}
      className="dm-category-section"
    >
      <h2 className="dm-category-heading">{category}</h2>
      <div className="dm-item-grid">
        {items.map((item, idx) => (
          <MenuItemCard
            key={`${item.name}-${idx}`}
            item={item}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}

function Footer({ owner }) {
  const { menu_owner_phone, menu_owner_name } = owner;
  if (!menu_owner_phone && !menu_owner_name) return null;

  return (
    <footer className="dm-footer">
      <div className="dm-footer-divider" aria-hidden="true" />
      {menu_owner_name ? (
        <p className="dm-footer-line">{menu_owner_name}</p>
      ) : null}
      {menu_owner_phone ? (
        <p className="dm-footer-line dm-footer-phone">
          <a href={`tel:${menu_owner_phone}`}>{menu_owner_phone}</a>
        </p>
      ) : null}
    </footer>
  );
}

// Slide-in detail panel. Enters from the right edge of the screen and
// covers the full viewport width on mobile, narrowing to a fixed-width
// side panel on larger screens.
function ItemDetailPanel({ item, open, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const allergens = item ? parseAllergens(item.allergens) : [];

  return (
    <>
      <div
        className={"dm-panel-overlay" + (open ? " dm-panel-overlay-open" : "")}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={"dm-panel" + (open ? " dm-panel-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={item ? item.name : "Item details"}
      >
        {item ? (
          <>
            <button
              type="button"
              className="dm-panel-close"
              onClick={onClose}
              ref={closeButtonRef}
              aria-label="Close item details"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="dm-panel-media">
              {item.picture_url ? (
                <img
                  src={item.picture_url}
                  alt={item.name}
                  className="dm-panel-image"
                />
              ) : (
                <div className="dm-panel-image dm-panel-image-placeholder" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="44" height="44" fill="none">
                    <path
                      d="M4 16.5 8.5 12l3 3L16 10l4 6.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="8" r="1.6" fill="currentColor" />
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="dm-panel-content">
              <span className="dm-panel-category">{item.category}</span>
              <div className="dm-panel-title-row">
                <h2 className="dm-panel-name">{item.name}</h2>
                <span className="dm-panel-price">€{formatPrice(item.price)}</span>
              </div>

              {item.description ? (
                <p className="dm-panel-description">{item.description}</p>
              ) : null}

              <div className="dm-panel-allergens">
                <span className="dm-allergen-label">Allergens</span>
                {allergens.length > 0 ? (
                  <div className="dm-allergen-list">
                    {allergens.map((a) => (
                      <AllergenTag key={a} allergen={a} />
                    ))}
                  </div>
                ) : (
                  <span className="dm-allergen-empty">None listed</span>
                )}
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}

// ---- Main component -----------------------------------------------------

export default function DigitalMenu({ urlname }) {
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const sectionRefs = useRef({});
  const isProgrammaticScroll = useRef(false);
  const navRef = useRef(null);

  // Fetch menu JSON
  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      setStatus("loading");
      try {
        const res = await fetch(`${API_BASE}/${urlname}`);
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

  const config = menu?.menu_configuration || {};
  const owner = menu?.menu_owner || {};

  const backgroundColor = config.background_color || "#FAF7F0";
  const fontColor = config.font_color || "#26241F";

  // Sync the real page background (html/body) to the menu's configured
  // background color so there's no mismatched-color frame around the
  // component on any viewport, and lock horizontal overflow at the
  // document level so nothing (sticky nav, cards, panel) can ever push
  // the page wider than the device. Note: this stays tied to the solid
  // configured color even when the header shows a photo — only the
  // header area itself swaps to the photo.
  useEffect(() => {
    const previousBodyBg = document.body.style.backgroundColor;
    const previousHtmlBg = document.documentElement.style.backgroundColor;
    const previousBodyMargin = document.body.style.margin;
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;

    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      document.body.style.backgroundColor = previousBodyBg;
      document.documentElement.style.backgroundColor = previousHtmlBg;
      document.body.style.margin = previousBodyMargin;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
    };
  }, [backgroundColor]);

  // Lock vertical scroll on the body while the detail panel is open,
  // so the page behind it doesn't scroll along with it.
  useEffect(() => {
    const previousOverflowY = document.body.style.overflowY;
    if (panelOpen) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = previousOverflowY;
    };
  }, [panelOpen]);

  // Resolve font family with fallback
  const resolvedFont = useMemo(() => {
    const requested = (config.font_family || "").trim();
    if (requested && GOOGLE_FONT_WHITELIST.has(requested)) return requested;
    return FALLBACK_FONT;
  }, [config.font_family]);

  useEffect(() => {
    loadGoogleFont(resolvedFont);
  }, [resolvedFont]);

  // Group items by category, respecting display_order_position within category,
  // and category order of first appearance.
  const { categories, itemsByCategory } = useMemo(() => {
    const items = menu?.menu_items || [];
    const order = [];
    const grouped = {};

    for (const item of items) {
      const cat = item.category || "Other";
      if (!grouped[cat]) {
        grouped[cat] = [];
        order.push(cat);
      }
      grouped[cat].push(item);
    }

    for (const cat of order) {
      grouped[cat].sort(
        (a, b) => (a.display_order_position ?? 0) - (b.display_order_position ?? 0)
      );
    }

    return { categories: order, itemsByCategory: grouped };
  }, [menu]);

  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Scroll spy: highlight the nav pill for the section in view
  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const cat = visible[0].target.getAttribute("data-category");
          if (cat) setActiveCategory(cat);
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  function handleCategorySelect(category) {
    setActiveCategory(category);
    const el = sectionRefs.current[category];
    if (el) {
      isProgrammaticScroll.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
    }
  }

  function handleSelectItem(item) {
    setSelectedItem(item);
    setPanelOpen(true);
  }

  function handleClosePanel() {
    setPanelOpen(false);
  }

  const cssVars = {
    "--dm-bg": backgroundColor,
    "--dm-fg": fontColor,
    "--dm-font": `'${resolvedFont}', sans-serif`,
    "--dm-font-size": `${config.font_size || 16}px`,
    "--dm-accent-soft": isLightColor(backgroundColor)
      ? "rgba(0,0,0,0.04)"
      : "rgba(255,255,255,0.08)",
    "--dm-hairline": isLightColor(backgroundColor)
      ? "rgba(0,0,0,0.08)"
      : "rgba(255,255,255,0.12)",
    "--dm-card-bg": isLightColor(backgroundColor)
      ? "rgba(255,255,255,0.65)"
      : "rgba(255,255,255,0.06)",
    "--dm-title-size": `calc(var(--dm-font-size) * 1.2)`,
  };

  if (status === "loading") {
    return (
      <div className="dm-root dm-state-message" style={cssVars}>
        <div className="dm-spinner" aria-hidden="true" />
        <p>Loading menu…</p>
        <DigitalMenuStyles />
      </div>
    );
  }

  if (status === "error" || !menu) {
    return (
      <div className="dm-root dm-state-message" style={cssVars}>
        <p>We couldn't load this menu. Please try again shortly.</p>
        <DigitalMenuStyles />
      </div>
    );
  }

  return (
    <div className="dm-root" style={cssVars}>
      <Header owner={owner} />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
        navRef={navRef}
      />

      <main className="dm-main">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={itemsByCategory[category]}
            onSelectItem={handleSelectItem}
            sectionRef={(el) => {
              sectionRefs.current[category] = el;
              if (el) el.setAttribute("data-category", category);
            }}
          />
        ))}
      </main>

      <Footer owner={owner} />

      <ItemDetailPanel
        item={selectedItem}
        open={panelOpen}
        onClose={handleClosePanel}
      />

      <DigitalMenuStyles />
    </div>
  );
}

// ---- Styles ---------------------------------------------------------
// Kept in-file so this component can be dropped into a project as a
// single unit. Move to a .css file if you prefer.

function DigitalMenuStyles() {
  return (
    <style>{`
      .dm-root, .dm-root *, .dm-root *::before, .dm-root *::after {
        box-sizing: border-box;
      }

      .dm-root {
        background: var(--dm-bg);
        color: var(--dm-fg);
        font-family: var(--dm-font);
        font-size: var(--dm-font-size);
        min-height: 100vh;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      .dm-state-message {
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.75rem;
        padding: 2rem;
      }

      .dm-spinner {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2.5px solid var(--dm-hairline);
        border-top-color: var(--dm-fg);
        animation: dm-spin 0.7s linear infinite;
      }

      @keyframes dm-spin {
        to { transform: rotate(360deg); }
      }

      /* Header */
      .dm-header {
        position: relative;
        padding: 2.75rem 1.25rem 1.75rem;
        text-align: center;
        width: 100%;
        /* Solid color by default — only overridden visually by the
           photo layers below when a place background is present. */
        background: var(--dm-bg);
      }

      /* When a place background photo is present, the header grows a
         little to give the photo room to breathe, and switches its
         text to a light, shadowed treatment so it reads over a photo
         of unknown color/contrast. */
      .dm-header-has-bg {
        padding-top: 4.5rem;
        padding-bottom: 2.75rem;
        overflow: hidden;
      }

      .dm-header-bg-image {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
      }

      .dm-header-bg-scrim {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.28) 0%,
          rgba(0, 0, 0, 0.12) 45%,
          rgba(0, 0, 0, 0.4) 100%
        );
        z-index: 1;
      }

      /* The slight blur, sitting right above the nav's hairline
         separator so the photo feathers into it instead of cutting
         off sharply. Masked so the blur itself fades in gradually. */
      .dm-header-bg-blur {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 64px;
        -webkit-backdrop-filter: blur(100px);
        backdrop-filter: blur(100px);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 75%);
        mask-image: linear-gradient(to bottom, transparent, black 75%);
        z-index: 1;
      }

      .dm-header-inner {
        position: relative;
        z-index: 2;
        max-width: 640px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .dm-logo {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 0.9rem;
        box-shadow: 0 4px 18px rgba(0,0,0,0.12);
      }

      .dm-header-has-bg .dm-logo {
        box-shadow: 0 4px 18px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.85);
      }

      .dm-logo-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--dm-fg);
        color: var(--dm-bg);
        font-size: 1.6em;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .dm-owner-name {
        font-size: var(--dm-title-size);
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.015em;
        line-height: 1.15;
      }

      .dm-header-has-bg .dm-owner-name {
        color: #fff;
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.45);
      }

      .dm-slogan {
        margin: 0.4rem 0 0;
        font-size: var(--dm-title-size);
        opacity: 0.6;
        font-style: italic;
        letter-spacing: 0.005em;
      }

      .dm-header-has-bg .dm-slogan {
        color: #fff;
        opacity: 0.9;
        text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
      }

      /* Category nav */
      .dm-category-nav {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 30;
        width: 100%;
        max-width: 100%;
        background: var(--dm-bg);
        border-bottom: 1px solid var(--dm-hairline);
        padding: 0.85rem 0;
        backdrop-filter: saturate(160%) blur(6px);
        -webkit-backdrop-filter: saturate(160%) blur(6px);
      }

      .dm-category-scroll {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0 1rem;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .dm-category-scroll::-webkit-scrollbar {
        display: none;
      }

      .dm-category-pill {
        flex: 0 0 auto;
        padding: 0.5rem 1.1rem;
        border-radius: 999px;
        border: 1px solid var(--dm-hairline);
        background: var(--dm-card-bg);
        color: var(--dm-fg);
        font-family: var(--dm-font);
        font-size: 0.85em;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease,
          transform 0.15s ease;
      }

      .dm-category-pill:hover {
        border-color: var(--dm-fg);
      }

      .dm-category-pill:active {
        transform: scale(0.96);
      }

      .dm-category-pill-active {
        background: var(--dm-fg);
        color: var(--dm-bg);
        border-color: var(--dm-fg);
      }

      /* Main / sections */
      .dm-main {
        flex: 1;
        max-width: 760px;
        width: 100%;
        margin: 0 auto;
        padding: 1.75rem 1rem 2rem;
      }

      .dm-category-section {
        scroll-margin-top: 76px;
        margin-bottom: 2.25rem;
      }

      .dm-category-section:last-child {
        margin-bottom: 0.5rem;
      }

      .dm-category-heading {
        font-size: 1.2em;
        font-weight: 700;
        margin: 0 0 1rem 0.15rem;
        letter-spacing: -0.01em;
        position: relative;
        display: inline-flex;
        align-items: center;
      }

      .dm-category-heading::after {
        content: "";
        display: inline-block;
        width: 28px;
        height: 2px;
        margin-left: 0.65rem;
        background: var(--dm-fg);
        opacity: 0.25;
        border-radius: 1px;
      }

      .dm-item-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        width: 100%;
      }

      /* Item card */
      .dm-item-card {
        display: flex;
        gap: 0.9rem;
        background: var(--dm-card-bg);
        border: 1px solid var(--dm-hairline);
        border-radius: 16px;
        padding: 0.8rem;
        width: 100%;
        cursor: pointer;
        transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      }

      .dm-item-card:hover {
        border-color: var(--dm-fg);
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.06);
      }

      .dm-item-card:active {
        transform: scale(0.99);
      }

      .dm-item-card:focus-visible {
        outline: 2px solid var(--dm-fg);
        outline-offset: 2px;
      }

      .dm-item-media {
        flex: 0 0 auto;
      }

      .dm-item-image {
        width: 88px;
        height: 88px;
        border-radius: 12px;
        object-fit: cover;
        display: block;
      }

      .dm-item-image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--dm-accent-soft);
        color: var(--dm-fg);
        opacity: 0.35;
      }

      .dm-item-body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .dm-item-title-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.6rem;
      }

      .dm-item-name {
        margin: 0;
        font-size: 1.02em;
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.005em;
      }

      .dm-item-price {
        flex: 0 0 auto;
        font-weight: 700;
        font-size: 0.96em;
        opacity: 0.85;
        font-variant-numeric: tabular-nums;
      }

      .dm-item-description {
        margin: 0.3rem 0 0;
        font-size: 0.86em;
        opacity: 0.65;
        line-height: 1.45;
        overflow-wrap: break-word;
      }

      .dm-item-allergens {
        margin-top: 0.65rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.4rem;
      }

      .dm-allergen-label {
        font-size: 0.66em;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.4;
        font-weight: 600;
      }

      .dm-allergen-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
      }

      .dm-allergen-tag {
        font-size: 0.72em;
        padding: 0.18rem 0.55rem;
        border-radius: 999px;
        background: var(--dm-accent-soft);
        border: 1px solid var(--dm-hairline);
        opacity: 0.85;
      }

      .dm-allergen-empty {
        font-size: 0.75em;
        opacity: 0.4;
        font-style: italic;
      }

      /* Footer */
      .dm-footer {
        text-align: center;
        padding: 0 1rem 2.25rem;
        opacity: 0.55;
        font-size: 0.78em;
        width: 100%;
      }

      .dm-footer-divider {
        width: 32px;
        height: 1px;
        background: var(--dm-fg);
        opacity: 0.3;
        margin: 0 auto 1.1rem;
      }

      .dm-footer-line {
        margin: 0.2rem 0;
        letter-spacing: 0.01em;
      }

      .dm-footer-phone a {
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid currentColor;
        padding-bottom: 1px;
      }

      /* Item detail panel */
      .dm-panel-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.35);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
        z-index: 40;
      }

      .dm-panel-overlay-open {
        opacity: 1;
        pointer-events: auto;
      }

      .dm-panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 100%;
        background: var(--dm-bg);
        color: var(--dm-fg);
        font-family: var(--dm-font);
        z-index: 41;
        transform: translateX(100%);
        transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        overflow-y: auto;
        box-shadow: -12px 0 32px rgba(0,0,0,0.18);
        display: flex;
        flex-direction: column;
      }

      .dm-panel-open {
        transform: translateX(0);
      }

      .dm-panel-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--dm-hairline);
        background: var(--dm-bg);
        color: var(--dm-fg);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
      }

      .dm-panel-media {
        width: 100%;
        aspect-ratio: 4 / 3;
        flex: 0 0 auto;
      }

      .dm-panel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .dm-panel-image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--dm-accent-soft);
        color: var(--dm-fg);
        opacity: 0.35;
      }

      .dm-panel-content {
        padding: 1.5rem 1.5rem 2.5rem;
      }

      .dm-panel-category {
        font-size: 0.72em;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.45;
        font-weight: 600;
      }

      .dm-panel-title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-top: 0.4rem;
      }

      .dm-panel-name {
        margin: 0;
        font-size: 1.5em;
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: -0.015em;
      }

      .dm-panel-price {
        flex: 0 0 auto;
        font-weight: 700;
        font-size: 1.15em;
        opacity: 0.85;
        font-variant-numeric: tabular-nums;
      }

      .dm-panel-description {
        margin: 0.9rem 0 0;
        font-size: 0.95em;
        line-height: 1.6;
        opacity: 0.7;
      }

      .dm-panel-allergens {
        margin-top: 1.5rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--dm-hairline);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
      }

      /* Larger screens */
      @media (min-width: 640px) {
        .dm-item-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (min-width: 760px) {
        .dm-panel {
          width: 420px;
        }
      }

      @media (min-width: 900px) {
        .dm-header {
          padding-top: 3.5rem;
        }

        .dm-header-has-bg {
          padding-top: 5rem;
        }

        .dm-category-scroll {
          max-width: 760px;
          margin: 0 auto;
          justify-content: center;
          flex-wrap: wrap;
          overflow-x: visible;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dm-panel, .dm-panel-overlay, .dm-item-card {
          transition: none;
        }
      }
    `}</style>
  );
}
