// ---------------------------------------------------------------------
// NON-NEGOTIABLE: configuration values the data layer depends on.
// Nothing here is about how a menu *looks* — only what data it can
// fetch and which fonts it's technically able to load.
// ---------------------------------------------------------------------

export const API_BASE = process.env.REACT_APP_API_BASE;
export const FALLBACK_FONT = "Roboto";

// A small, safe allow-list of fonts we know how to load from Google
// Fonts on demand. Anything outside this list falls back to Roboto.
// A theme is free to request any of these; themes never introduce new
// fonts here directly (that would make font-loading a per-theme concern).
export const GOOGLE_FONT_WHITELIST = new Set([
  "Inter",
  "Roboto",
  "Poppins",
  "Lato",
  "Montserrat",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Work Sans",
  "Rubik",
  "DM Sans",
  "Fraunces",
]);
