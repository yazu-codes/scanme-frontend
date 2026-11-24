import { isLightColor } from "../../core";
import { bestOn, kitTone, mix, readableTint, rgba, sizeVar, toHsl } from "../shared/menuKit";

// OWNER colours -> Ember variables. Only background_color (bg) and
// font_color (ink); every light effect is the owner's ink at low alpha:
//
//   page            = bg (designed for a dark lounge colour)
//   text            = ink
//   brass hairlines = ink at 35 % / 70 %
//   ember glow      = ink at 26 % (breathing light behind the menu)
//   smoke           = ink at 6 %
//   smoked glass    = bg lifted 8 % toward white (dark bg) / black
//                     (light bg), at 55 % opacity + backdrop blur
//
//   colour tints    = three richer tones DERIVED FROM THE BACKGROUND's hue
//                     (hue, hue +35°, hue −35°; saturation raised), used
//                     to colour the dish sheet. Each is walked darker
//                     (dark page) / lighter (light page) until the owner's
//                     text reads at least 4.5:1 on it. A near-grey
//                     background has no real hue, so its tints take the
//                     text colour's hue instead.
//
// Fallback when the owner set nothing: near-black + warm brass.
export const EMBER_FALLBACK_BG = "#0D0B0A";
export const EMBER_FALLBACK_INK = "#E3B778";

function bgTints(bg, ink) {
  const dark = !isLightColor(bg);
  const b = toHsl(bg);
  const hue = b.s < 0.08 ? toHsl(ink).h : b.h;
  const s = Math.max(0.42, Math.min(0.72, b.s + 0.3));
  const t = (dh, darkL, lightL) => readableTint({ h: hue + dh, s, l: dark ? darkL : lightL }, ink, dark);
  return { c1: t(0, 0.2, 0.86), c2: t(35, 0.23, 0.83), c3: t(-35, 0.17, 0.89) };
}

export function emberVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  const lift = mix(bg, isLightColor(bg) ? "#000000" : "#FFFFFF", 0.08);
  const { c1, c2, c3 } = bgTints(bg, ink);
  return {
    "--em-c1": c1,
    "--em-c2": c2,
    "--em-c3": c3,
    "--em-c1-soft": rgba(c1, 0.7),
    "--em-c2-soft": rgba(c2, 0.55),
    "--em-c3-soft": rgba(c3, 0.6),
    ...kitTone(bg, ink, ink),
    "--em-bg": bg,
    "--em-ink": ink,
    "--em-on-ink": bestOn(ink, [bg, "#000000", "#FFFFFF"]),
    "--em-brass": rgba(ink, 0.35),
    "--em-brass-strong": rgba(ink, 0.7),
    "--em-glow": rgba(ink, 0.26),
    "--em-glow-soft": rgba(ink, 0.1),
    "--em-smoke": rgba(ink, 0.06),
    "--em-glass": rgba(lift, 0.55),
    "--em-glass-solid": lift,
    "--em-edge": rgba(ink, 0.14),
    "--mk-glass": rgba(bg, 0.82),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Jost', system-ui, sans-serif`,
    "--mk-display": "'Cormorant Garamond', Georgia, serif",
    "--em-sans": "'Jost', system-ui, sans-serif",
  };
}
