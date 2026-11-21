import { bestOn, contrastRatio, kitTone, mix, rgba, sizeVar, strengthen } from "../shared/menuKit";

// OWNER colours -> Stitch variables. The reference stitches its frames
// in red, green and blue thread; per the owner-colour rule these become
// three SHADES of the owner's font_color (ink) on their background_color
// (bg):
//
//   thread 1 = ink
//   thread 2 = ink pushed further from bg (deeper)
//   thread 3 = ink softened toward bg
//
// A shade that would read worse than 3:1 on bg falls back to ink, so a
// thread colour is never too faint for the headings stitched in it.
//
// Fallback when the owner set nothing: linen + madder red.
export const STITCH_FALLBACK_BG = "#F3EBDD";
export const STITCH_FALLBACK_INK = "#A33A3A";

function readable(color, bg, fallback) {
  return contrastRatio(color, bg) >= 3 ? color : fallback;
}

export function stitchVars(palette, font, fontSize) {
  const { bg, ink } = palette;
  const t1 = ink;
  const t2 = readable(strengthen(ink, bg, 0.4), bg, ink);
  const t3 = readable(mix(ink, bg, 0.3), bg, ink);
  return {
    ...kitTone(bg, ink, ink),
    "--st-bg": bg,
    "--st-ink": ink,
    "--st-t1": t1,
    "--st-t2": t2,
    "--st-t3": t3,
    "--st-on-t1": bestOn(t1, [bg, "#000000", "#FFFFFF"]),
    "--st-hole": rgba(ink, 0.22),
    "--st-weave": rgba(ink, 0.045),
    "--mk-fs": sizeVar(fontSize),
    "--mk-body": `'${font}', 'Lora', Georgia, serif`,
    "--mk-display": "'Tiny5', 'Courier New', monospace",
  };
}
