import { useMemo } from "react";
import useBodyBackgroundSync from "../hooks/useBodyBackgroundSync";
import useGoogleFont from "../hooks/useGoogleFont";
import { ownerPalette, useContrastReport } from "./colors";

// The colour/font setup every menuKit theme repeats: the OWNER font
// (whitelist-checked, Roboto fallback), the OWNER colours with the
// theme's fallbacks, the contrast report, the theme's CSS variables and
// the page background behind the theme root.
//
// makeVars(palette, font, fontSize) must be a module-level function.
export default function useOwnerTheme(config, { name, fallbackBg, fallbackInk, makeVars, pageBg }) {
  const { background_color: rawBg, font_color: rawInk, font_size: fontSize } = config;
  const font = useGoogleFont(config.font_family);
  const palette = useMemo(
    () => ownerPalette(rawBg, rawInk, fallbackBg, fallbackInk),
    [rawBg, rawInk, fallbackBg, fallbackInk]
  );
  useContrastReport(name, rawBg, rawInk, palette);
  const vars = useMemo(() => makeVars(palette, font, fontSize), [makeVars, palette, font, fontSize]);
  useBodyBackgroundSync(pageBg ? vars[pageBg] : palette.bg);
  return { palette, vars, accent: palette.ink };
}
