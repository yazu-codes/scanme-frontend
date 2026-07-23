import { useEffect } from "react";
import { setMeta, setFavicon } from "../domHelpers";

// Keeps the document title, meta description/keywords, OG tags, and
// favicon in sync with whichever menu is currently loaded. SEO/sharing
// behavior — identical for every theme.
export default function useDocumentMeta(menu) {
  useEffect(() => {
    if (!menu) return;

    const owner = menu.menu_owner || {};
    const title = owner.menu_owner_name ? `${owner.menu_owner_name} | Menu` : "Menu";
    const description =
      owner.menu_owner_slogan || `View the menu for ${owner.menu_owner_name || "this restaurant"}`;
    const keywords = [owner.menu_owner_name, "menu", "restaurant", ...(menu.menu_items || []).map((i) => i.category)]
      .filter(Boolean)
      .join(", ");

    document.title = title;
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setFavicon(owner.menu_owner_logo_url);
    if (owner.menu_owner_logo_url) setMeta("og:image", owner.menu_owner_logo_url, true);
  }, [menu]);
}
