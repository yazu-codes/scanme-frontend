import React from "react";
import useReveal from "../hooks/useReveal";
import Ornament from "./Ornament";
import CategoryIcon from "./CategoryIcon";

// One "menu book" on the cover page: photo, small meta line, serif
// title, diamonds, teaser text and the outlined VIEW MENU button.
export default function CoverCard({ label, originalLabel, image, meta, summary, strings, onOpen }) {
  const [ref, shown] = useReveal();

  return (
    <article ref={ref} className={"nr-cover" + (shown ? " nr-in" : "")}>
      <button type="button" className="nr-cover-media" onClick={onOpen} tabIndex={-1} aria-hidden="true">
        {image ? (
          <img className="nr-cover-image" src={image} alt="" loading="lazy" />
        ) : (
          <span className="nr-cover-placeholder">
            <CategoryIcon label={label} size={64} />
          </span>
        )}
      </button>

      <div className="nr-cover-body">
        {meta ? <p className="nr-cover-meta">{meta}</p> : null}
        <h2 className="nr-cover-title">{label}</h2>
        {originalLabel ? (
          <p className="nr-orig nr-cover-orig" lang="bg">
            {originalLabel}
          </p>
        ) : null}
        <Ornament />
        {summary ? <p className="nr-cover-summary">{summary}</p> : null}
        <button type="button" className="nr-btn" onClick={onOpen}>
          {strings.viewMenu}
        </button>
      </div>
    </article>
  );
}
