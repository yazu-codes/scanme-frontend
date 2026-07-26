import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const MAX_MESSAGES = 10;
const TEMPERATURE = 0.1;
const AI_API_BASE = process.env.REACT_APP_AI_API_BASE;

async function sendToAgent(payload) {
  console.log(payload)
  // Example real implementation:
  const res = await fetch(`http://${AI_API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Agent request failed");
  const data = await res.json();
  console.log(data.Content)
  return { content: data.Content };
}

async function healthCheckAgent() {
  // Example real implementation:
  console.log(AI_API_BASE)
  const res = await fetch(`http://${AI_API_BASE}/`, {
    method: "GET",
  });
  if (!res.ok) return false;
  const data = await res.json();
  if (res.status != 200) {
    return false
  }
  return true
}

function pushFIFO(list, item) {
  const next = [...list, item];
  if (next.length > MAX_MESSAGES) {
    return next.slice(next.length - MAX_MESSAGES);
  }
  return next;
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p);
}

function readableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#241A17" : "#FFFFFF";
}

function usePalette(accentColor) {
  return useMemo(() => {
    const safe = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(accentColor)
      ? accentColor
      : "#B23A48";
    return {
      accent: safe,
      accentDark: shade(safe, -0.22),
      accentSoft: shade(safe, 0.88),
      accentSofter: shade(safe, 0.94),
      onAccent: readableTextColor(safe),
    };
  }, [accentColor]);
}

// ---------------------------------------------------------------------------
// Static styles (layout/structure — colors are applied inline per-instance)
// ---------------------------------------------------------------------------
const styles = {
  triggerWrap: {
    position: "fixed",
    zIndex: 40,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    bottom: "max(1.25rem, env(safe-area-inset-bottom))",
    right: "1.25rem",
  },
  triggerLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 14px -3px rgba(0,0,0,0.18)",
  },
  triggerBtn: {
    position: "relative",
    zIndex: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3.75rem",
    height: "3.75rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.15s ease",
    flexShrink: 0,
  },
  triggerBadge: {
    position: "absolute",
    top: "-0.2rem",
    right: "-0.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.35rem",
    height: "1.35rem",
    borderRadius: "9999px",
    backgroundColor: "#FFFFFF",
    border: "2px solid #FFFCFA",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "rgba(20, 14, 12, 0.6)",
    backdropFilter: "blur(2px)",
  },
  panel: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    height: "min(88vh, 660px)",
    backgroundColor: "#FFFCFA",
    borderTopLeftRadius: "1.5rem",
    borderTopRightRadius: "1.5rem",
    boxShadow: "0 24px 60px -12px rgba(0,0,0,0.35)",
  },
  header: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.25rem",
    flexShrink: 0,
    overflow: "hidden",
  },
  headerDecor: {
    position: "absolute",
    top: "-1.5rem",
    right: "-1.5rem",
    width: "6rem",
    height: "6rem",
    borderRadius: "9999px",
    opacity: 0.2,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    position: "relative",
  },
  headerIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    flexShrink: 0,
    width: "2.25rem",
    height: "2.25rem",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  headerTitles: { display: "flex", flexDirection: "column", lineHeight: 1.2 },
  headerName: { fontWeight: 600, fontSize: "0.98rem" },
  headerSubtitle: { fontSize: "0.75rem" },
  closeBtn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    width: "2.25rem",
    height: "2.25rem",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    backgroundColor: "#FFFCFA",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "2.5rem 2rem",
    gap: "0.5rem",
  },
  emptyIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    width: "3rem",
    height: "3rem",
    marginBottom: "0.25rem",
  },
  emptyTitle: { fontSize: "0.875rem", fontWeight: 500, color: "#4A3F38" },
  emptySubtitle: { fontSize: "0.75rem", color: "#A79A90" },
  bubbleRow: { display: "flex", width: "100%" },
  bubble: {
    maxWidth: "80%",
    borderRadius: "1rem",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  typingBubble: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: "1rem",
    padding: "0.75rem 1rem",
    borderBottomLeftRadius: "0.3rem",
  },
  typingDot: { width: "0.4rem", height: "0.4rem", borderRadius: "9999px" },
  inputRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.5rem",
    padding: "0.75rem",
    flexShrink: 0,
    borderTop: "1px solid #F0E6DC",
    backgroundColor: "#FFFCFA",
  },
  textarea: {
    flex: 1,
    resize: "none",
    borderRadius: "9999px",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    border: "none",
    maxHeight: "6rem",
    fontFamily: "inherit",
  },
  sendBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    flexShrink: 0,
    width: "2.6rem",
    height: "2.6rem",
    border: "none",
    cursor: "pointer",
  },
};

// Minimal scoped CSS — only for things inline styles can't express
// (keyframe animations, hover states, and the sm: breakpoint upgrade).
const scopedCss = `
@keyframes menuchat-ping {
  75%, 100% { transform: scale(1.6); opacity: 0; }
}
@keyframes menuchat-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-0.25rem); }
}
@keyframes menuchat-pop-in {
  0% { opacity: 0; transform: translateX(0.5rem) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes menuchat-twinkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.25) rotate(15deg); opacity: 0.85; }
}
@keyframes menuchat-glow {
  0%, 100% { box-shadow: 0 8px 24px -6px var(--menuchat-glow-color), 0 2px 8px rgba(0,0,0,0.15); }
  50% { box-shadow: 0 8px 32px -4px var(--menuchat-glow-color), 0 2px 10px rgba(0,0,0,0.18); }
}
.menuchat-trigger { animation: menuchat-glow 2.6s ease-in-out infinite; }
.menuchat-trigger:active { transform: scale(0.9); }
.menuchat-pulse {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  animation: menuchat-ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.menuchat-badge-icon { animation: menuchat-twinkle 2.2s ease-in-out infinite; }
.menuchat-label { animation: menuchat-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
.menuchat-close:active { background: rgba(255,255,255,0.25); }
.menuchat-send:disabled { opacity: 0.4; cursor: default; }
.menuchat-dot { animation: menuchat-bounce 1.2s ease-in-out infinite; }
@media (min-width: 640px) {
  .menuchat-overlay { align-items: center !important; }
  .menuchat-panel {
    width: 440px !important;
    border-radius: 1.75rem !important;
  }
}
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MenuChatWidget({
  restaurantName,
  accentColor = "#B23A48",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const palette = usePalette(accentColor);

  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    healthCheckAgent().then((ok) => {
      if (!cancelled) setIsAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isSending]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const buildPayload = useCallback(
    (updatedMessages) => ({
      ["3fc0469d66b2e72d3a7185687df9d459"]: restaurantName,
      messages: updatedMessages.map((m) => ({
        type: m.type,
        content: m.content,
      })),
      temperature: TEMPERATURE,
    }),
    ["3fc0469d66b2e72d3a7185687df9d459", restaurantName]
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = { type: "user", content: trimmed };
    const withUser = pushFIFO(messages, userMessage);

    setMessages(withUser);
    setInput("");
    setIsSending(true);

    try {
      const payload = buildPayload(withUser);
      const { content } = await sendToAgent(payload);
      setMessages((prev) => pushFIFO(prev, { type: "assistant", content }));
    } catch (err) {
      setMessages((prev) =>
        pushFIFO(prev, {
          type: "assistant",
          content: "Възникна грешка. Опитай отново след малко.",
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!isAvailable) {
    console.log("not available")
    return null;
  }

  return (
    <>
      <style>{scopedCss}</style>

      {!isOpen && (
        <div style={styles.triggerWrap}>
          <div
            className="menuchat-label"
            style={{ ...styles.triggerLabel, color: palette.accentDark }}
          >
            <Sparkles size={12} color={palette.accent} strokeWidth={2.4} />
            Ask YummGPT!
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label={`Отвори чат с асистента на ${restaurantName}, задвижван от изкуствен интелект`}
            className="menuchat-trigger"
            style={{
              ...styles.triggerBtn,
              background: `linear-gradient(145deg, ${palette.accent}, ${palette.accentDark})`,
              "--menuchat-glow-color": `${palette.accentDark}99`,
            }}
          >
            <span
              className="menuchat-pulse"
              style={{ backgroundColor: palette.accent, opacity: 0.35 }}
            />
            <MessageCircle
              color={palette.onAccent}
              size={27}
              strokeWidth={2}
              style={{ position: "relative" }}
            />
            <span
              className="menuchat-badge-icon"
              style={styles.triggerBadge}
              aria-hidden="true"
            >
              <Sparkles size={11} color={palette.accent} strokeWidth={2.6} fill={palette.accent} />
            </span>
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="menuchat-overlay"
          style={styles.overlay}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="menuchat-panel"
            onClick={(e) => e.stopPropagation()}
            style={styles.panel}
          >
            {/* Header */}
            <div
              style={{
                ...styles.header,
                background: `linear-gradient(120deg, ${palette.accent}, ${palette.accentDark} 70%)`,
              }}
            >
              <div
                style={{ ...styles.headerDecor, backgroundColor: palette.onAccent }}
              />
              <div style={styles.headerLeft}>
                <div style={styles.headerIconWrap}>
                  <Sparkles size={16} color={palette.onAccent} strokeWidth={2.2} />
                </div>
                <div style={styles.headerTitles}>
                  <span style={{ ...styles.headerName, color: palette.onAccent }}>
                    {restaurantName}
                  </span>
                  <span
                    style={{
                      ...styles.headerSubtitle,
                      color: palette.onAccent,
                      opacity: 0.78,
                    }}
                  >
                    Меню асистент
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Затвори чата"
                className="menuchat-close"
                style={styles.closeBtn}
              >
                <X color={palette.onAccent} size={19} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={styles.messagesArea}>
              {messages.length === 0 && (
                <div style={styles.emptyState}>
                  <div
                    style={{
                      ...styles.emptyIconWrap,
                      backgroundColor: palette.accentSoft,
                    }}
                  >
                    <Sparkles size={20} color={palette.accent} />
                  </div>
                  <span style={styles.emptyTitle}>Здравей! Как мога да помогна?</span>
                  <span style={styles.emptySubtitle}>
                    Попитай ме за съставки, алергени или препоръки от менюто.
                  </span>
                  <span style={styles.emptySubtitle}><b>
                    You can talk to me in other languages as well!
                    </b>
                  </span>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.bubbleRow,
                    justifyContent: m.type === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={
                      m.type === "user"
                        ? {
                            ...styles.bubble,
                            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`,
                            color: palette.onAccent,
                            borderBottomRightRadius: "0.3rem",
                          }
                        : {
                            ...styles.bubble,
                            backgroundColor: palette.accentSofter,
                            color: "#3A322D",
                            borderBottomLeftRadius: "0.3rem",
                          }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isSending && (
                <div style={{ ...styles.bubbleRow, justifyContent: "flex-start" }}>
                  <div
                    style={{
                      ...styles.typingBubble,
                      backgroundColor: palette.accentSofter,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="menuchat-dot"
                        style={{
                          ...styles.typingDot,
                          backgroundColor: palette.accent,
                          opacity: 0.6,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div
              style={{
                ...styles.inputRow,
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напиши съобщение..."
                rows={1}
                style={{
                  ...styles.textarea,
                  backgroundColor: palette.accentSofter,
                  color: "#3A322D",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                aria-label="Изпрати съобщение"
                className="menuchat-send"
                style={{
                  ...styles.sendBtn,
                  background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`,
                }}
              >
                <Send color={palette.onAccent} size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
