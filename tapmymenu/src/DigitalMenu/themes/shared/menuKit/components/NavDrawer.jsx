import React, { useEffect, useRef, useState } from "react";
import { Contacts, ReviewLinks, hasContacts } from "./ContactBlocks";
import { ChevronIcon, CloseIcon } from "./Icons";
import { countItems } from "../menuData";

// One branch of the tree, any depth: a link to the section (with its
// item count) and, when it has children, a chevron that expands them.
function Branch({ node, path, depth, ctx }) {
  const { itemsByLabel, expanded, toggle, onOpen, open } = ctx;
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(path);
  const isTop = depth === 0;

  return (
    <li className={"mk-tree-item" + (isTop ? " mk-tree-top" : "")} style={{ "--mk-depth": depth }}>
      <div className={"mk-tree-row" + (ctx.activePath === path ? " mk-tree-current" : "")}>
        <button
          type="button"
          className="mk-tree-link"
          onClick={() => onOpen(path, node.label)}
          tabIndex={open ? 0 : -1}
        >
          <span className="mk-tree-label">{node.label}</span>
          <span className="mk-tree-count">{countItems(node, itemsByLabel)}</span>
        </button>
        {hasChildren ? (
          <button
            type="button"
            className={"mk-tree-toggle" + (isOpen ? " mk-tree-toggle-open" : "")}
            aria-expanded={isOpen}
            aria-label={node.label}
            onClick={() => toggle(path)}
            tabIndex={open ? 0 : -1}
          >
            <ChevronIcon />
          </button>
        ) : (
          <span className="mk-tree-toggle mk-tree-toggle-ghost" aria-hidden="true" />
        )}
      </div>
      {hasChildren ? (
        <div className={"mk-tree-panel" + (isOpen ? " mk-tree-panel-open" : "")}>
          <ul className="mk-tree-sub">
            {node.children.map((child, j) => (
              <Branch key={child.label} node={child} path={`${path}-${j}`} depth={depth + 1} ctx={ctx} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

// Full-screen navigation shared by menuKit themes: the whole category
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
      className={"mk-drawer" + (open ? " mk-drawer-open" : "")}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={strings.navigation}
    >
      <div className="mk-drawer-top">
        <p className="mk-drawer-name">{name || strings.menu}</p>
        <button
          type="button"
          ref={closeRef}
          className="mk-close mk-close-static"
          onClick={onClose}
          aria-label={strings.close}
          tabIndex={open ? 0 : -1}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mk-drawer-body" ref={bodyRef}>
        <p className="mk-drawer-heading">{strings.allCategories}</p>
        <ul className="mk-tree">
          {nodes.map((node, i) => (
            <Branch key={node.label} node={node} path={String(i)} depth={0} ctx={ctx} />
          ))}
        </ul>

        {hasContacts(owner) ? (
          <div className="mk-drawer-block" ref={contactsRef}>
            <p className="mk-drawer-heading">{strings.contacts}</p>
            <Contacts owner={owner} strings={strings} />
          </div>
        ) : null}

        {reviews.length ? (
          <div className="mk-drawer-block">
            <p className="mk-drawer-heading">{strings.reviews}</p>
            <ReviewLinks links={reviews} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
