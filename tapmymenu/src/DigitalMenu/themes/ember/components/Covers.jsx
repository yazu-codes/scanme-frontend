import React from "react";
import { CategoryIcon, countItems, firstImage } from "../../shared/menuKit";

// Noir-style category "books" as a smoked-glass rail: number, photo or
// icon, serif title, count. Tap = jump to that section.
export default function Covers({ nodes, itemsByLabel, iconKeyOf, originalLabelOf, strings, onSelect }) {
  return (
    <nav className="em-covers" aria-label={strings.categories}>
      {nodes.map((node, i) => {
        const img = firstImage(node, itemsByLabel);
        return (
          <button key={node.label} type="button" className="em-cover" onClick={() => onSelect(i)}>
            <span className="em-cover-no">{String(i + 1).padStart(2, "0")}</span>
            <span className="em-cover-media">
              {img ? (
                <img src={img} alt="" loading="lazy" decoding="async" />
              ) : (
                <CategoryIcon iconKey={iconKeyOf[node.label]} size={44} />
              )}
            </span>
            <span className="em-cover-title">{node.label}</span>
            {originalLabelOf[node.label] ? (
              <span className="em-cover-orig" lang="bg">
                {originalLabelOf[node.label]}
              </span>
            ) : null}
            <span className="em-cover-count">{strings.items(countItems(node, itemsByLabel))}</span>
          </button>
        );
      })}
    </nav>
  );
}
