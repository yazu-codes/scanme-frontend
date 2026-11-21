import { bestOn, contrastRatio, kitTone, mix, rgba, sizeVar, strengthen } from "../shared/menuKit";

// OWNER colours -> Flame variables. Only background_color (bg) and
// font_color (ink):
//
//   page            = bg, with a fire glow: bg mixed toward ink in the
//                     middle and pushed darker at the edges
//   accent          = ink (brush banners, prices, the big MENU word)
//   text            = ink pushed further from bg, when that reads better
//                     (the reference's white names on red)
//   embers          = ink at low alpha
//
// Fallback when the owner set nothing: deep fire red + amber.
export const FLAME_FALLBACK_BG = "#7E0F12";
export const FLAME_FALLBACK_INK = "#FFB627";

export function flameVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  const strong = strengthen(ink, bg, 0.6);
  const text = contrastRatio(strong, bg) > contrastRatio(ink, bg) ? strong : ink;
  return {
    ...kitTone(bg, text, ink),
    "--fl-bg": bg,
    "--fl-text": text,
    "--fl-accent": ink,
    "--fl-on-accent": bestOn(ink, [bg, "#000000", "#FFFFFF"]),
    "--fl-glow": mix(bg, ink, 0.28),
    "--fl-deep": strengthen(bg, ink, 0.45),
    "--fl-ember": rgba(ink, 0.55),
    "--fl-ember-soft": rgba(ink, 0.18),
    "--fl-halo": rgba(ink, 0.35),
    "--fl-dots": rgba(text, 0.45),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Rubik', system-ui, sans-serif`,
    "--mk-display": "'Oswald', 'Arial Narrow', sans-serif",
    "--fl-heavy": "'Rubik', 'Arial Black', sans-serif",
  };
}
