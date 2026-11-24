import { useEffect } from "react";
import { isLightColor } from "../../../core";

// Colour helpers for menuKit themes. RULE: every colour a theme shows is
// derived from the owner's background_color (bg) and font_color (ink).
// A theme's own palette is only a fallback for values the owner hasn't
// set. Black and white appear only as mixing targets and as the
// "best text on accent" candidates the guide allows.

// "#abc", "#aabbcc" or "#aabbccdd" (alpha dropped) -> "#AABBCC"; else null.
export function validHex(value) {
  if (typeof value !== "string") return null;
  const m = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return `#${h.slice(0, 6).toUpperCase()}`;
}

export function hexToRgb(hex) {
  const n = parseInt(String(hex).replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgba(hex, a) {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

// Mix two hex colours; returns hex.
export function mix(hex, toward, amount) {
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

// Whichever candidate reads best on `color`.
export function bestOn(color, candidates) {
  let best = candidates[0];
  let bestRatio = 0;
  candidates.forEach((c) => {
    const r = contrastRatio(color, c);
    if (r > bestRatio) {
      best = c;
      bestRatio = r;
    }
  });
  return best;
}

// Push `hex` further from `bg` (darker on a light bg, lighter on a dark
// one): the "stronger shade of ink" the guide allows as an accent.
export function strengthen(hex, bg, amount) {
  return mix(hex, isLightColor(bg) ? "#000000" : "#FFFFFF", amount);
}

// Owner colours (raw config values) with the theme's fallbacks.
export function ownerPalette(rawBg, rawInk, fallbackBg, fallbackInk) {
  const ownerBg = validHex(rawBg);
  const ownerInk = validHex(rawInk);
  const bg = ownerBg || fallbackBg;
  let ink = ownerInk;
  if (!ink) ink = ownerBg ? (isLightColor(bg) ? "#1A1A1A" : "#F2F2F2") : fallbackInk;
  return { bg, ink, ownerBgSet: Boolean(ownerBg), ownerInkSet: Boolean(ownerInk), contrast: contrastRatio(bg, ink) };
}

// Base --mk-* variables used by the shared kit components (pinned bar,
// dish sheet, drawer, buttons), for one page colour + text colour.
export function kitTone(bg, ink, accent) {
  const toward = isLightColor(bg) ? "#000000" : "#FFFFFF";
  const acc = accent || ink;
  return {
    "--mk-bg": bg,
    "--mk-ink": ink,
    "--mk-surface": mix(bg, toward, 0.06),
    "--mk-surface-2": mix(bg, toward, 0.12),
    "--mk-line": rgba(ink, 0.18),
    "--mk-line-strong": rgba(ink, 0.5),
    "--mk-muted": rgba(ink, 0.78),
    "--mk-faint": rgba(ink, 0.55),
    "--mk-accent": acc,
    "--mk-on-accent": bestOn(acc, [bg, "#000000", "#FFFFFF"]),
    "--mk-glass": rgba(bg, 0.94),
    "--mk-shadow": rgba(mix(bg, "#000000", 0.7), 0.28),
    "--mk-scrim": rgba(mix(bg, "#000000", 0.75), 0.62),
  };
}

// menu_configuration.font_size (number or string) -> "16px".
export function sizeVar(fontSize) {
  const size = Number.parseFloat(fontSize);
  return `${Number.isFinite(size) && size > 0 ? size : 16}px`;
}

// The guide wants odd owner palettes raised with a person, never
// silently "fixed". A theme can't ask at runtime, so it keeps the owner
// colours as they are and reports the problem in the console.
export function useContrastReport(themeName, rawBg, rawInk, palette) {
  const { bg, ink, contrast } = palette;
  useEffect(() => {
    if (rawBg && !validHex(rawBg)) {
      console.warn(`${themeName}: background_color "${rawBg}" is not a hex colour; using the theme fallback.`);
    }
    if (rawInk && !validHex(rawInk)) {
      console.warn(`${themeName}: font_color "${rawInk}" is not a hex colour; using a fallback.`);
    }
    if (contrast < 3) {
      console.warn(
        `${themeName}: text ${ink} on ${bg} has a contrast of ${contrast.toFixed(2)}:1, ` +
          "too low to read. Change the colours in the dashboard."
      );
    } else if (contrast < 4.5) {
      console.info(
        `${themeName}: text ${ink} on ${bg} has a contrast of ${contrast.toFixed(2)}:1, ` +
          "fine for headings but weak for body text."
      );
    }
  }, [themeName, rawBg, rawInk, bg, ink, contrast]);
}

// --- HSL helpers ----------------------------------------------------------

export function toHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === R) h = (G - B) / d + (G < B ? 6 : 0);
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

export function fromHsl({ h, s, l }) {
  const hh = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb;
  if (hh < 60) rgb = [c, x, 0];
  else if (hh < 120) rgb = [x, c, 0];
  else if (hh < 180) rgb = [0, c, x];
  else if (hh < 240) rgb = [0, x, c];
  else if (hh < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return `#${rgb.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

// A colour at the given hue/saturation/lightness, walked darker (dark
// pages) or lighter (light pages) until `text` reads at least minRatio
// on it.
export function readableTint({ h, s, l }, text, darkPage, minRatio = 4.5) {
  let light = l;
  let color = fromHsl({ h, s, l: light });
  for (let i = 0; i < 20 && contrastRatio(color, text) < minRatio; i += 1) {
    light = Math.min(0.97, Math.max(0.03, light + (darkPage ? -0.02 : 0.02)));
    color = fromHsl({ h, s, l: light });
  }
  return color;
}
