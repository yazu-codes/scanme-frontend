import React from "react";
import { CategoryIcon, firstImage } from "../../shared/menuKit";

// Kinetic name: every letter is its own span and bounces in on a stagger
// (see .cv-letter). Screen readers get the plain name.
// Words never break inside; the size shrinks to fit the longest word
// (--cv-len) so a long name never overflows a phone.
function KineticName({ text }) {
  let n = 0;
  const longest = String(text)
    .split(/\s+/)
    .reduce((m, w) => Math.max(m, Array.from(w).length), 1);
  return (
    <h1 className="cv-name" aria-label={text} style={{ "--cv-len": longest }}>
      {String(text)
        .split(/(\s+)/)
        .map((word, wi) =>
          /^\s+$/.test(word) ? (
            <span key={wi} className="cv-space" aria-hidden="true">
              {" "}
            </span>
          ) : (
            <span key={wi} className="cv-word" aria-hidden="true">
              {Array.from(word).map((ch, ci) => {
                n += 1;
                return (
                  <span key={ci} className="cv-letter" style={{ "--cv-i": n }}>
                    {ch}
                  </span>
                );
              })}
            </span>
          )
        )}
    </h1>
  );
}

// Story bar: every top-level category as a round "story" with a spinning
// owner-colour ring, its first dish photo (or icon) inside. Tap = jump.
function Stories({ nodes, itemsByLabel, iconKeyOf, onSelect, label }) {
  return (
    <nav className="cv-stories" aria-label={label}>
      {nodes.map((node, i) => {
        const img = firstImage(node, itemsByLabel);
        return (
          <button key={node.label} type="button" className="cv-story" onClick={() => onSelect(i)}>
            <span className="cv-story-ring" style={{ "--cv-d": `${(i % 4) * -1.3}s` }}>
              <span className="cv-story-face">
                {img ? (
                  <img src={img} alt="" loading="lazy" decoding="async" />
                ) : (
                  <CategoryIcon iconKey={iconKeyOf[node.label]} size={34} />
                )}
              </span>
            </span>
            <span className="cv-story-label">{node.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Hero({ owner, strings, nodes, itemsByLabel, iconKeyOf, onSelect }) {
  const name = owner.menu_owner_name || strings.menu;
  return (
    <header className="cv-hero">
      <div className="cv-hero-top">
        {owner.menu_owner_logo_url ? <img className="cv-logo" src={owner.menu_owner_logo_url} alt="" /> : null}
        <span className="cv-hero-sticker">{strings.menu}</span>
      </div>
      <KineticName text={name} />
      {owner.menu_owner_slogan ? <p className="cv-slogan">{owner.menu_owner_slogan}</p> : null}
      <p className="cv-hint">{strings.heroHint}</p>
      <Stories
        nodes={nodes}
        itemsByLabel={itemsByLabel}
        iconKeyOf={iconKeyOf}
        onSelect={onSelect}
        label={strings.categories}
      />
    </header>
  );
}
