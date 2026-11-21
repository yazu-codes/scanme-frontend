import { isLightColor } from "../../core";
import { bestOn, contrastRatio, hexToRgb, kitTone, mix, rgba, sizeVar, strengthen } from "../shared/menuKit";

// OWNER colours -> Crave variables.
//
// Crave is a "dopamine" theme and needs more than two colours. Approved
// rule: the extra colours are DERIVED from the owner's font_color (ink)
// by rotating its hue, so they always belong to the owner's palette:
//
//   pop1 = ink                 (stickers, prices, rings)
//   pop2 = ink rotated  +55°   (highlighter, second sticker colour)
//   pop3 = ink rotated +180°   (complement: hearts, confetti)
//   pop4 = ink rotated  -60°   (third sticker colour)
//
// Each derived colour is nudged lighter/darker until it reads at least
// 3:1 on the owner's background_color (bg). If the owner's ink is a
// neutral (grey/black/white, saturation < 15 %) there is no hue to
// rotate, so the pops become tints of ink instead: a neutral brand stays
// neutral.
//
// Fallback when the owner set nothing: hot pink on cream.
export const CRAVE_FALLBACK_BG = "#FFF4E6";
export const CRAVE_FALLBACK_INK = "#E0115F";

function toHsl(hex) {
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

function fromHsl({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  const hex = rgb.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
  return `#${hex}`.toUpperCase();
}

// Rotate hue, then walk lightness away from bg until it reads >= 3:1.
function derive(ink, bg, degrees) {
  const hsl = toHsl(ink);
  let color = fromHsl({ ...hsl, h: (hsl.h + degrees + 360) % 360 });
  const step = isLightColor(bg) ? -0.04 : 0.04;
  let l = toHsl(color).l;
  for (let i = 0; i < 14 && contrastRatio(color, bg) < 3; i += 1) {
    l = Math.min(0.95, Math.max(0.05, l + step));
    color = fromHsl({ ...toHsl(color), l });
  }
  return contrastRatio(color, bg) >= 3 ? color : ink;
}

export function popColors(bg, ink) {
  if (toHsl(ink).s < 0.15) {
    return [ink, strengthen(ink, bg, 0.35), mix(ink, bg, 0.25), strengthen(ink, bg, 0.6)];
  }
  return [ink, derive(ink, bg, 55), derive(ink, bg, 180), derive(ink, bg, -60)];
}

export function craveVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  const pops = popColors(bg, ink);
  const vars = {
    ...kitTone(bg, ink, ink),
    "--cv-bg": bg,
    "--cv-ink": ink,
    "--cv-card": mix(bg, isLightColor(bg) ? "#FFFFFF" : "#000000", 0.4),
    "--cv-blob-a": rgba(pops[1], 0.22),
    "--cv-blob-b": rgba(pops[2], 0.18),
    "--cv-line": rgba(ink, 0.16),
    "--cv-shadow": rgba(mix(bg, "#000000", 0.75), 0.3),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Unbounded', system-ui, sans-serif`,
    "--mk-display": "'Unbounded', 'Arial Black', system-ui, sans-serif",
  };
  pops.forEach((c, i) => {
    vars[`--cv-pop${i + 1}`] = c;
    vars[`--cv-on-pop${i + 1}`] = bestOn(c, [bg, "#000000", "#FFFFFF"]);
  });
  return vars;
}
