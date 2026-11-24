import React, { memo } from "react";
import { CategoryIcon, formatEuro, pressable, splitWeight } from "../../shared/menuKit";
import { flavourNotes, levelCode } from "../utils";

// A level on the level-select screen: code, picture (first dish photo
// or the category icon), name, number of dishes inside, and a small
// diamond once the guest has explored it.
export const LevelTile = memo(function LevelTile({ node, path, n, img, iconKey, count, orig, explored, onOpen, strings }) {
  return (
    <button
      type="button"
      className={"em-tile em-level" + (explored ? " em-explored" : "")}
      style={{ "--em-n": n }}
      data-path={path}
      onClick={() => onOpen(path)}
      aria-label={`${node.label}, ${strings.items(count)}`}
    >
      <span className="em-tile-top">
        <span className="em-code">{levelCode(path)}</span>
        <span className="em-mark" aria-hidden="true" title={explored ? strings.explored : undefined} />
      </span>
      <span className="em-tile-media">
        {img ? <img src={img} alt="" loading="lazy" decoding="async" /> : <CategoryIcon iconKey={iconKey} size={46} />}
      </span>
      <span className="em-tile-name">{node.label}</span>
      {orig ? (
        <span className="em-tile-orig" lang="bg">
          {orig}
        </span>
      ) : null}
      <span className="em-tile-foot">
        <span className="em-count">{count}</span>
        <span className="em-go" aria-hidden="true">
          ▸
        </span>
      </span>
    </button>
  );
});

// A dish: picture (whole photo, never cropped) or the category icon,
// name and price, nothing else. Everything else is in the detail sheet.
// Shisha flavours add up to three flavour-note chips from the
// description.
export const ItemTile = memo(function ItemTile({ item, n, iconKey, shisha, onOpen }) {
  const notes = shisha ? flavourNotes(splitWeight(item.description).description).slice(0, 3) : [];
  return (
    <article
      className={"em-tile em-item" + (shisha ? " em-item-shisha" : "")}
      style={{ "--em-n": n }}
      {...pressable(() => onOpen(item), `${item.name}, ${formatEuro(item.price)}`)}
    >
      <span className={"em-tile-media" + (item.picture_url ? " em-has-photo" : "")}>
        {item.picture_url ? (
          <img src={item.picture_url} alt="" loading="lazy" decoding="async" />
        ) : (
          <CategoryIcon iconKey={iconKey} size={38} />
        )}
      </span>
      <span className="em-tile-name">{item.name}</span>
      {item.original_name ? (
        <span className="em-tile-orig" lang="bg">
          {item.original_name}
        </span>
      ) : null}
      {notes.length ? (
        <span className="em-notes">
          {notes.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </span>
      ) : null}
      <span className="em-tile-foot">
        <span className="em-price">{formatEuro(item.price)}</span>
      </span>
    </article>
  );
});
