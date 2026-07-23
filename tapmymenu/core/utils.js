// ---------------------------------------------------------------------
// NON-NEGOTIABLE: pure data-shaping helpers. No JSX, no CSS, no DOM.
// Every theme calls into these instead of re-implementing parsing.
// ---------------------------------------------------------------------

export function slugifyCategory(category) {
  return "cat-" + category.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

export function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return n.toFixed(2).replace(/\.00$/, "");
}

// Allergens may come in as a proper array, or as a single string using
// ';' as a separator (e.g. "gluten; dairy; nuts"). Normalize either shape
// into a clean array of trimmed, non-empty strings.
export function parseAllergens(allergens) {
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

// Rough luminance check so a theme can pick a sensible contrasting tint
// for "on background" elements without extra config. This is a plain
// math utility — it doesn't decide *what* to do with the answer, that's
// up to each theme.
export function isLightColor(hex) {
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
