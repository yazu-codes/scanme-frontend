import { useMemo } from "react";
import { isLightColor } from "../../core";

// Fixed brand signature for the Luxury theme — an antique-gold trio.
// Unlike the base color/font, these are NOT sourced from config: they're
// what makes this theme "Luxury" regardless of which palette an owner
// has picked for their menu, the same way Classic's rounded cards and
// pill nav are fixed regardless of config.
const GOLD = "#C9A24C";
const GOLD_BRIGHT = "#E8D9A0";
const GOLD_DEEP = "#8C6D2F";

function hexToRgb(hex) {
  if (typeof hex !== "string") return null;
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  if (full.length !== 6) return null;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function withAlpha(color, alpha) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// Luxury honors the menu's own configured background/font colors and
// typography exactly as Classic does — an owner's brand palette still
// comes through — but expresses its own design language on top via a
// fixed gold accent, a serif display face, and richer shadow/hairline
// treatment tuned separately for light vs. dark configured backgrounds.
export default function useThemeVars({ backgroundColor, fontColor, fontSize, resolvedFont }) {
  return useMemo(() => {
    const light = isLightColor(backgroundColor);
    return {
      "--dml-bg": backgroundColor,
      "--dml-bg-translucent": withAlpha(backgroundColor, 0.86),
      "--dml-fg": fontColor,
      "--dml-font": `'${resolvedFont}', sans-serif`,
      // The owner's configured font now wins for display/accent roles too —
      // Playfair/Cormorant are fallbacks for when no custom font is set,
      // not a silent override of the owner's choice.
      "--dml-display-font": resolvedFont
        ? `'${resolvedFont}', 'Playfair Display', serif`
        : "'Playfair Display', serif",
      "--dml-accent-font": resolvedFont
        ? `'${resolvedFont}', 'Cormorant Garamond', serif`
        : "'Cormorant Garamond', serif",
      "--dml-font-size": `${fontSize || 16}px`,
      "--dml-title-size": `calc(var(--dml-font-size) * 1.35)`,
      "--dml-gold": GOLD,
      "--dml-gold-bright": GOLD_BRIGHT,
      "--dml-gold-deep": GOLD_DEEP,
      "--dml-accent-soft": light ? "rgba(140, 109, 47, 0.08)" : "rgba(232, 217, 160, 0.07)",
      "--dml-hairline": light ? "rgba(30, 24, 10, 0.14)" : "rgba(232, 217, 160, 0.16)",
      "--dml-card-bg": light ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.035)",
      "--dml-texture-opacity": light ? "0.035" : "0.055",
    };
  }, [backgroundColor, fontColor, fontSize, resolvedFont]);
}
