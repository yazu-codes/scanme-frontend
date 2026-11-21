import { useEffect, useRef } from "react";
import { dishIdentity } from "../../shared/menuKit";

// Share-a-dish links: …/menu#d-<id> opens that dish's detail sheet.
// The id is the dish's identity (pairing key + ORIGINAL name), which is
// the same in every language, so a link shared from the English menu
// also opens the dish in Bulgarian. (Slugs are not used: they may exist
// in one language's response and not in the other.)
export function dishId(item) {
  return `k-${dishIdentity(item)}`;
}

export function dishUrl(item) {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}#d-${encodeURIComponent(dishId(item))}`;
}

export function findDish(itemsByLabel, id) {
  for (const list of Object.values(itemsByLabel)) {
    const hit = list.find((i) => id === dishId(i));
    if (hit) return hit;
  }
  return null;
}

// Open the dish named in the hash once it can be found. In a translated
// menu the originals (part of the id) arrive a moment after the menu, so
// this retries whenever the items change, until it finds the dish once.
export default function useDishLink({ ready, itemsByLabel, onOpen }) {
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    const m = /^#d-(.+)$/.exec(window.location.hash || "");
    if (!m) {
      done.current = true;
      return;
    }
    let id = m[1];
    try {
      id = decodeURIComponent(id);
    } catch (e) {
      done.current = true;
      return;
    }
    const item = findDish(itemsByLabel, id);
    if (item) {
      done.current = true;
      onOpen(item);
    }
  }, [ready, itemsByLabel, onOpen]);
}
