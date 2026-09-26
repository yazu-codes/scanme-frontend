import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Copy, Check, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Accent color helpers
// ---------------------------------------------------------------------------
const DEFAULT_ACCENT = "#B23A48";

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// percent < 0 darkens toward black, > 0 lightens toward white
function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const mix = (v) => Math.round(v + (t - v) * p).toString(16).padStart(2, "0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function getPalette(accentColor) {
  const accent = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(accentColor || "") ? accentColor : DEFAULT_ACCENT;
  const { r, g, b } = hexToRgb(accent);
  const isLight = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  return {
    accent,
    accentDark: shade(accent, -0.25),
    accentSoft: shade(accent, 0.92),
    onAccent: isLight ? "#241A17" : "#FFFFFF",
  };
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  height: "2.5rem",
  padding: "0 1rem",
  borderRadius: "9999px",
  border: "1px solid rgba(255,255,255,0.35)",
  boxShadow: "0 4px 14px -4px rgba(0,0,0,0.35)",
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

// ---------------------------------------------------------------------------
// Modal — portalled to <body> so the hero can't clip it
// ---------------------------------------------------------------------------
function ClickableModal({ title, fieldLabel, value, palette, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        backgroundColor: "rgba(20,14,12,0.6)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "22rem",
          borderRadius: "1.25rem",
          backgroundColor: "#FFFFFF",
          padding: "1.25rem",
          borderTop: `5px solid ${palette.accent}`,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontWeight: 600, fontSize: "1rem", color: palette.accentDark }}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Затвори"
            style={{ display: "flex", padding: "0.4rem", border: "none", background: "transparent", cursor: "pointer", borderRadius: "9999px" }}
          >
            <X size={19} color={palette.accentDark} />
          </button>
        </div>

        {fieldLabel && (
          <div style={{ fontSize: "0.75rem", color: "#7A6D64", marginBottom: "0.25rem" }}>{fieldLabel}</div>
        )}
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#241A17",
            wordBreak: "break-all",
            marginBottom: "1.25rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            backgroundColor: palette.accentSoft,
          }}
        >
          {value}
        </div>

        <button
          type="button"
          onClick={async () => (await copyToClipboard(value)) && setCopied(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            width: "100%",
            height: "2.75rem",
            border: "none",
            borderRadius: "9999px",
            backgroundColor: palette.accent,
            color: palette.onAccent,
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Copied" : fieldLabel ? `Copy ${fieldLabel.toLowerCase()}` : "Copy"}
        </button>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// A single CTA: shows a label, opens a modal with the value
// ---------------------------------------------------------------------------
export function ClickableCta({
  icon: Icon,
  label,
  title,
  fieldLabel,
  value,
  accentColor = DEFAULT_ACCENT,
  ariaLabel,
  style,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const palette = getPalette(accentColor);

  if (!value) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={ariaLabel ?? label}
        className={className}
        style={{
          ...pillStyle,
          background: `linear-gradient(145deg, ${palette.accent}, ${palette.accentDark})`,
          color: palette.onAccent,
          ...style,
        }}
      >
        {Icon && <Icon size={18} strokeWidth={2} aria-hidden="true" />}
        {label && <span>{label}</span>}
      </button>

      {isOpen && (
        <ClickableModal
          title={title ?? label}
          fieldLabel={fieldLabel ?? label}
          value={value}
          palette={palette}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// A row of CTAs, one per item
// items: [{ icon, label, title, fieldLabel, value, ariaLabel, accentColor? }]
// ---------------------------------------------------------------------------
export default function ClickableWidget({ items = [], accentColor = DEFAULT_ACCENT, style, className }) {
  const visible = items.filter((item) => item && item.value);
  if (visible.length === 0) return null;

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "0.75rem", ...style }}
    >
      {visible.map((item, i) => (
        <ClickableCta key={item.label ?? i} {...item} accentColor={item.accentColor ?? accentColor} />
      ))}
    </div>
  );
}