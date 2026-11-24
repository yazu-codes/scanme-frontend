# Ember theme

A modern shisha-lounge menu in the spirit of **Noir**: dark, quiet and
editorial, lit like a Western lounge (one warm glow, brass lines, smoked
glass, a little smoke). Enable with `"theme": "ember"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`): category tree,
translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy,
dish sheet, drawer, back-gesture closing, analytics, YummGPT / QR /
language widgets. This folder holds only the look.

## Design

- **Light, not ornament.** No arabesques or clip-art hookahs. An **ember glow** low in the room breathes slowly (7 s), a fainter one sits up top, three soft **smoke wisps** drift upward, and a fine film grain keeps the dark from looking flat. All are fixed behind the menu, transform/opacity only, and static for reduced motion.
- **Masthead** (Noir's spirit): a hookah emblem (or the owner logo) in a thin brass ring, a tracked "LOUNGE · 109 ITEMS", the name in light **Cormorant Garamond**, an italic slogan, a brass hairline with a diamond.
- **Category rail:** numbered smoked-glass "books" (01, 02 …), each with a photo or icon, serif title, original title and count. Tap to jump.
- **Pinned bar:** frosted glass, tracked **Jost** small caps, and the active tab glows.
- **Sections:** number, big serif title, italic original, item count, brass hairline. Sub-categories get italic serif headings.
- **Shisha flavours** (any category whose ORIGINAL title is a shisha word; see below): smoked-glass **tiles** (2 / 3 / 4 columns) that light up like a coal when touched. Each shows the flavour name and its **flavour notes as chips, taken from the owner's description** ("мента, лимон и лед" → мента · лимон · лед). A longer free-text description is shown as text instead.
- **Dishes with photos:** glass cards with the whole photo (4:3, never cropped) on the left.
- **Drinks and everything else:** quiet lines (serif name, fading brass rule, price).
- **Footer:** a glass panel with contacts, reviews, name.

**Honest by design:** the API has no strength, popularity or "trending" data, so Ember shows none.

## Shisha detection

The kit now has a **hookah** category icon and rule. Original titles starting with
`наргиле`, `шиша`, `кальян`, `тютюн`, `shisha`, `hookah`, `nargile`,
`narghile` or `tobacco` get it, and their whole subtree becomes flavour
tiles. Other themes simply show the new hookah icon for such categories.

## How owner colours map

Only `background_color` (bg) and `font_color` (ink):

| Variable | From |
|---|---|
| text, prices | ink |
| `--em-brass` / `--em-brass-strong` (hairlines, chip outlines) | ink at 35 % / 70 % |
| `--em-glow` (ember light, hover glow) | ink at 26 % |
| `--em-smoke` | ink at 6 % |
| `--em-glass` (smoked glass) | bg lifted 8 % toward white (dark bg) / black (light bg), 55 % opaque + blur |

Designed for a dark owner background. On a light one it still works and
becomes a soft, daylight version. Fallback (nothing set): near-black
`#0D0B0A` + brass `#E3B778`. Contrast below 3:1 logs a `console.warn`.

## Files

```
ember/
  Theme.jsx          root: owner colours + menuKit + layout
  palette.js         OWNER colours -> CSS variables
  ember-theme.css    styles (em-), shared pieces restyled as .em-root .mk-*
  components/        Ambience (glow, smoke, grain), Header, Covers (rail),
                     Board (flavour tiles, glass cards, lines), Footer
```
