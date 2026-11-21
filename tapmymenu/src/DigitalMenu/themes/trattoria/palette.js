import { isLightColor } from "../../core";
import { bestOn, kitTone, mix, rgba, sizeVar } from "../shared/menuKit";

// OWNER colours -> Trattoria variables. Only background_color (bg) and
// font_color (ink):
//
//   paper            = bg, with a soft vignette toward ink at the edges
//   text, rules      = ink
//   wooden sign      = ink, lettered in bg (the reference's brown board)
//   seal icons       = ink
//
// Fallback when the owner set nothing: warm paper + walnut brown.
export const TRATTORIA_FALLBACK_BG = "#F6EFE2";
export const TRATTORIA_FALLBACK_INK = "#4A2E2A";

export function trattoriaVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  const card = mix(bg, isLightColor(bg) ? "#FFFFFF" : "#000000", 0.25);
  return {
    ...kitTone(card, ink, ink),
    "--tr-bg": bg,
    "--tr-card": card,
    "--tr-ink": ink,
    "--tr-board": ink,
    "--tr-on-board": bestOn(ink, [bg, "#000000", "#FFFFFF"]),
    "--tr-vignette": mix(bg, ink, 0.1),
    "--tr-rule": rgba(ink, 0.45),
    "--tr-grain": rgba(ink, 0.05),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Lora', Georgia, serif`,
    "--mk-display": "'Playfair Display', Georgia, serif",
    "--tr-text": "'Lora', Georgia, serif",
  };
}
