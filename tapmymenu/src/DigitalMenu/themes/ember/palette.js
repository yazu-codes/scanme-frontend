import { isLightColor } from "../../core";
import { bestOn, kitTone, readableTint, rgba, sizeVar, toHsl } from "../shared/menuKit";

// OWNER colours -> Ember variables. Only background_color (bg) and
// font_color (ink); every light effect is the owner's ink at low alpha:
//
//   page            = bg (designed for a dark lounge colour)
//   text            = ink
//   brass hairlines = ink at 35 % / 70 %
//   ember glow      = ink at 26 % (breathing light behind the menu)
//   smoke           = ink at 6 %
//
//   surfaces        = three tones CLOSE TO THE BACKGROUND (same hue, a
//                     touch richer, a few lightness steps away): --em-c3
//                     for bars, --em-c1 for tiles and panels, --em-c2 for
//                     highlights. Used across the whole theme (HUD, tiles,
//                     dish sheet, map, footer), so the page is one family
//                     of colours. A grey background stays grey.
//
// Fallback when the owner set nothing: near-black + warm brass.
export const EMBER_FALLBACK_BG = "#0D0B0A";
export const EMBER_FALLBACK_INK = "#E3B778";

// Tones that stay CLOSE to the owner's background: the same hue, a
// little more saturation (none added to a grey: grey stays grey), and a
// few lightness steps up (dark page) or down (light page). Each is
// walked further only if the owner's text would read worse than 4.5:1.
function bgTints(bg, ink) {
  const dark = !isLightColor(bg);
  const b = toHsl(bg);
  const s = b.s < 0.06 ? b.s : Math.min(0.75, b.s * 1.3 + 0.04);
  const step = (dl) => readableTint({ h: b.h, s, l: Math.min(0.97, Math.max(0.03, b.l + (dark ? dl : -dl))) }, ink, dark);
  return { c1: step(0.045), c2: step(0.085), c3: step(0.02) };
}

export function emberVars(palette, font, fontSize) {
  const { bg, ink } = palette;
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
    "--em-glass": rgba(c1, 0.72),
    "--em-glass-solid": c1,
    "--em-edge": rgba(ink, 0.14),
    "--mk-glass": rgba(c3, 0.9),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Jost', system-ui, sans-serif`,
    "--mk-display": "'Cormorant Garamond', Georgia, serif",
    "--em-sans": "'Jost', system-ui, sans-serif",
  };
}
