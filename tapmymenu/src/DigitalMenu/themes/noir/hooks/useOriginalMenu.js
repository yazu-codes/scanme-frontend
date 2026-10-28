import { useEffect, useState } from "react";
import { API_BASE } from "../../../core/constants";

// When the menu is shown in a translated language, Noir shows each dish's
// original (Bulgarian) name next to the translation, so a guest can point
// at it and the staff know exactly which dish is meant.
//
// That original has to come from the untranslated menu itself: the
// translated API response does carry a "<bg> / <en>" pair in each name,
// but its Bulgarian half currently belongs to a DIFFERENT dish (and the
// response has no photos). So for any locale other than "bg" this loads
// the original-language menu once, and utils.js pairs each translated
// item with its original by display_order_position + price, which is
// unique per item.
//
// Returns the original menu_items array, or null while loading, when not
// needed, or if the request fails (the theme then shows translations only).

const ORIGINAL_LOCALE = "bg";
const cache = new Map();

export default function useOriginalMenu(urlname, locale, enabled) {
  const needed = Boolean(enabled && urlname && locale && locale !== ORIGINAL_LOCALE);
  const [items, setItems] = useState(() => (needed ? cache.get(urlname) || null : null));

  useEffect(() => {
    if (!needed) {
      setItems(null);
      return undefined;
    }
    if (cache.has(urlname)) {
      setItems(cache.get(urlname));
      return undefined;
    }
    let cancelled = false;
    fetch(`https://${API_BASE}/${urlname}?lang=${ORIGINAL_LOCALE}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = (data && data.menu && data.menu.menu_items) || [];
        cache.set(urlname, list);
        if (!cancelled) setItems(list);
      })
      .catch((err) => {
        console.warn("Noir: could not load original-language menu", err);
      });
    return () => {
      cancelled = true;
    };
  }, [needed, urlname]);

  return items;
}
