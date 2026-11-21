import { bestOn, kitTone, mix, rgba, sizeVar } from "../shared/menuKit";

// OWNER colours -> Ladle variables. Only background_color (bg) and
// font_color (ink) are used:
//
//   page                    = bg (the reference's dark slate)
//   text, doodles, rules    = ink
//   accent (icon circles,
//   stickers, hours badge)  = ink. The reference uses orange and red
//                             here; per the owner-colour rule those
//                             become the owner's own text colour, with
//                             bg-coloured glyphs on top.
//   chalk lines             = ink at low alpha
//
// Fallback when the owner set nothing: slate + warm cream.
export const LADLE_FALLBACK_BG = "#46505F";
export const LADLE_FALLBACK_INK = "#F7E8CC";

export function ladleVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  return {
    ...kitTone(bg, ink, ink),
    "--tl-bg": bg,
    "--tl-ink": ink,
    "--tl-accent": ink,
    "--tl-on-accent": bestOn(ink, [bg, "#000000", "#FFFFFF"]),
    "--tl-chalk": rgba(ink, 0.32),
    "--tl-dust": rgba(ink, 0.07),
    "--tl-card": mix(bg, ink, 0.06),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Balsamiq Sans', system-ui, sans-serif`,
    "--mk-display": "'Balsamiq Sans', 'Comic Sans MS', system-ui, sans-serif",
    "--tl-script": "'Caveat', 'Segoe Print', cursive",
  };
}
