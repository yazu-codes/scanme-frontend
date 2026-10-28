import { DEFAULT_ICON, getCategoryIconKey } from "./iconKeywords";

// Presentation helpers for the Noir theme. Pure functions only — no JSX,
// no DOM. Anything here is about *how Noir arranges* the data core hands
// it, not about parsing the menu itself (that stays in core/).

export function nodeLabel(node) {
  return typeof node === "string" ? node : node.label;
}

function normalizeNode(node) {
  if (typeof node === "string") return { label: node, children: [] };
  return {
    label: node.label,
    children: Array.isArray(node.children) ? node.children.map(normalizeNode) : [],
  };
}

function parseTree(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.error("Noir: invalid category_order JSON", err);
    return null;
  }
}

function walk(nodes, fn) {
  for (const n of nodes) {
    fn(n);
    walk(n.children, fn);
  }
}

// Items for one category label. No `enabled` filtering here: the API
// already leaves disabled dishes out, and the translated (?lang=en)
// response currently sends every item as enabled: false, so filtering on
// it hid the whole menu in any language other than Bulgarian.
export function visibleItems(itemsByLabel, label) {
  return itemsByLabel[label] || [];
}

// Category names are typed by hand in two places (category_order and each
// item), so tiny differences creep in, e.g. "Винпром -Троян" vs
// "Винпром - Троян". Compare on a loose key instead of the exact string.
function labelKey(label) {
  return String(label || "")
    .toLowerCase()
    .replace(/\s*([-–—/,&.])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// WORKAROUND for a backend translation bug (remove once fixed): in
// ?lang=en responses every name/description arrives as
// "<Bulgarian text of a DIFFERENT item> / <English text of this item>",
// e.g. "Олмека жълта / Babuch Brandy" on the Babuch Brandy record, or
// " / 200 g." when that other item had no description. The English half
// is the one that matches the record's price and category, so keep it:
// the longest Cyrillic-free tail after a " / " (so an English name that
// itself contains " / " survives intact).
//
// Only switched on when the menu as a whole has that shape (see
// hasBilingualPrefixBug), so it turns itself off once the API is fixed
// and never touches a genuine "A / B" dish name in a healthy response.
const CYR = /[Ѐ-ӿ]/;
export function stripBilingualPrefix(text) {
  if (typeof text !== "string") return text;
  const lead = text.match(/^\s*\/\s+/);
  if (lead) return text.slice(lead[0].length).trim();
  if (/\s\/\s*$/.test(text)) return ""; // "<bg> / " — nothing was translated
  const parts = text.split(" / ");
  for (let k = 1; k < parts.length; k++) {
    const right = parts.slice(k).join(" / ").trim();
    if (right && !CYR.test(right)) return right;
  }
  return text;
}

export function hasBilingualPrefixBug(itemsByCategory, locale) {
  if (!locale || locale === "bg") return false;
  const items = Object.values(itemsByCategory).flat();
  if (items.length === 0) return false;
  const glued = items.filter((i) => typeof i.name === "string" && i.name.includes(" / ")).length;
  return glued / items.length >= 0.8;
}

// Translated item <-> original item key. display_order_position alone
// repeats across categories; together with price it's unique per dish
// (verified on live menus), and both survive translation untouched.
export function pairKey(item) {
  return `${item.display_order_position}#${Number(item.price)}`;
}

function indexOriginals(originalItems) {
  if (!Array.isArray(originalItems) || originalItems.length === 0) return null;
  const index = new Map();
  const dupes = new Set();
  for (const item of originalItems) {
    const key = pairKey(item);
    if (index.has(key)) dupes.add(key);
    else index.set(key, item);
  }
  dupes.forEach((key) => index.delete(key)); // ambiguous: never guess
  return index;
}

const sameText = (a, b) =>
  String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

// Final display shape of one item. Adds, when the menu is translated:
//   original_name / original_description  the dish in the original
//                                         language (omitted when identical,
//                                         e.g. "Beefeater")
// and restores picture_url from the original when the translation lost it.
function localizeItem(item, fixGlued, originals) {
  const name = fixGlued ? stripBilingualPrefix(item.name) : item.name;
  const description = fixGlued ? stripBilingualPrefix(item.description) : item.description;
  const original = originals ? originals.get(pairKey(item)) : null;

  if (!original && !fixGlued) return item;
  const out = { ...item, name, description };
  if (original) {
    if (original.name && !sameText(original.name, name)) out.original_name = original.name;
    if (original.description && !sameText(original.description, description)) {
      out.original_description = original.description;
    }
    if (!out.picture_url && original.picture_url) out.picture_url = original.picture_url;
  }
  return out;
}

// Most common original category per translated category, judged by the
// category the paired original dishes sit in ("Lean dishes" -> "Постни
// ястия"). Only covers categories that hold dishes directly.
function originalLabels(itemsByLabel) {
  const result = {};
  for (const [label, items] of Object.entries(itemsByLabel)) {
    const votes = new Map();
    for (const item of items) {
      if (item._original_category) {
        votes.set(item._original_category, (votes.get(item._original_category) || 0) + 1);
      }
    }
    let best = null;
    let bestCount = 0;
    votes.forEach((count, cat) => {
      if (count > bestCount) {
        best = cat;
        bestCount = count;
      }
    });
    if (best) result[label] = best;
  }
  return result;
}

// Original title of EVERY category in the tree, including parent groups
// that hold no dishes themselves ("Soft drinks" only has children).
//  - Bulgarian locale: the label is already the original.
//  - Otherwise: from the paired dishes (above); for a parent, the node in
//    the original-language category_order whose sub-categories overlap
//    most with this node's sub-categories' originals.
// Returns { [label]: originalTitle | undefined }.
function resolveOriginalTitles(nodes, ownOriginal, originalTreeRaw, translated) {
  const titles = {};
  if (!translated) {
    walk(nodes, (n) => (titles[n.label] = n.label));
    return titles;
  }

  const originalTree = (parseTree(originalTreeRaw) || []).map(normalizeNode);
  const originalNodes = [];
  walk(originalTree, (n) => originalNodes.push(n));
  const descendantKeys = (node) => {
    const keys = new Set();
    walk(node.children, (c) => keys.add(labelKey(c.label)));
    return keys;
  };

  function resolve(node) {
    node.children.forEach(resolve);
    if (ownOriginal[node.label]) {
      titles[node.label] = ownOriginal[node.label];
      return;
    }
    const wanted = new Set();
    walk(node.children, (c) => {
      if (titles[c.label]) wanted.add(labelKey(titles[c.label]));
    });
    if (wanted.size === 0) return;
    let best = null;
    let bestScore = 0;
    for (const candidate of originalNodes) {
      if (candidate.children.length === 0) continue;
      let score = 0;
      descendantKeys(candidate).forEach((k) => wanted.has(k) && (score += 1));
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    if (best) titles[node.label] = best.label;
  }
  nodes.forEach(resolve);
  return titles;
}

// Icon per category, always from its ORIGINAL title (iconKeywords.js). If
// the original title is unknown or matches no keyword, borrow the most
// common icon among its sub-categories; otherwise the generic cloche.
function resolveIconKeys(nodes, originalTitleOf) {
  const keys = {};
  function resolve(node) {
    node.children.forEach(resolve);
    let key = getCategoryIconKey(originalTitleOf[node.label]);
    if (key === DEFAULT_ICON && node.children.length) {
      const votes = new Map();
      node.children.forEach((c) => {
        const k = keys[c.label];
        if (k && k !== DEFAULT_ICON) votes.set(k, (votes.get(k) || 0) + 1);
      });
      let bestCount = 0;
      votes.forEach((count, k) => {
        if (count > bestCount) {
          key = k;
          bestCount = count;
        }
      });
    }
    keys[node.label] = key;
  }
  nodes.forEach(resolve);
  return keys;
}

export function countItems(node, itemsByCategory) {
  let count = visibleItems(itemsByCategory, node.label).length;
  for (const child of node.children) count += countItems(child, itemsByCategory);
  return count;
}

export function collectItems(node, itemsByCategory) {
  let items = visibleItems(itemsByCategory, node.label);
  for (const child of node.children) items = items.concat(collectItems(child, itemsByCategory));
  return items;
}

export function firstImage(node, itemsByCategory) {
  const hit = collectItems(node, itemsByCategory).find((item) => item.picture_url);
  return hit ? hit.picture_url : null;
}

function prune(nodes, itemsByCategory) {
  return nodes
    .map((n) => ({ ...n, children: prune(n.children, itemsByCategory) }))
    .filter((n) => countItems(n, itemsByCategory) > 0);
}

// Builds what Noir renders from:
//  nodes        the category tree (category_order when present, else
//               core's flat list), with empty categories dropped
//  itemsByLabel items keyed by the tree's own labels
//
// Item categories are matched to tree labels loosely (see labelKey).
// Anything still unmatched is appended as its own top-level category, so
// no dish ever silently disappears.
//  originalLabelOf  translated label -> original title, only where they
//                   differ (shown under headings in translated menus)
//  iconKeyOf        label -> icon key, decided from the ORIGINAL title
//
// originalMenu is { items, categoryOrder } of the original-language menu
// (hooks/useOriginalMenu), or null.
export function buildCategoryTree(categoryOrder, categories, itemsByCategory, locale, originalMenu) {
  const originalItems = originalMenu ? originalMenu.items : null;
  const source = parseTree(categoryOrder) || categories || [];
  let nodes = source.map(normalizeNode);

  const labelByKey = new Map();
  walk(nodes, (n) => {
    const key = labelKey(n.label);
    if (!labelByKey.has(key)) labelByKey.set(key, n.label);
  });

  const fixGlued = hasBilingualPrefixBug(itemsByCategory, locale);
  const originals = locale && locale !== "bg" ? indexOriginals(originalItems) : null;
  const itemsByLabel = {};
  const orphans = [];
  const order = categories && categories.length ? categories : Object.keys(itemsByCategory);
  for (const category of order) {
    const items = (itemsByCategory[category] || []).map((i) => {
      const out = localizeItem(i, fixGlued, originals);
      const original = originals ? originals.get(pairKey(i)) : null;
      if (original && original.category) out._original_category = original.category;
      return out;
    });
    let label = labelByKey.get(labelKey(category));
    if (!label) {
      label = category;
      labelByKey.set(labelKey(category), label);
      orphans.push(label);
    }
    itemsByLabel[label] = (itemsByLabel[label] || []).concat(items);
  }

  // Merged categories need re-sorting by the owner's order.
  for (const label of Object.keys(itemsByLabel)) {
    itemsByLabel[label].sort(
      (a, b) => (a.display_order_position ?? 0) - (b.display_order_position ?? 0)
    );
  }

  nodes = prune(nodes.concat(orphans.map((label) => ({ label, children: [] }))), itemsByLabel);

  const translated = Boolean(locale && locale !== "bg");
  const originalTitleOf = resolveOriginalTitles(
    nodes,
    originals ? originalLabels(itemsByLabel) : {},
    originalMenu ? originalMenu.categoryOrder : null,
    translated
  );
  const originalLabelOf = {};
  if (translated) {
    Object.entries(originalTitleOf).forEach(([label, title]) => {
      if (title && !sameText(title, label)) originalLabelOf[label] = title;
    });
  }

  return {
    nodes,
    itemsByLabel,
    originalLabelOf,
    iconKeyOf: resolveIconKeys(nodes, originalTitleOf),
  };
}

// Splits a trailing portion size ("…, 320 г", "50 мл", "750 мл кана")
// off the description so it can sit in its own WEIGHT slot, the way the
// reference design shows it. Returns { description, weight }.
const WEIGHT_RE =
  /(?:^|,\s*|\s+)(\d+(?:[.,]\d+)?\s*(?:гр|г|кг|мл|л|g|gr|kg|ml|l|cl|oz)\.?(?:\s+(?:кана|бутилка|чаша|jug|bottle|glass))?)\s*$/i;

export function splitWeight(text) {
  const source = (text || "").trim();
  if (!source) return { description: "", weight: "" };
  const match = source.match(WEIGHT_RE);
  if (!match) return { description: source, weight: "" };
  const description = source
    .slice(0, match.index)
    .replace(/[,\s]+$/, "")
    .trim();
  return { description, weight: match[1].trim() };
}

export function formatEuro(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return `${price} €`;
  return `${n.toFixed(2)} €`;
}

// Short teaser line for a category cover card: its sub-categories if it
// has any, otherwise the first few dishes.
export function coverSummary(node, itemsByCategory) {
  if (node.children.length > 0) {
    return node.children.map((c) => c.label).join(" · ");
  }
  const names = visibleItems(itemsByCategory, node.label).map((i) => i.name);
  const head = names.slice(0, 3).join(" · ");
  return names.length > 3 ? `${head} …` : head;
}
