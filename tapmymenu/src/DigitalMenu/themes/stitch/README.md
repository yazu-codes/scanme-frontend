# Stitch theme

Built from your reference: **The Darning Egg (cross-stitch sampler)**. Enable with `"theme": "stitch"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`), which provides the category tree, translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy, dish sheet, navigation drawer, back-gesture closing, analytics and the YummGPT / QR / language widgets. This folder holds only the look.

## Layout

- **Page:** the owner background with a faint Aida-cloth weave grid.
- **Header:** the alphabet stitched across the top **in the guest's language** (Cyrillic in bg), a row of × stitches, the name in blocky stitch letters with each word in the next thread shade, the slogan, another stitch row.
- **Board:** each top-level category has a stitched title, count and a short stitch row; sub-categories are **double dashed-stitch frames** two-up on wide screens, cycling through three thread shades, each with an icon and title in its thread. Dishes: bold name, price in stitch letters on the right, italic description, dashed allergen tags; frames with photos show a small dashed 4:3 "hoop".
- **Footer:** phone and hours in stitch letters between stitch rows.

Every theme also has: the pinned category tabs with sub-category chips (pin on scroll, follow the section being read), ☰ for the full tree with counts, a dish sheet that closes on ✕ / backdrop / Escape / back, `#c-<path>` links, scroll-to-top bottom-left, and the three widgets bottom-right.

## How owner colours map

Only `background_color` and `font_color` are used; no colour of the theme's own appears unless the owner left a value unset.

The reference's red / green / blue threads become **three shades of `font_color`**:

| Variable | From |
|---|---|
| `--st-t1` | `font_color` |
| `--st-t2` | `font_color` pushed 40 % further from the background |
| `--st-t3` | `font_color` softened 30 % toward the background |

A shade that would read worse than 3:1 on the background falls back to `font_color`, so no thread is too faint for its heading.

Fallback (nothing set): linen `#F3EBDD` + madder red `#A33A3A`.

`font_family` is the body font (via `useGoogleFont`), `font_size` scales everything (all sizes in `em`). Contrast below 3:1 logs a `console.warn`; 3–4.5:1 a `console.info`; owner colours are never changed.

## Fonts

Tiny5 (one weight; display text is never set bold). Pixelify Sans was tried first and rejected: its Cyrillic С/К and the digit 5 are hard to read at menu sizes.. All have Cyrillic, loaded from Google Fonts in `stitch-theme.css`.

## Files

```
stitch/
  Theme.jsx          root: owner theme + menuKit + layout + MenuChrome
  palette.js         OWNER colours -> CSS variables (+ fallbacks)
  stitch-theme.css    styles; classes st-, shared pieces restyled as .st-root .mk-*
  components/        header, board (sections + dishes), footer, ornaments
```
