import { useMemo } from "react";

// Groups items by category, respecting display_order_position within a
// category, and category order of first appearance. Returns
// { categories, itemsByCategory }. This ordering/grouping logic is the
// same no matter which theme renders the result.
export default function useGroupedMenuItems(menu) {
  return useMemo(() => {
    const items = menu?.menu_items || [];
    const order = [];
    const grouped = {};

    for (const item of items) {
      const cat = item.category || "Other";
      if (!grouped[cat]) {
        grouped[cat] = [];
        order.push(cat);
      }
      grouped[cat].push(item);
    }

    for (const cat of order) {
      grouped[cat].sort(
        (a, b) => (a.display_order_position ?? 0) - (b.display_order_position ?? 0)
      );
    }

    return { categories: order, itemsByCategory: grouped };
  }, [menu]);
}
