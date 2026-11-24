import { isLightColor } from "../../core";
import { bestOn, kitTone, mix, rgba, sizeVar } from "../shared/menuKit";

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
// Fallback when the owner set nothing: near-black + warm brass.
export const EMBER_FALLBACK_BG = "#0D0B0A";
export const EMBER_FALLBACK_INK = "#E3B778";

export function emberVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  const lift = mix(bg, isLightColor(bg) ? "#000000" : "#FFFFFF", 0.08);
  return {
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
