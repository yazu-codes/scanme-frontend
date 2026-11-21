import React, { useEffect, useRef, useState } from "react";
import { Contacts, ReviewLinks, hasContacts } from "./ContactBlocks";
import { ChevronIcon, CloseIcon } from "./Icons";
import { countItems } from "../utils";

// One branch of the tree, any depth: a link to the section (with its
// item count) and, when it has children, a chevron that expands them.
function Branch({ node, path, depth, ctx }) {
  const { itemsByLabel, expanded, toggle, onOpen, open } = ctx;
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(path);
  const isTop = depth === 0;

  return (
    <li className={"ln-tree-item" + (isTop ? " ln-tree-top" : "")} style={{ "--ln-depth": depth }}>
      <div className={"ln-tree-row" + (ctx.activePath === path ? " ln-tree-current" : "")}>
        <button
          type="button"
          className="ln-tree-link"
          onClick={() => onOpen(path, node.label)}
          tabIndex={open ? 0 : -1}
        >
          <span className="ln-tree-label">{node.label}</span>
          <span className="ln-tree-count">{countItems(node, itemsByLabel)}</span>
        </button>
        {hasChildren ? (
          <button
            type="button"
            className={"ln-tree-toggle" + (isOpen ? " ln-tree-toggle-open" : "")}
            aria-expanded={isOpen}
            aria-label={node.label}
            onClick={() => toggle(path)}
            tabIndex={open ? 0 : -1}
          >
            <ChevronIcon />
          </button>
        ) : (
          <span className="ln-tree-toggle ln-tree-toggle-ghost" aria-hidden="true" />
        )}
      </div>
      {hasChildren ? (
        <div className={"ln-tree-panel" + (isOpen ? " ln-tree-panel-open" : "")}>
          <ul className="ln-tree-sub">
            {node.children.map((child, j) => (
              <Branch key={child.label} node={child} path={`${path}-${j}`} depth={depth + 1} ctx={ctx} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

// Full-screen navigation in the inverted palette: the whole category
// tree with item counts, expandable at every level (the category being
// read starts expanded), then contacts and review links.
export default function NavDrawer({
  open,
  focusContacts,
  owner,
  nodes,
  itemsByLabel,
  activeTop,
  activeSub,
  strings,
  onClose,
  onOpen,
}) {
  const closeRef = useRef(null);
  const contactsRef = useRef(null);
  const bodyRef = useRef(null);
  const [expanded, setExpanded] = useState(() => new Set());

  useEffect(() => {
    if (!open) return undefined;
    setExpanded(new Set(nodes[activeTop] && nodes[activeTop].children.length ? [String(activeTop)] : []));
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    if (focusContacts && contactsRef.current) {
      contactsRef.current.scrollIntoView({ block: "start" });
    }
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, focusContacts, activeTop, nodes, onClose]);

  function toggle(path) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  const ctx = {
    itemsByLabel,
    expanded,
    toggle,
    onOpen,
    open,
    activePath: activeSub || String(activeTop),
  };
  const name = owner.menu_owner_name || "";
  const reviews = Array.isArray(owner.menu_owner_review_links) ? owner.menu_owner_review_links : [];

  return (
    <div
      className={"ln-drawer ln-tone-b" + (open ? " ln-drawer-open" : "")}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={strings.navigation}
    >
      <div className="ln-drawer-top">
        <p className="ln-drawer-name">{name || strings.menu}</p>
        <button
          type="button"
          ref={closeRef}
          className="ln-close ln-close-static"
          onClick={onClose}
          aria-label={strings.close}
          tabIndex={open ? 0 : -1}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="ln-drawer-body" ref={bodyRef}>
        <p className="ln-drawer-heading">{strings.allCategories}</p>
        <ul className="ln-tree">
          {nodes.map((node, i) => (
            <Branch key={node.label} node={node} path={String(i)} depth={0} ctx={ctx} />
          ))}
        </ul>

        {hasContacts(owner) ? (
          <div className="ln-drawer-block" ref={contactsRef}>
            <p className="ln-drawer-heading">{strings.contacts}</p>
            <Contacts owner={owner} strings={strings} />
          </div>
        ) : null}

        {reviews.length ? (
          <div className="ln-drawer-block">
            <p className="ln-drawer-heading">{strings.reviews}</p>
            <ReviewLinks links={reviews} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
