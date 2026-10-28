import React from "react";
import useReveal from "../hooks/useReveal";
import Ornament from "./Ornament";
import CategoryIcon from "./CategoryIcon";

// One "menu book" on the cover page: photo, small meta line, serif
// title, diamonds, teaser text and the outlined VIEW MENU button. A
// category with sub-categories lists them as chips instead of the teaser,
// each one jumping straight to its section.
export default function CoverCard({ label, originalLabel, iconKey, image, meta, summary, subs = [], strings, onOpen, onOpenSub }) {
  const [ref, shown] = useReveal();

  return (
    <article ref={ref} className={"nr-cover" + (shown ? " nr-in" : "")}>
      <button type="button" className="nr-cover-media" onClick={onOpen} tabIndex={-1} aria-hidden="true">
        {image ? (
          <img className="nr-cover-image" src={image} alt="" loading="lazy" />
        ) : (
          <span className="nr-cover-placeholder">
            <CategoryIcon iconKey={iconKey} size={64} />
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
        {subs.length > 0 ? (
          <ul className="nr-cover-subs">
            {subs.map((sub) => (
              <li key={sub}>
                <button type="button" className="nr-cover-sub" onClick={() => onOpenSub(sub)}>
                  {sub}
                </button>
              </li>
            ))}
          </ul>
        ) : summary ? (
          <p className="nr-cover-summary">{summary}</p>
        ) : null}
        <button type="button" className="nr-btn" onClick={onOpen}>
          {strings.viewMenu}
        </button>
      </div>
    </article>
  );
}
