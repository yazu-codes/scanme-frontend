# Noir theme

Dark fine-dining layout modelled on a restaurant-website menu. Enable it per
menu with `"theme": "noir"` in `menu_configuration` (registered in
`themes/index.js`).

## Flow

1. **Splash.** The owner logo reveals itself with a sweep and blur, then the name settles in with wide letter-spacing.
2. **Cover page.** "Explore our menu / Menu", then one photo card per top-level category from `category_order`. Each card shows the item count, the title, the diamonds, a short teaser and a **VIEW MENU** button. Cards fade up as they scroll in.
3. **Category page.** VIEW MENU replays the splash, then shows the category. A horizontal strip of line icons lists every category. The active one sits on a champagne tile and is kept centred, with a scroll-position thumb under the strip. Once you scroll, the strip pins to the top, the header steps aside and BG / EN moves into the strip.
   - Sections with photos use photo cards: name, two-line description, portion size, price.
   - Sections without any photos (typically drinks) use the text-only list layout.
   - Child categories become sub-headings.
   - **BACK TO MAIN MENU** ends the page.
4. **Dish detail.** A centred card over a blurred page shows the category, name, diamonds, full description, weight, allergens and price.
5. **Hamburger.** A full-screen menu lists the categories, contacts (phone, `working_schedule`, `wifi`) and `review_links`.
6. **Back button.** Every page change goes through the splash. It is mirrored to `#c-<index>` in the URL, so the phone's back gesture returns to the cover and category links can be shared.

## Kept from the other themes

- The YummGPT chat, QR sharing and language widgets are unchanged, in the bottom-right corner. Their accent colour is the theme gold.
- The scroll-to-top button sits bottom-**left** so it never overlaps the widgets.
- The header's BG / EN toggle writes the same `app_locale` cookie through `changeLocaleAndReload`, so it always agrees with the LocaleWidget.

## Notes

- **Owner colours are ignored.** The look is a fixed palette, the same approach the Minimal theme takes. Set `USE_OWNER_PALETTE = true` in `useThemeVars.js` and `background_color`, `font_color` and `font_family` drive it instead. `font_size` is always respected.
- **Portion sizes are split from descriptions.** A trailing size such as "…, 320 г", "50 мл" or "750 мл кана" is pulled out of the description into the WEIGHT slot (`utils.js → splitWeight`).
- **No dish is lost to a category-name mismatch.** Item categories are matched to `category_order` loosely, ignoring case and spacing around `-`, `/` and `,`, so "Винпром -Троян" and "Винпром - Троян" are the same category. Anything still unmatched is appended as its own top-level group. Empty categories are hidden.
- **`enabled` is not used.** The API already omits disabled items, and the translated response currently sends every item as `enabled: false`.
- **Translated menus show both languages.** In any locale other than `bg`, every dish shows its translated name with the original Bulgarian name underneath. The dish detail card adds a framed "Show this to our staff" panel with the original name and description. Category headings show the original category name too. This lets guests point at the dish and the staff know exactly what they mean.
  - The originals come from a second, one-time request for the Bulgarian menu (`hooks/useOriginalMenu.js`). Each translated item is paired with its original by `display_order_position` + `price`, which is unique per dish.
  - The Bulgarian half the translated API glues onto each name can't be used: it currently belongs to a *different* dish.
  - The same pairing restores the photos the translated response drops.
  - If that request fails, the menu shows translations only, never a wrong original.
- **Workaround for the translated API (`?lang=en`):** names and descriptions arrive as "<another item's Bulgarian text> / <this item's English text>". When most of a menu's names have that shape and the locale isn't `bg`, the theme keeps only the English part as the translated name (`utils.js → stripBilingualPrefix`). It switches itself off once the API is fixed. Delete it then.
- **The strip uses `position: fixed` with a placeholder, not `sticky`.** The shared `useBodyBackgroundSync` sets `overflow-x: hidden` on `<html>` and `<body>`, which breaks `sticky`.
- **Fonts.** Cormorant Garamond (display) and Jost (body), both with Cyrillic, loaded from Google Fonts in `noir-theme.css`.
- **Analytics.** Besides `item_click`, the theme sends `category_click` (`urlname/category`).
