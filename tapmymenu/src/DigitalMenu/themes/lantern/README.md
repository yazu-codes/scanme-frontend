# Lantern theme

A two-colour poster menu based on a classic Chinese-restaurant menu design:
a big centred header, a framed action row, large condensed category tabs,
and one colour band per category. Enable it per menu with
`"theme": "lantern"` in `menu_configuration` (registered in
`themes/index.js`).

## Flow

One long page, no splash.

1. **Poster header.** The owner logo sits in a ring (or, with no logo, a lantern ornament). Small-caps labels on either side give the category and item counts. Below that come the restaurant name in huge Rubik 900, a small "МЕНЮ" tag and the slogan.
2. **Framed action row.** **Меню** opens the full navigation. **Обаждане** is a `tel:` link, shown only with a phone number. **Информация** opens the drawer at the contacts, shown only with a phone, schedule or Wi-Fi.
3. **Category bar.** One big condensed tab per top-level category, then a chip row: **Всички** plus one chip per sub-category of the category you're reading. Both rows pin to the top once you scroll past them. The tab and chip for the section on screen light up as you scroll (scroll-spy) and stay centred in their rows. The ☰ button at the end of the tabs opens the drawer.
4. **Colour bands.** Each top-level category is a band. Bands alternate between the owner palette and the owner palette **inverted** (see below). A small cloud or bowl ornament sits on each band's top edge. Sub-categories get a ruled heading with an item count, at any depth.
   - Sections with photos use **poster cards**: the whole photo in a 4:3 frame (never cropped), name, allergen pills, price, portion size and a two-line description. Phones show 1 column, tablets 2, desktop 3.
   - Sections with no photos (drinks) use **compact rows**: name, dotted leader, price, then size and a one-line description. Desktop shows 2 columns.
5. **Dish detail.** A bottom sheet on phones and a centred card from 640 px up. It shows the photo, category, name, description, the staff block (translated menus), portion, allergens and price. It closes on ✕, a backdrop tap, Escape or the **back gesture**.
6. **Navigation drawer.** Full screen, in the inverted palette. It shows the whole category tree with item counts, expandable at every level, with the current category expanded and underlined. Contacts and review links follow.
7. **Footer.** Name, slogan, contacts and review links.

## How owner colours map

Everything comes from `background_color` (**bg**) and `font_color` (**ink**). `useThemeVars.js` derives all other colours from those two:

| Tone | Page | Text | Used for |
|---|---|---|---|
| A | bg | ink | header, odd bands, pinned bar, dish detail, footer |
| B | ink | bg | even bands, drawer, scroll-to-top |

Within a tone:

- **surface / card:** the page colour mixed 6 % / 12 % toward black (light page) or white (dark page)
- **lines:** text colour at 18 % / 55 % alpha
- **muted / faint text:** text colour at 78 % / 55 % alpha
- **backdrop:** the page colour darkened, at 62 % alpha

Tone B is just the two owner colours swapped, so **both tones have exactly the owner's contrast ratio**, and the theme introduces no colour of its own. The widget accent is `font_color`.

`font_family` is the body font (via `useGoogleFont`). `font_size` is the root size, and every size is in `em`.

**Fallbacks (only for unset values):**

- neither colour set: `#A8161B` lantern red with `#FFC93C` gold (about 5:1)
- only `background_color` set: `#1A1A1A` or `#F2F2F2` text, whichever suits the background

**Contrast.** The theme never changes owner colours. When `ink` on `bg` is below 3:1 it logs a `console.warn` with the ratio. Between 3:1 and 4.5:1 it logs a `console.info`. A non-hex value logs a warning and falls back to the theme palette.

## Navigation and history

- Every category tap (tab, chip or drawer) pushes `#c-<path>`. `#c-3` is the fourth top-level category, and `#c-3-0-1-0` is a sub-sub-sub-category inside it. The back gesture returns to the previous section, and a shared link lands on its section.
- An open dish or drawer pushes a same-URL history entry, so back closes it. Closing with ✕, the backdrop or Escape steps back over that entry. Picking a category in the drawer *replaces* that entry, so no dead entries pile up.
- Sections land just below the pinned bar through `scroll-margin-top: var(--ln-pin-h)`. The bar's height is measured with a `ResizeObserver`. The chip row has a constant height (for a category with no sub-categories it shows the item count), so every landing is exact.
- Long jumps skip most of the distance instantly and glide the last screen, so a tap never animates for long.

## Kept from the other themes

- The YummGPT, QR and language widgets are unchanged, in the bottom-right corner, with `accentColor` = owner `font_color`. They mount straight away (there is no intro), so their 2-second hints are seen.
- A dish tapped in YummGPT opens the same detail sheet, looked up by `pairKey` so it shows the cleaned name, original and photo.
- Scroll-to-top sits bottom-**left**.
- Analytics: `item_click` (`urlname/slug-or-name`) and `category_click` (`urlname/label`).

## Data layer and known workarounds

`utils.js` and `hooks/useOriginalMenu.js` are copied from Noir (the reference). All of Noir's handling is kept:

- loose matching of category names
- leftover categories appended at the top level
- empty categories hidden
- `enabled` ignored
- glued `"<bg> / <en>"` names stripped, switching itself off once the API is fixed
- originals and photos paired by `display_order_position + price`
- duplicate keys never guessed

Changes from Noir:

- Category icons removed (Lantern doesn't use them).
- **Bug fix in `resolveOriginalTitles`.** A parent group with no dishes of its own gets its original title from the original `category_order` node whose sub-categories overlap most. Noir counts raw overlap, so "Wine" tied with its own parent "Alcoholic drinks" and the parent won: **Wine showed "Алкохолни Напитки" as its original.** Lantern scores by overlap ratio (Jaccard), so the most specific group wins. **`themes/noir/utils.js` still has this bug.**
- `formatEuro` uses core's `formatPrice` + " €", as the guide asks (for example `14 €`, `8.50 €`).
- `nodePathMap()` added for the hash paths.

## Fixed after the first delivery

- **Closed drawer could swallow taps.** An expanded category branch kept `visibility: visible`, which overrides the closed drawer's `visibility: hidden`. The branch stayed invisible but clickable over the page. It is now `visibility: inherit` (`lantern-theme.css`, `.ln-tree-panel-open > .ln-tree-sub`).

## Fonts

- **Rubik 900** for the restaurant name, and **Oswald 500–700** for tabs, headings and labels. Both support Cyrillic and load from Google Fonts in `lantern-theme.css`.
- Body text uses the owner's font.

## Files

```
lantern/
  Theme.jsx                 props in -> tree -> page + widgets
  lantern-theme.css         all styles, every class ln-, every var --ln-
  useThemeVars.js           OWNER colours -> CSS variables, contrast check
  strings.js                bg / en (other locales -> en)
  utils.js                  category tree + translation fixes (from Noir)
  hooks/useOriginalMenu.js  one-time original-language request (from Noir)
  hooks/useReveal.js        fade-in on scroll (from Noir; opacity only)
  hooks/useHashNavigation.js  #c-<path> history, landing, shared links
  hooks/useBackToClose.js   back gesture closes dish detail / drawer
  hooks/useScrollSpy.js     active tab + chip, scroll-to-top visibility
  components/               Hero, ActionBar, PinnedNav, Section, DishCard
                            (+ DishRow), DishModal, NavDrawer, Footer,
                            ContactBlocks, ScrollToTopButton, Ornaments, Icons
```

## Tested

These were tested with a mock bg/en menu of 101 dishes. The mock had four nesting levels, a sub-category named "Винпром -Троян" against "Винпром - Троян", a leftover category, an empty category, a 60-cocktail list and the API's translation bugs.

- **Data:** all 101 dishes appear in bg and en. In en: no glued names, 99 correct originals, and photos restored. Two dishes share a pairing key, so they correctly show no original. Every category heading shows the right original.
- **Owner colours:** dark/light, light/dark, saturated brand colour, no colours set, and a low-contrast palette (warning logged). Also tested with `font_size` 20, an owner with no fields set, and a failed originals request (translations only).
- **Navigation:** tabs, chips and drawer land on the section within 3 px, at 360, 390, 768 and 1280 px. Back returns to the previous section. The dish detail and drawer close with back, Escape and a backdrop tap without leaving dead history entries. Scroll-spy follows manual scrolling.
- **Widgets:** a YummGPT item from the raw (glued) API response opens "Kavarma" with "Кавърма". Hints are gone after 2 s. The analytics events fire.
- **Quality:** no horizontal scroll at any width tested. ESLint (`react-app` config, `exhaustive-deps` as an error, `--max-warnings 0`) passes. No console errors.
