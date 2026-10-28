import { useMemo } from "react";
import { isLightColor } from "../../core";

// Noir is a fixed-palette theme (like Minimal): near-black surfaces,
// champagne-gold accents, a high-contrast serif for display and a
// geometric sans for body copy. That's the whole look, so by default it
// ignores the owner's background_color / font_color / font_family.
// font_size is still honoured (it scales every em-based size).
//
// Flip USE_OWNER_PALETTE to true to let menu_configuration drive it
// instead: background_color becomes the page colour, font_color the
// gold accent, and font_family the body font.
export const USE_OWNER_PALETTE = false;

export const NOIR_ACCENT = "#C9A96E";

function hexToRgb(hex) {
  if (typeof hex !== "string") return null;
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return null;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba(hex, a) {
  const c = hexToRgb(hex);
  return c ? `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` : hex;
}

function mix(hex, toward, amount) {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  if (!a || !b) return hex;
  const m = (x, y) => Math.round(x + (y - x) * amount);
  return `rgb(${m(a.r, b.r)}, ${m(a.g, b.g)}, ${m(a.b, b.b)})`;
}

export default function useThemeVars({ config, resolvedFont }) {
  return useMemo(() => {
    const owner = USE_OWNER_PALETTE;
    const bg = owner && config.background_color ? config.background_color : "#0A0A0A";
    const gold = owner && config.font_color ? config.font_color : NOIR_ACCENT;
    const light = isLightColor(bg);
    const text = light ? "#16130F" : "#F3EFE7";
    const sans = owner && resolvedFont ? `'${resolvedFont}', 'Jost', sans-serif` : "'Jost', 'Helvetica Neue', Arial, sans-serif";

    return {
      "--nr-bg": bg,
      "--nr-bg-glass": rgba(bg.startsWith("#") ? bg : "#0A0A0A", 0.92),
      "--nr-surface": light ? mix(bg, "#000000", 0.04) : mix(bg, "#FFFFFF", 0.025),
      "--nr-surface-2": light ? mix(bg, "#000000", 0.07) : mix(bg, "#FFFFFF", 0.05),
      "--nr-line": light ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.075)",
      "--nr-line-strong": light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)",
      "--nr-text": text,
      "--nr-muted": rgba(light ? "#16130F" : "#F3EFE7", 0.58),
      "--nr-faint": rgba(light ? "#16130F" : "#F3EFE7", 0.36),
      "--nr-gold": gold,
      "--nr-gold-bright": owner ? gold : "#E2C48E",
      "--nr-gold-tile": owner ? rgba(gold, 0.85) : "#E4CFA4",
      "--nr-on-gold": "#14110D",
      "--nr-serif": "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif",
      "--nr-sans": sans,
      "--nr-font-size": `${Number(config.font_size) || 16}px`,
    };
  }, [config.background_color, config.font_color, config.font_size, resolvedFont]);
}
