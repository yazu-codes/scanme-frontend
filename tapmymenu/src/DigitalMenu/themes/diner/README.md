# Diner theme

Built from your reference: **Retro Diner (pink sign, checkerboard)**. Enable with `"theme": "diner"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`), which provides the category tree, translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy, dish sheet, navigation drawer, back-gesture closing, analytics and the YummGPT / QR / language widgets. This folder holds only the look.

## Layout

- **Page:** a checkerboard (strong shade of the owner's text colour + their background) around a rounded menu card with a thick rim.
- **Sign:** the restaurant name in tall condensed caps on an accent badge with a script "Welcome", racing stripes running to the card edges, slogan in letter-spaced caps.
- **Board:** each top-level category gets a double-ruled banner; its sub-categories are boxes two-up on wide screens, each with an accent title and a round icon badge. Dishes are price-list lines: name, dotted leader, price; then the original name (translated menus), size, one-line description and allergen pills. Boxes with photos give every line a small 4:3 frame on the left (whole photo, never cropped).
- **Footer:** the reference's accent strip (hours · Wi-Fi · call) over dashed-ruled columns, each only when filled in.

Every theme also has: the pinned category tabs with sub-category chips (pin on scroll, follow the section being read), ☰ for the full tree with counts, a dish sheet that closes on ✕ / backdrop / Escape / back, `#c-<path>` links, scroll-to-top bottom-left, and the three widgets bottom-right.

## How owner colours map

Only `background_color` and `font_color` are used; no colour of the theme's own appears unless the owner left a value unset.

| Variable | From |
|---|---|
| `--dn-accent` (sign, titles, icon circles, strip) | `font_color` |
| `--dn-text` (dish names, prices) | `font_color` pushed further from the background, only when that reads better |
| `--dn-check` (checkerboard) | same as `--dn-text` |
| `--dn-panel` (menu card) | `background_color` nudged 35 % toward white (light) / black (dark) |
| `--dn-rim`, `--dn-dash` | mixes / alpha of the two |

Fallback (nothing set): cream `#F4EFE0` + cherry `#C2314B`.

`font_family` is the body font (via `useGoogleFont`), `font_size` scales everything (all sizes in `em`). Contrast below 3:1 logs a `console.warn`; 3–4.5:1 a `console.info`; owner colours are never changed.

## Fonts

Oswald (titles, tabs), Lobster (script). All have Cyrillic, loaded from Google Fonts in `diner-theme.css`.

## Files

```
diner/
  Theme.jsx          root: owner theme + menuKit + layout + MenuChrome
  palette.js         OWNER colours -> CSS variables (+ fallbacks)
  diner-theme.css    styles; classes dn-, shared pieces restyled as .dn-root .mk-*
  components/        header, board (sections + dishes), footer
```
