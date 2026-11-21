# Flame theme

Built from your reference: **the pizza & burger flyer (fire, brush strokes)**. Enable with `"theme": "flame"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`), which provides the category tree, translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy, dish sheet, navigation drawer, back-gesture closing, analytics and the YummGPT / QR / language widgets. This folder holds only the look.

## Layout

- **Page:** the owner background lit with a fire glow toward the owner's text colour at the top and burnt darker at the edges, with slowly drifting embers (static with reduced motion).
- **Hero:** the name in condensed caps, a huge slanted **МЕНЮ / MENU**, the slogan, then the **first two categories that have photos**, each shown by one of its dishes (whole photo floating on a glow) over a brush-stroke label that jumps to that category.
- **Board:** each top-level category under a big brush-stroke banner; sub-categories get slanted heavy titles with a rule. Photo dishes are cards (1 / 2 / 3 columns); text dishes are flyer lines: NAME in caps, then the description running into a dotted leader that ends at the price.
- **Footer:** a glowing call button, then hours, Wi-Fi, reviews, legal line.

Every theme also has: the pinned category tabs with sub-category chips (pin on scroll, follow the section being read), ☰ for the full tree with counts, a dish sheet that closes on ✕ / backdrop / Escape / back, `#c-<path>` links, scroll-to-top bottom-left, and the three widgets bottom-right.

## How owner colours map

Only `background_color` and `font_color` are used; no colour of the theme's own appears unless the owner left a value unset.

| Variable | From |
|---|---|
| `--fl-accent` (MENU, brush strokes, prices) | `font_color` |
| `--fl-text` (names) | `font_color` pushed further from the background, only when that reads better (the reference's white on red) |
| `--fl-glow`, `--fl-deep` | background mixed toward / away from `font_color` |
| `--fl-ember`, `--fl-halo` | `font_color` at low alpha |

Fallback (nothing set): fire red `#7E0F12` + amber `#FFB627`.

`font_family` is the body font (via `useGoogleFont`), `font_size` scales everything (all sizes in `em`). Contrast below 3:1 logs a `console.warn`; 3–4.5:1 a `console.info`; owner colours are never changed.

## Fonts

Rubik 900 italic (MENU, banners, prices), Oswald (names, tabs). All have Cyrillic, loaded from Google Fonts in `flame-theme.css`.

## Files

```
flame/
  Theme.jsx          root: owner theme + menuKit + layout + MenuChrome
  palette.js         OWNER colours -> CSS variables (+ fallbacks)
  flame-theme.css    styles; classes fl-, shared pieces restyled as .fl-root .mk-*
  components/        header, board (sections + dishes), footer, ornaments
```
