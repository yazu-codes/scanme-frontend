import { useMemo } from "react";
import { isLightColor } from "../../core";

// Classic honors the menu's own configured colors/font — this is the
// piece a new theme would rewrite to express its own design language
// (e.g. a theme could ignore config entirely and hardcode a palette).
export default function useThemeVars({ backgroundColor, fontColor, fontSize, resolvedFont }) {
  return useMemo(() => {
    const light = isLightColor(backgroundColor);
    return {
      "--dm-bg": backgroundColor,
      "--dm-fg": fontColor,
      "--dm-font": `'${resolvedFont}', sans-serif`,
      "--dm-font-size": `${fontSize || 16}px`,
      "--dm-accent-soft": light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)",
      "--dm-hairline": light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)",
      "--dm-card-bg": light ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.06)",
      "--dm-title-size": `calc(var(--dm-font-size) * 1.2)`,
    };
  }, [backgroundColor, fontColor, fontSize, resolvedFont]);
}
