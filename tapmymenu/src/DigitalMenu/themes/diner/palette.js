import { isLightColor } from "../../core";
import { bestOn, contrastRatio, kitTone, mix, rgba, sizeVar, strengthen } from "../shared/menuKit";

// OWNER colours -> Diner variables. Only the owner's background_color
// (bg) and font_color (ink) are used; everything else is derived:
//
//   accent (sign, section titles, icon circles, footer strip) = ink
//   text   (dish names, prices)       = ink pushed further from bg, the
//                                        reference's dark text + pink
//                                        accent split from ONE colour
//   check  (the checkerboard squares) = the same strong ink
//   panel  (the rounded menu card)    = bg nudged a little toward white
//                                        (light bg) or black (dark bg)
//
// Fallback when the owner set nothing: diner cream + cherry pink.
export const DINER_FALLBACK_BG = "#F4EFE0";
export const DINER_FALLBACK_INK = "#C2314B";

export function dinerVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  // Stronger text only when it actually reads better than ink itself.
  const strong = strengthen(ink, bg, 0.55);
  const text = contrastRatio(strong, bg) > contrastRatio(ink, bg) ? strong : ink;
  const panel = mix(bg, isLightColor(bg) ? "#FFFFFF" : "#000000", 0.35);
  return {
    ...kitTone(panel, text, ink),
    "--dn-bg": bg,
    "--dn-panel": panel,
    "--dn-text": text,
    "--dn-accent": ink,
    "--dn-on-accent": bestOn(ink, [panel, "#000000", "#FFFFFF"]),
    "--dn-check": text,
    "--dn-rim": mix(panel, text, 0.35),
    "--dn-dash": rgba(text, 0.45),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Rubik', system-ui, sans-serif`,
    "--mk-display": "'Oswald', 'Arial Narrow', sans-serif",
    "--dn-script": "'Lobster', 'Georgia', cursive",
  };
}
