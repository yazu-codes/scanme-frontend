import React, { useEffect, useRef, useState } from "react";
import { Contacts, SocialLinks, hasContacts } from "./ContactBlocks";
import CategoryIcon from "./CategoryIcon";
import { countItems } from "../utils";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// One sub-category row, recursively (sub-sub-categories nest one level
// deeper behind their own chevron).
function SubBranch({ node, topIndex, depth, ctx }) {
  const { itemsByCategory, expanded, toggle, onOpenCategory, open } = ctx;
  const hasChildren = node.children.length > 0;
  const id = `${topIndex}/${node.label}`;
  const isOpen = expanded.has(id);
  const count = countItems(node, itemsByCategory);

  return (
    <li className="nr-tree-sub" style={{ "--depth": depth }}>
      <div className="nr-tree-subrow">
        <button
          type="button"
          className="nr-tree-sublink"
          onClick={() => onOpenCategory(topIndex, node.label)}
          tabIndex={open ? 0 : -1}
        >
          <span className="nr-tree-sublabel">{node.label}</span>
          <span className="nr-tree-count">{count}</span>
        </button>
        {hasChildren ? (
          <button
            type="button"
            className={"nr-tree-toggle" + (isOpen ? " nr-tree-toggle-open" : "")}
            aria-expanded={isOpen}
            aria-label={node.label}
            onClick={() => toggle(id)}
            tabIndex={open ? 0 : -1}
          >
            <Chevron />
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <div className={"nr-tree-panel" + (isOpen ? " nr-tree-panel-open" : "")}>
          <ul className="nr-tree-subs">
            {node.children.map((child) => (
              <SubBranch key={child.label} node={child} topIndex={topIndex} depth={depth + 1} ctx={ctx} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

// Full-screen hamburger menu with the whole category tree:
//  - every top-level category shows its icon, name and dish count
//  - one with sub-categories expands in place (chevron turns); its first
//    entry is "View all", then each sub-category with its count
//  - tapping a sub-category opens the category and lands on that section
//  - the category currently on screen starts expanded and highlighted
// Then contacts and social links.
export default function NavDrawer({
  open,
  owner,
  nodes,
  itemsByCategory,
  iconKeyOf = {},
  activeIndex,
  strings,
  onClose,
  onHome,
  onOpenCategory,
}) {
  const closeRef = useRef(null);
  const [expanded, setExpanded] = useState(() => new Set());

  // Each time the drawer opens, start with the current category expanded.
  useEffect(() => {
    if (!open) return undefined;
    setExpanded(activeIndex != null && nodes[activeIndex] ? new Set([String(activeIndex)]) : new Set());
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, activeIndex, nodes]);

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const ctx = { itemsByCategory, expanded, toggle, onOpenCategory, open };
  const name = owner.menu_owner_name || "";

  return (
    <div className={"nr-drawer" + (open ? " nr-drawer-open" : "")} aria-hidden={!open}>
      <div className="nr-drawer-top">
        <button type="button" className="nr-brand" onClick={onHome} tabIndex={open ? 0 : -1}>
          {owner.menu_owner_logo_url ? <img className="nr-brand-logo" src={owner.menu_owner_logo_url} alt="" /> : null}
          {name ? <span className="nr-brand-name">{name}</span> : null}
        </button>
        <button
          type="button"
          ref={closeRef}
          className="nr-modal-close nr-drawer-close"
          onClick={onClose}
          aria-label={strings.close}
          tabIndex={open ? 0 : -1}
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="nr-drawer-body" aria-label={strings.navigation}>
        <button
          type="button"
          className={"nr-tree-home" + (activeIndex == null ? " nr-tree-active" : "")}
          onClick={onHome}
          tabIndex={open ? 0 : -1}
        >
          {strings.allCategories}
        </button>

        <ul className="nr-tree">
          {nodes.map((node, i) => {
            const id = String(i);
            const hasChildren = node.children.length > 0;
            const isOpen = expanded.has(id);
            const isActive = i === activeIndex;
            const count = countItems(node, itemsByCategory);

            return (
              <li
                key={node.label}
                className={"nr-tree-item" + (isActive ? " nr-tree-active" : "")}
                style={{ "--i": i }}
              >
                <button
                  type="button"
                  className="nr-tree-row"
                  aria-expanded={hasChildren ? isOpen : undefined}
                  onClick={() => (hasChildren ? toggle(id) : onOpenCategory(i))}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="nr-tree-icon">
                    <CategoryIcon iconKey={iconKeyOf[node.label]} size={26} />
                  </span>
                  <span className="nr-tree-label">{node.label}</span>
                  <span className="nr-tree-count">{count}</span>
                  {hasChildren ? (
                    <span className={"nr-tree-toggle" + (isOpen ? " nr-tree-toggle-open" : "")} aria-hidden="true">
                      <Chevron />
                    </span>
                  ) : (
                    <span className="nr-tree-toggle nr-tree-toggle-ghost" aria-hidden="true">
                      <Chevron />
                    </span>
                  )}
                </button>

                {hasChildren ? (
                  <div className={"nr-tree-panel" + (isOpen ? " nr-tree-panel-open" : "")}>
                    <ul className="nr-tree-subs">
                      <li className="nr-tree-sub" style={{ "--depth": 1 }}>
                        <div className="nr-tree-subrow">
                          <button
                            type="button"
                            className="nr-tree-sublink nr-tree-viewall"
                            onClick={() => onOpenCategory(i)}
                            tabIndex={open && isOpen ? 0 : -1}
                          >
                            <span className="nr-tree-sublabel">{strings.viewAll}</span>
                            <span className="nr-tree-count">{count}</span>
                          </button>
                        </div>
                      </li>
                      {node.children.map((child) => (
                        <SubBranch key={child.label} node={child} topIndex={i} depth={1} ctx={ctx} />
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        {hasContacts(owner) ? (
          <div className="nr-drawer-block">
            <p className="nr-footer-heading">{strings.contacts}</p>
            <Contacts owner={owner} strings={strings} />
          </div>
        ) : null}

        {Array.isArray(owner.menu_owner_review_links) && owner.menu_owner_review_links.length ? (
          <div className="nr-drawer-block">
            <p className="nr-footer-heading">{strings.followUs}</p>
            <SocialLinks links={owner.menu_owner_review_links} />
          </div>
        ) : null}
      </nav>
    </div>
  );
}
