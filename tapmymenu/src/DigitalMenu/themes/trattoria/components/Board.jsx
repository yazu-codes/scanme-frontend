import React, { memo } from "react";
import {
  Allergens,
  CategoryIcon,
  OriginalName,
  countItems,
  dishKey,
  formatEuro,
  pressable,
  splitWeight,
  visibleItems,
} from "../../shared/menuKit";

// A dish as in the reference: name in bold serif with the price on the
// right, an italic description under it. With photos, a small 4:3 frame
// on the right shows the whole picture.
const Dish = memo(function Dish({ item, withThumb, onSelect }) {
  const { description, weight } = splitWeight(item.description);
  return (
    <article className="tr-dish" {...pressable(() => onSelect(item), `${item.name}, ${formatEuro(item.price)}`)}>
      <div className="tr-dish-body">
        <div className="tr-dish-head">
          <h4 className="tr-dish-name">{item.name}</h4>
          <span className="tr-price">{formatEuro(item.price)}</span>
        </div>
        <OriginalName item={item} className="tr-orig" />
        {description || weight ? (
          <p className="tr-dish-desc">
            {description}
            {description && weight ? ", " : ""}
            {weight}
          </p>
        ) : null}
        <Allergens allergens={item.allergens} className="tr-allergens" />
      </div>
      {withThumb ? (
        <span className="tr-thumb" aria-hidden="true">
          {item.picture_url ? <img src={item.picture_url} alt="" loading="lazy" decoding="async" /> : null}
        </span>
      ) : null}
    </article>
  );
});

function Dishes({ items, onSelect }) {
  if (items.length === 0) return null;
  const withThumb = items.some((i) => i.picture_url);
  return (
    <div className="tr-dishes">
      {items.map((item, i) => (
        <Dish key={dishKey(item, i)} item={item} withThumb={withThumb} onSelect={onSelect} />
      ))}
    </div>
  );
}

// Section heading the reference's way: a small seal icon, the title,
// and an italic note pushed to the right (the original title in
// translated menus, otherwise the item count), over a fine rule.
function Heading({ node, data, level }) {
  const orig = data.originalLabelOf[node.label];
  const Tag = level === 0 ? "h2" : level === 1 ? "h3" : "h4";
  return (
    <header className={`tr-head tr-head-${Math.min(level, 2)}`}>
      {level < 2 ? (
        <span className="tr-seal" aria-hidden="true">
          <CategoryIcon iconKey={data.iconKeyOf[node.label]} size={level === 0 ? 30 : 24} />
        </span>
      ) : null}
      <Tag className="tr-title">{node.label}</Tag>
      <span className="tr-note" lang={orig ? "bg" : undefined}>
        {orig || data.strings.items(countItems(node, data.itemsByLabel))}
      </span>
    </header>
  );
}

function Branch({ node, path, data, level }) {
  return (
    <section className={`tr-branch tr-branch-${Math.min(level, 2)}`} data-mk-path={path} aria-label={node.label}>
      <Heading node={node} data={data} level={level} />
      <Dishes items={visibleItems(data.itemsByLabel, node.label)} onSelect={data.selectItem} />
      {node.children.map((child, j) => (
        <Branch key={child.label} node={child} path={`${path}-${j}`} data={data} level={level + 1} />
      ))}
    </section>
  );
}

const Category = memo(function Category({ node, index, data }) {
  return <Branch node={node} path={String(index)} data={data} level={0} />;
});

export default function Board({ data }) {
  return data.nodes.map((node, i) => <Category key={node.label} node={node} index={i} data={data} />);
}
