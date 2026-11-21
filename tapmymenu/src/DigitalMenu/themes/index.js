import ClassicTheme from "./classic/Theme";
import MinimalTheme from "./minimal/Theme";
import LuxuryTheme from "./luxury/Theme";
import ModernTheme from "./modern/Theme";
import NoirTheme from "./noir/Theme";
import LanternTheme from "./lantern/Theme";
import DinerTheme from "./diner/Theme";
import LadleTheme from "./ladle/Theme";
import StitchTheme from "./stitch/Theme";
import TrattoriaTheme from "./trattoria/Theme";
import FlameTheme from "./flame/Theme";
import CraveTheme from "./crave/Theme";

// To add a new style: create themes/<name>/Theme.jsx (+ its own
// components/ and theme.css, following classic/ or minimal/ as a
// template), then register it here. Nothing outside this folder needs
// to change — every theme gets the same data shape from
// core/useDigitalMenu.
const themes = {
  classic: ClassicTheme,
  minimal: MinimalTheme,
  luxury: LuxuryTheme,
  modern: ModernTheme,
  noir: NoirTheme,
  lantern: LanternTheme,
  diner: DinerTheme,
  ladle: LadleTheme,
  stitch: StitchTheme,
  trattoria: TrattoriaTheme,
  flame: FlameTheme,
  crave: CraveTheme,
};

export default themes;
