import useMenuData from "./hooks/useMenuData";
import useGroupedMenuItems from "./hooks/useGroupedMenuItems";
import useDocumentMeta from "./hooks/useDocumentMeta";

// ---------------------------------------------------------------------
// NON-NEGOTIABLE: this is the one hook every theme calls to get its
// data. It fetches, parses, groups, and syncs page metadata — nothing
// about how a menu is displayed lives here. A theme should never need
// to fetch or parse anything itself; if it needs a new piece of derived
// data, that logic belongs here, not in a theme file.
//
// Returns:
//   status          "loading" | "error" | "ready"
//   menu            raw menu object (rarely needed directly by a theme)
//   owner           menu.menu_owner, defaulted to {}
//   config          menu.menu_configuration, defaulted to {}
//   categories      ordered array of category names
//   itemsByCategory { [category]: item[] }, sorted by display order
// ---------------------------------------------------------------------
export default function useDigitalMenu(urlname) {
  const { menu, status } = useMenuData(urlname);
  useDocumentMeta(menu);
  const { categories, itemsByCategory } = useGroupedMenuItems(menu);

  const config = menu?.menu_configuration || {};
  const owner = menu?.menu_owner || {};

  return { status, menu, owner, config, categories, itemsByCategory };
}
