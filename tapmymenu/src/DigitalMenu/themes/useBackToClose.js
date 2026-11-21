import { useEffect, useMemo } from "react";
import { isLightColor } from "../../core";

// OWNER colours -> CSS variables.
//
// Lantern is a two-colour "poster" theme. Everything is built from the
// owner's background_color (bg) and font_color (ink):
//
//   tone A  page colour = bg,  text = ink   (header, odd sections, modal)
//   tone B  page colour = ink, text = bg    (even sections, drawer)
//
// Tone B is the owner palette inverted, which gives the reference
// design's alternating red / yellow bands without introducing a single
// colour the owner didn't set. Because it's the same two colours swapped,
// both tones have exactly the same contrast ratio.
//
// The fixed palette below is only a FALLBACK for values the owner hasn't
// set (deep lantern red + warm gold, about 5:1 contrast).

export const LANTERN_FALLBACK_BG = "#A8161B";
export const LANTERN_FALLBACK_INK = "#FFC93C";

// "#abc", "#aabbcc" or "#aabbccdd" (alpha dropped) -> "#AABBCC"; else null.
export function validHex(value) {
  if (typeof value !== "string") return null;
  const m = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return `#${h.slice(0, 6).toUpperCase()}`;
}

function hexToRgb(hex) {
  const clean = String(hex).replace("#", "");
  const n = parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba(hex, a) {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

function mix(hex, toward, amount) {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  const m = (x, y) => Math.round(x + (y - x) * amount).toString(16).padStart(2, "0");
  return `#${m(a.r, b.r)}${m(a.g, b.g)}${m(a.b, b.b)}`.toUpperCase();
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const ch = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

// WCAG 2 contrast ratio, 1..21.
export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Derived colours for one tone. Black and white appear only as mixing
// targets, never as colours of their own.
function tone(prefix, bg, ink) {
  const light = isLightColor(bg);
  const toward = light ? "#000000" : "#FFFFFF";
  return {
    [`--ln-${prefix}-bg`]: bg,
    [`--ln-${prefix}-ink`]: ink,
    [`--ln-${prefix}-surface`]: mix(bg, toward, 0.06),
    [`--ln-${prefix}-surface-2`]: mix(bg, toward, 0.12),
    [`--ln-${prefix}-line`]: rgba(ink, 0.18),
    [`--ln-${prefix}-line-strong`]: rgba(ink, 0.55),
    [`--ln-${prefix}-muted`]: rgba(ink, 0.78),
    [`--ln-${prefix}-faint`]: rgba(ink, 0.55),
    [`--ln-${prefix}-glass`]: rgba(bg, 0.94),
    [`--ln-${prefix}-shadow`]: rgba(mix(bg, "#000000", 0.7), 0.28),
    [`--ln-${prefix}-scrim`]: rgba(mix(bg, "#000000", 0.75), 0.62),
  };
}

export default function useThemeVars({ config, font }) {
  const rawBg = config.background_color;
  const rawInk = config.font_color;

  const result = useMemo(() => {
    const ownerBg = validHex(rawBg);
    const ownerInk = validHex(rawInk);
    const bg = ownerBg || LANTERN_FALLBACK_BG;
    let ink = ownerInk;
    if (!ink) {
      // Owner set a background but no text colour: pick a neutral that
      // reads on it. Neither set: the full fallback palette.
      ink = ownerBg ? (isLightColor(bg) ? "#1A1A1A" : "#F2F2F2") : LANTERN_FALLBACK_INK;
    }
    const size = Number.parseFloat(config.font_size);
    const body = `'${font}', 'Rubik', system-ui, sans-serif`;

    const vars = {
      ...tone("a", bg, ink),
      ...tone("b", ink, bg),
      "--ln-fs": `${Number.isFinite(size) && size > 0 ? size : 16}px`,
      "--ln-body": body,
      "--ln-display": "'Oswald', 'Arial Narrow', sans-serif",
      "--ln-hero": "'Rubik', 'Arial Black', sans-serif",
    };

    return {
      vars,
      accent: ink,
      bg,
      ink,
      contrast: contrastRatio(bg, ink),
      ownerBgSet: Boolean(ownerBg),
      ownerInkSet: Boolean(ownerInk),
    };
  }, [rawBg, rawInk, config.font_size, font]);

  // The guide wants odd owner palettes raised with a person, never
  // silently "fixed". The theme can't ask at runtime, so it leaves the
  // owner colours exactly as set and reports the problem in the console.
  useEffect(() => {
    if (rawBg && !validHex(rawBg)) {
      console.warn(`Lantern: background_color "${rawBg}" is not a hex colour; using the theme fallback.`);
    }
    if (rawInk && !validHex(rawInk)) {
      console.warn(`Lantern: font_color "${rawInk}" is not a hex colour; using a fallback.`);
    }
    const ratio = result.contrast;
    if (ratio < 3) {
      console.warn(
        `Lantern: text ${result.ink} on ${result.bg} has a contrast of ${ratio.toFixed(2)}:1, ` +
          "too low to read. Change the colours in the dashboard."
      );
    } else if (ratio < 4.5) {
      console.info(
        `Lantern: text ${result.ink} on ${result.bg} has a contrast of ${ratio.toFixed(2)}:1, ` +
          "fine for headings but weak for body text."
      );
    }
  }, [rawBg, rawInk, result]);

  return result;
}
