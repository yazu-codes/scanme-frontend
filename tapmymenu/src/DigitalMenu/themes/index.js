import ClassicTheme from "./classic/Theme";
import MinimalTheme from "./minimal/Theme";
import LuxuryTheme from "./luxury/Theme";

// To add a new style: create themes/<name>/Theme.jsx (+ its own
// components/ and theme.css, following classic/ or minimal/ as a
// template), then register it here. Nothing outside this folder needs
// to change — every theme gets the same data shape from
// core/useDigitalMenu.
const themes = {
  classic: ClassicTheme,
  minimal: MinimalTheme,
  luxury: LuxuryTheme,
};

export default themes;
