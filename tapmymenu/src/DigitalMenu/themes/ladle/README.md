# Ladle theme

Built from your reference: **Tin Ladle (slate chalkboard, hand-lettered)**. Enable with `"theme": "ladle"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`), which provides the category tree, translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy, dish sheet, navigation drawer, back-gesture closing, analytics and the YummGPT / QR / language widgets. This folder holds only the look.

## Layout

- **Page:** the owner background with a faint chalk-dust dot grain.
- **Header:** a small caps line, the name in a big rounded hand-lettered face with chalk star and heart doodles, a squiggle, the slogan in script.
- **Board:** each top-level category has a chalk title, squiggle and a tilted "sticker" with its item count; sub-categories are groups two-up on wide screens, each with a filled round icon and a script note (original title in translated menus, else the count). Dishes: bold name with the price on the right, two-line description, dashed allergen tags; groups with photos show a small 4:3 frame on the right.
- **Footer:** a round badge with phone and hours next to a chalk ladle, then Wi-Fi, reviews, legal line.

Every theme also has: the pinned category tabs with sub-category chips (pin on scroll, follow the section being read), ☰ for the full tree with counts, a dish sheet that closes on ✕ / backdrop / Escape / back, `#c-<path>` links, scroll-to-top bottom-left, and the three widgets bottom-right.

## How owner colours map

Only `background_color` and `font_color` are used; no colour of the theme's own appears unless the owner left a value unset.

| Variable | From |
|---|---|
| `--tl-ink`, text, doodles | `font_color` |
| `--tl-accent` (icon circles, stickers, hours badge) | `font_color`, with background-coloured glyphs. The reference's orange and red become the owner's text colour. |
| `--tl-chalk`, `--tl-dust` | `font_color` at 32 % / 7 % alpha |

Fallback (nothing set): slate `#46505F` + cream `#F7E8CC`.

`font_family` is the body font (via `useGoogleFont`), `font_size` scales everything (all sizes in `em`). Contrast below 3:1 logs a `console.warn`; 3–4.5:1 a `console.info`; owner colours are never changed.

## Fonts

Balsamiq Sans (headings), Caveat (script notes). All have Cyrillic, loaded from Google Fonts in `ladle-theme.css`.

## Files

```
ladle/
  Theme.jsx          root: owner theme + menuKit + layout + MenuChrome
  palette.js         OWNER colours -> CSS variables (+ fallbacks)
  ladle-theme.css    styles; classes tl-, shared pieces restyled as .tl-root .mk-*
  components/        header, board (sections + dishes), footer, ornaments
```
