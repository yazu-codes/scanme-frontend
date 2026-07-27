import { useMemo } from "react";

// Splits raw assistant message content into plain text segments and
// item segments. Items are delimited as #!#<json>#!# where <json> is a
// single-line, valid JSON object describing a menu item (id, name, price,
// description, pictureUrl, allergens, etc — whatever ItemDetailPanel needs).
//
// Example input:
//   "Some plain text explaining the question. #!#{"id":"12","name":"Tofu Ramen"}#!# some other information"
function parseHighlightedContent(content) {
  const regex = /#!#(.*?)#!#/gs;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "item", raw: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

/**
 * Renders assistant chat text, turning any #!#<json>#!# segments into
 * clickable inline buttons that open the item detail panel.
 *
 * @param {string} content - raw message content from the backend
 * @param {(item: object) => void} onSelectItem - called with the parsed
 *   item object when a highlighted segment is clicked (e.g. setActiveItem)
 * @param {object} palette - the widget's color palette (accent, accentDark,
 *   accentSoft, ...) so the highlight matches the current theme
 */
export default function HighlightedMessage({ content, onSelectItem, palette }) {
  const parts = useMemo(() => parseHighlightedContent(content ?? ""), [content]);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={i}>{part.value}</span>;
        }

        let item = null;
        try {
          item = JSON.parse(part.raw);
        } catch {
          // Malformed payload from the model — fall back to plain, inert text
          // rather than crashing the whole message render.
          return <span key={i}>{part.raw}</span>;
        }

        return (
          <button
            key={i}
            onClick={() => onSelectItem(item)}
            style={{
              display: "inline",
              background: palette.accentSoft,
              color: palette.accentDark,
              border: "none",
              borderRadius: "0.3rem",
              padding: "0 0.3rem",
              margin: "0 0.05rem",
              fontWeight: 600,
              cursor: "pointer",
              font: "inherit",
            }}
          >
            {item.name}
          </button>
        );
      })}
    </span>
  );
}
