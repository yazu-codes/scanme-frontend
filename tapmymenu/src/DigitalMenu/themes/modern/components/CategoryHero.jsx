import React, { forwardRef } from "react";

function PlateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M5 4v6.5a2.5 2.5 0 0 0 2.5 2.5V4M5 4v0M9.5 4v9M9.5 4v0M15 4c-1.4 0-2.5 1.9-2.5 5.5S13.6 15 15 15V4Zm0 0v16M7.5 13v7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function countItems(category, itemsByCategory) {
  const label = category.label !== undefined ? category.label : category;
  let count = (itemsByCategory[label] || []).length;

  if (category.children) {
    for (const child of category.children) {
      count += countItems(child, itemsByCategory);
    }
  }

  return count;
}

function findImage(category, itemsByCategory) {
  const label = category.label !== undefined ? category.label : category;
  const items = itemsByCategory[label] || [];
  const direct = items.find((item) => item.picture_url);

  if (direct) return direct.picture_url;

  if (category.children) {
    for (const child of category.children) {
      const found = findImage(child, itemsByCategory);
      if (found) return found;
    }
  }

  return null;
}

const CategoryHero = forwardRef(function CategoryHero(
  {
    categories,
    itemsByCategory,
    placeBackgroundUrl,
    onSelect,
  },
  ref
) {
  if (!categories || categories.length === 0) return null;

  const tiles = categories.map((category) => {
    const label =
      category.label !== undefined ? category.label : category;

    return {
      label,
      count: countItems(category, itemsByCategory),
      image:
        findImage(category, itemsByCategory) ||
        placeBackgroundUrl ||
        null,
    };
  });

  return (
    <nav
      ref={ref}
      className="dml-hero"
      aria-label="Browse categories"
    >
      <div className="dml-hero-grid">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            type="button"
            className={
              "dml-hero-tile" +
              (tile.image ? "" : " dml-hero-tile-flat")
            }
            onClick={() => onSelect(tile.label)}
          >
            {tile.image ? (
              <img
                className="dml-hero-tile-image"
                src={tile.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
            ) : (
              <PlateIcon />
            )}

            <span
              className="dml-hero-tile-scrim"
              aria-hidden="true"
            />

            <span className="dml-hero-tile-label">
              <span className="dml-hero-tile-name">
                {tile.label}
              </span>

              {tile.count > 0 ? (
                <span className="dml-hero-tile-count">
                  {tile.count}{" "}
                  {tile.count === 1 ? "dish" : "dishes"}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
});

export default CategoryHero;