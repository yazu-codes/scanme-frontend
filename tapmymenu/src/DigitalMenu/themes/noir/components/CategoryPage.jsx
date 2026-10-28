import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Ornament, { PageTitle } from "./Ornament";
import CategoryStrip from "./CategoryStrip";
import DishCard, { DishRow } from "./DishCard";
import { visibleItems } from "../utils";

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A block of dishes. If any dish in it has a photo it's the photo-card
// layout; an all-text block (typical for drinks) uses the list layout.
function Dishes({ items, onSelectItem }) {
  if (items.length === 0) return null;
  const photographic = items.some((i) => i.picture_url);

  if (photographic) {
    return (
      <div className="nr-dish-grid">
        {items.map((item, i) => (
          <DishCard key={`${item.name}-${i}`} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    );
  }
  return (
    <div className="nr-row-list">
      {items.map((item, i) => (
        <DishRow key={`${item.name}-${i}`} item={item} onSelect={onSelectItem} />
      ))}
    </div>
  );
}

function containsLabel(node, label) {
  return node.label === label || node.children.some((c) => containsLabel(c, label));
}

function SubSection({ node, itemsByCategory, originalLabelOf, onSelectItem, depth }) {
  return (
    <section className="nr-sub" data-depth={depth} data-sub={node.label}>
      <div className="nr-sub-head">
        <h3 className="nr-sub-title">{node.label}</h3>
        {originalLabelOf[node.label] ? (
          <p className="nr-orig" lang="bg">
            {originalLabelOf[node.label]}
          </p>
        ) : null}
        <Ornament bare />
      </div>
      <Dishes items={visibleItems(itemsByCategory, node.label)} onSelectItem={onSelectItem} />
      {node.children.map((child) => (
        <SubSection
          key={child.label}
          node={child}
          itemsByCategory={itemsByCategory}
          originalLabelOf={originalLabelOf}
          onSelectItem={onSelectItem}
          depth={depth + 1}
        />
      ))}
    </section>
  );
}

export default function CategoryPage({
  nodes,
  index,
  itemsByCategory,
  originalLabelOf = {},
  iconKeyOf = {},
  focusLabel = null,
  strings,
  onStripStuck,
  onMenu,
  onSelectCategory,
  onSelectItem,
  onBack,
}) {
  const pageRef = useRef(null);
  const node = nodes[index];
  const subNodes = node ? node.children : [];

  // Which direct sub-category is being read: the last one whose heading
  // has scrolled up to just below the pinned strip. null = above the
  // first one ("All").
  const [activeSub, setActiveSub] = useState(null);
  const lockUntil = useRef(0);

  const findSection = (label) =>
    pageRef.current && pageRef.current.querySelector(`[data-sub="${CSS.escape(label)}"]`);

  useEffect(() => {
    if (subNodes.length === 0) return undefined;
    let frame = null;
    function check() {
      frame = null;
      if (!pageRef.current || Date.now() < lockUntil.current) return;
      const strip = pageRef.current.querySelector(".nr-strip");
      const line = (strip ? strip.getBoundingClientRect().bottom : 0) + 48;
      let current = null;
      for (const sub of subNodes) {
        const el = findSection(sub.label);
        if (el && el.getBoundingClientRect().top <= line) current = sub.label;
      }
      setActiveSub((prev) => (prev === current ? prev : current));
    }
    function schedule() {
      if (frame == null) frame = requestAnimationFrame(check);
    }
    document.addEventListener("scroll", schedule, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame != null) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subNodes]);

  // Opened from a sub-category (cover chip or navigation tree): land on
  // that section while the page-change splash still covers it, and light
  // up its chip (or the chip of the sub-category that contains it).
  useLayoutEffect(() => {
    if (!focusLabel || !pageRef.current) return;
    const el = findSection(focusLabel);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    const owner = subNodes.find((sub) => containsLabel(sub, focusLabel));
    if (owner) {
      setActiveSub(owner.label);
      lockUntil.current = Date.now() + 600;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusLabel]);

  // Chip tapped: glide to that section (or the top of the category) and
  // hold the highlight on it while the smooth scroll passes the others.
  function handleSelectSub(label) {
    const target =
      label == null
        ? pageRef.current && pageRef.current.querySelector(".nr-category")
        : findSection(label);
    if (!target) return;
    setActiveSub(label);
    lockUntil.current = Date.now() + 900;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  if (!node) return null;

  return (
    <div className="nr-page nr-page-category" ref={pageRef}>
      <PageTitle title={strings.menu} />

      <CategoryStrip
        nodes={nodes}
        iconKeyOf={iconKeyOf}
        activeIndex={index}
        onSelect={onSelectCategory}
        onStuckChange={onStripStuck}
        onMenu={onMenu}
        menuLabel={strings.openMenu}
        subNodes={subNodes}
        activeSub={activeSub}
        onSelectSub={handleSelectSub}
        allLabel={strings.all}
      />

      <section className="nr-category">
        <div className="nr-category-head">
          <p className="nr-eyebrow">{strings.category}</p>
          <h2 className="nr-category-title">{node.label}</h2>
          {originalLabelOf[node.label] ? (
            <p className="nr-orig" lang="bg">
              {originalLabelOf[node.label]}
            </p>
          ) : null}
        </div>

        <Dishes items={visibleItems(itemsByCategory, node.label)} onSelectItem={onSelectItem} />

        {node.children.map((child) => (
          <SubSection
            key={child.label}
            node={child}
            itemsByCategory={itemsByCategory}
            originalLabelOf={originalLabelOf}
            onSelectItem={onSelectItem}
            depth={1}
          />
        ))}
      </section>

      <div className="nr-back-wrap">
        <button type="button" className="nr-btn nr-btn-wide" onClick={onBack}>
          <ArrowLeft />
          {strings.backToMenu}
        </button>
      </div>
    </div>
  );
}
