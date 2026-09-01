import { useMemo } from "react";
import { isLightColor } from "../../core";

function hexToRgb(hex) {
  if (typeof hex !== "string") return null;

  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;

  if (full.length !== 6) return null;

  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function withAlpha(color, alpha) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// Modern now uses the owner's configured JSON palette exclusively:
// background_color controls surfaces and font_color also acts as the
// accent/highlight color. This removes the old hardcoded green palette.
export default function useThemeVars({
  backgroundColor,
  fontColor,
  fontSize,
  resolvedFont,
}) {
  return useMemo(() => {
    const lightBackground = isLightColor(backgroundColor);

    return {
      "--dml-bg": backgroundColor,
      "--dml-bg-translucent": withAlpha(backgroundColor, 0.88),
      "--dml-fg": fontColor,
      "--dml-font": resolvedFont
        ? `'${resolvedFont}', 'Inter', sans-serif`
        : "'Inter', sans-serif",
      "--dml-display-font": resolvedFont
        ? `'${resolvedFont}', 'Space Grotesk', sans-serif`
        : "'Space Grotesk', sans-serif",
      "--dml-font-size": `${fontSize || 16}px`,
      "--dml-title-size": `calc(var(--dml-font-size) * 1.3)`,

      // Accent/highlight comes directly from menu_configuration.font_color.
      "--dml-signature": fontColor,
      "--dml-signature-bright": fontColor,
      "--dml-signature-deep": fontColor,
      "--dml-signature-soft": withAlpha(
        fontColor,
        lightBackground ? 0.08 : 0.14
      ),

      // Whenever the accent itself is used as a filled background,
      // the configured background color becomes the foreground so the
      // owner's two-color JSON palette stays consistent and readable.
      "--dml-signature-contrast": backgroundColor,

      "--dml-hairline": lightBackground
        ? "rgba(20, 20, 18, 0.12)"
        : "rgba(255, 255, 255, 0.14)",
      "--dml-card-bg": lightBackground
        ? "rgba(255, 255, 255, 0.7)"
        : "rgba(255, 255, 255, 0.045)",
      "--dml-scrim": "rgba(9, 14, 12, 0.55)",
    };
  }, [backgroundColor, fontColor, fontSize, resolvedFont]);
}