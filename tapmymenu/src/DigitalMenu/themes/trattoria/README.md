# Trattoria theme

Built from your reference: **Trattoria Coccoi (paper, italic serif, wooden sign)**. Enable with `"theme": "trattoria"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`), which provides the category tree, translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy, dish sheet, navigation drawer, back-gesture closing, analytics and the YummGPT / QR / language widgets. This folder holds only the look.

## Layout

- **Page:** the owner background with a fine grain; on wide screens a centred paper card (760 px) with a soft vignette and shadow.
- **Masthead:** letter-spaced small caps, the name in a heavy serif, the slogan in italic.
- **Sections:** one elegant column. Each heading has a small seal icon, the title, and an italic note on the right (original title in translated menus, else the count) over a double / single / dotted rule by depth. Dishes: serif name with the price on the right, italic description, small-caps allergens; with photos, a small framed 4:3 thumbnail on the right.
- **Footer:** the reference's wooden serving-board sign with a handle hole, lettered with hours and phone; then Wi-Fi, reviews, legal line.

Every theme also has: the pinned category tabs with sub-category chips (pin on scroll, follow the section being read), ☰ for the full tree with counts, a dish sheet that closes on ✕ / backdrop / Escape / back, `#c-<path>` links, scroll-to-top bottom-left, and the three widgets bottom-right.

## How owner colours map

Only `background_color` and `font_color` are used; no colour of the theme's own appears unless the owner left a value unset.

| Variable | From |
|---|---|
| `--tr-ink`, rules, seals | `font_color` |
| `--tr-board` (wooden sign) | `font_color`, lettered in the background colour |
| `--tr-card` (paper) | `background_color` nudged 25 % toward white (light) / black (dark) |
| `--tr-vignette` | background mixed 10 % toward `font_color` |

Fallback (nothing set): paper `#F6EFE2` + walnut `#4A2E2A`.

`font_family` is the body font (via `useGoogleFont`), `font_size` scales everything (all sizes in `em`). Contrast below 3:1 logs a `console.warn`; 3–4.5:1 a `console.info`; owner colours are never changed.

## Fonts

Playfair Display (headings), Lora (descriptions, notes). All have Cyrillic, loaded from Google Fonts in `trattoria-theme.css`.

## Files

```
trattoria/
  Theme.jsx          root: owner theme + menuKit + layout + MenuChrome
  palette.js         OWNER colours -> CSS variables (+ fallbacks)
  trattoria-theme.css    styles; classes tr-, shared pieces restyled as .tr-root .mk-*
  components/        header, board (sections + dishes), footer
```
