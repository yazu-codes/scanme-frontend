import React from "react";
import { PageTitle } from "./Ornament";
import CoverCard from "./CoverCard";
import { countItems, coverSummary, firstImage } from "../utils";

// The landing page: "Explore our menu / Menu" and one card per
// top-level category.
export default function MenuCover({ nodes, itemsByCategory, originalLabelOf = {}, iconKeyOf = {}, placeBackgroundUrl, strings, onOpen }) {
  return (
    <div className="nr-page nr-page-cover">
      <PageTitle eyebrow={strings.explore} title={strings.menu} />

      <div className="nr-covers">
        {nodes.map((node, index) => (
          <CoverCard
            key={node.label}
            label={node.label}
            originalLabel={originalLabelOf[node.label]}
            iconKey={iconKeyOf[node.label]}
            image={firstImage(node, itemsByCategory) || placeBackgroundUrl || null}
            meta={strings.items(countItems(node, itemsByCategory))}
            summary={coverSummary(node, itemsByCategory)}
            strings={strings}
            onOpen={() => onOpen(index)}
          />
        ))}
      </div>
    </div>
  );
}
