import { useEffect, useMemo } from "react";
import { FALLBACK_FONT, GOOGLE_FONT_WHITELIST } from "../../../core/constants";
import { loadGoogleFont } from "../../../core/domHelpers";

// Resolves a requested font family against the core whitelist (falling
// back to FALLBACK_FONT), and loads it from Google Fonts. Returns the
// resolved font family name for use in CSS.
//
// Which font a theme *asks for* is a styling decision (a theme might
// ignore the menu's configured font entirely and always request its own
// brand font) — but the mechanics of validating/loading it safely are
// shared so every theme does it the same, safe way.
export default function useGoogleFont(requestedFont) {
  const resolvedFont = useMemo(() => {
    const requested = (requestedFont || "").trim();
    if (requested && GOOGLE_FONT_WHITELIST.has(requested)) return requested;
    return FALLBACK_FONT;
  }, [requestedFont]);

  useEffect(() => {
    loadGoogleFont(resolvedFont);
  }, [resolvedFont]);

  return resolvedFont;
}
