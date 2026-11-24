import React, { memo } from "react";
import { collectItems, countItems, dishKey, firstImage, visibleItems } from "../../shared/menuKit";
import { levelCode } from "../utils";
import { ItemTile, LevelTile } from "./Tiles";

// One screen of the menu. Home lists the top-level categories; any other
// level lists its sub-categories as level tiles and/or its own dishes as
// dish tiles. Tiles enter on a short stagger (--em-n).
function Level({ path, node, nodes, data, explored, shisha, onOpenLevel }) {
  const children = node ? node.children : nodes;
  const own = node ? visibleItems(data.itemsByLabel, node.label) : [];
  // Inside a shisha category everything wears the hookah icon.
  const iconKey = shisha ? "hookah" : node ? data.iconKeyOf[node.label] : "cloche";
  const orig = node ? data.originalLabelOf[node.label] : null;

  return (
    <div className="em-level-screen">
      {node ? (
        <header className="em-level-head">
          <span className="em-level-code">{levelCode(path)}</span>
          <h2 className="em-level-title">{node.label}</h2>
          {orig ? (
            <p className="em-level-orig" lang="bg">
              {orig}
            </p>
          ) : null}
          <p className="em-level-count">{data.strings.items(countItems(node, data.itemsByLabel))}</p>
        </header>
      ) : (
        <p className="em-select">{data.strings.select}</p>
      )}

      {children.length ? (
        <div className="em-grid em-grid-levels">
          {children.map((child, j) => {
            const childPath = node ? `${path}-${j}` : String(j);
            return (
              <LevelTile
                key={child.label}
                node={child}
                path={childPath}
                n={j}
                img={firstImage(child, data.itemsByLabel)}
                iconKey={shisha ? "hookah" : data.iconKeyOf[child.label]}
                count={countItems(child, data.itemsByLabel)}
                orig={data.originalLabelOf[child.label]}
                explored={explored.has(childPath)}
                onOpen={onOpenLevel}
                strings={data.strings}
              />
            );
          })}
        </div>
      ) : null}

      {own.length ? (
        <>
          {children.length ? <p className="em-here">{data.strings.here}</p> : null}
          <div className={"em-grid em-grid-items" + (own.some((i) => i.picture_url) ? " em-grid-photos" : "")}>
            {own.map((item, i) => (
              <ItemTile
                key={dishKey(item, i)}
                item={item}
                n={i + children.length}
                iconKey={iconKey}
                shisha={shisha}
                onOpen={data.selectItem}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default memo(Level);

// Is this level (or any level above it) a shisha category?
export function isShishaPath(path, pathMap, iconKeyOf) {
  if (path == null) return false;
  const parts = path.split("-");
  for (let k = 1; k <= parts.length; k += 1) {
    const entry = pathMap.get(parts.slice(0, k).join("-"));
    if (entry && iconKeyOf[entry.node.label] === "hookah") return true;
  }
  return false;
}

// Every dish under a shisha category (for the detail-sheet icon).
export function shishaItemSet(nodes, itemsByLabel, iconKeyOf) {
  const set = new Set();
  function walk(n) {
    if (iconKeyOf[n.label] === "hookah") collectItems(n, itemsByLabel).forEach((i) => set.add(i));
    else n.children.forEach(walk);
  }
  nodes.forEach(walk);
  return set;
}
