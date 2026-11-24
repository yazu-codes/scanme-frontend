# Ember theme

A modern shisha-lounge menu in the spirit of **Noir**, played like a
**video game's level select**. Enable with `"theme": "ember"`.

## The idea

Like Noir, each part of the menu is its own screen, but at **every** depth:

```
home (level select)  ->  category  ->  sub-category  ->  …  ->  dishes
```

- **Home / title screen:** emblem, name, slogan, then **SELECT** and one tile per top-level category: code (`01`), picture (first dish photo, or the category icon), name, number of dishes, ▸. Contacts at the bottom.
- **A category:** big code (`05·01`) + name + count, then its sub-categories as **level tiles**, and/or its own dishes as **dish tiles**.
- **Dish tiles:** picture (whole photo, never cropped, or the category icon), name, price. **Nothing else.** Description, portion, allergens and the "show this to our staff" block live in the detail sheet.
- **Shisha** (categories titled Наргиле / Шиша / Кальян / Тютюн / Shisha / Hookah…): everything inside wears the hookah icon, and flavour tiles add up to 3 flavour-note chips taken from the description ("мента, лимон, лед").

**Game feel:**
- **HUD** always on top: ◀ one level up, the level code + name (+ parent), ☰ the **map** (the full tree with counts; "you are here" expanded).
- **Zoom-in** when entering a level, **zoom-out** going back (0.42 s, blur-to-sharp).
- Tiles drop in on a short stagger; the selected tile gets a brass edge, a glow and a light sweep. Pressing squeezes it.
- **Explored marks:** a level's diamond fills in once visited (remembered for the visit).
- A blinking **SELECT** prompt on the title screen.
- Lounge ambience behind everything: a slowly breathing ember glow, faint smoke, film grain.

Reduced motion: no zooms, staggers, glow breathing or smoke drift.

## Navigation & links

- Every level is mirrored to the hash: `#c-4-0-1-0` = 5th category → 1st sub → 2nd sub → 1st sub. Each step is a history entry, so the **phone's back gesture goes up one level**. ◀ in the HUD does the same.
- A shared link opens that level directly.
- Picking a level on the **map** replaces the map's own history entry, so back returns to where the guest was.
- The dish sheet and the map close with back, ✕, Escape or a backdrop tap, without leaving the level.
- Analytics: `category_click` on every level entered, `item_click` on every dish opened.

Built on menuKit with `sections: false`: the kit's long-page scrolling
navigation is off, and `hooks/useLevels.js` handles levels and history.

**Intentional difference from the guide:** inside a category, the guide asks
for sub-category chips with "All" plus scroll-spy. In Ember, sub-categories
are reached as level tiles instead (one level per screen), as requested.
Everything stays reachable: the test crawls every level and finds all
dishes in bg and en.

## The dish sheet

Mobile first:
- A bottom sheet with a grab handle. The ✕ stays reachable while it scrolls, and the photo is capped in height so the dish name shows straight away.
- Spacing: 1.5em sides, 1.25em between blocks.
- The category is a coloured pill, and the name uses the serif with the original in italic.
- "Show this to our staff" is a tinted panel with a brass edge.
- Portion and allergens sit in two small "stat" tiles.
- The price is pinned to the bottom, clear of the phone's home bar.
- On desktop it becomes a centred card.

**Colour from the background:** three richer tones are derived from the
owner's `background_color` hue (the hue itself, +35°, −35°, with more
saturation) and used for the sheet's gradient, panels and price bar:
`--em-c1..3`. Each is darkened (dark page) or lightened (light page) until the
owner's text reads at least 4.5:1 on it. A near-grey background has no
hue, so it borrows the text colour's hue. Examples:
- near-black → burgundy / amber
- deep green → emerald / teal
- cream → soft pastels

## Colours & fonts

Only the owner's `background_color` + `font_color`. Brass lines, glow,
smoke and glass are the owner's text colour at low alpha. Designed for a
dark background with a warm text colour:

| Look | `background_color` | `font_color` |
|---|---|---|
| Near-black + brass (fallback) | `#0D0B0A` | `#E3B778` |
| Deep green + gold | `#0F1A16` | `#D9C08A` |

Fonts: **Cormorant Garamond** (names, titles, prices) and **Jost** (small
tracked labels) are built in, as in Noir. Body text uses the owner's
`font_family`. **Montserrat** (or Inter) is the closest whitelisted match.

## Files

```
ember/
  Theme.jsx              root: owner colours + menuKit (sections: false) + levels
  palette.js             OWNER colours -> CSS variables
  ember-theme.css        styles (em-), shared pieces restyled as .em-root .mk-*
  utils.js               flavour notes, level codes
  hooks/useLevels.js     one level per screen, hash, history, explored marks
  components/            Hud, Header (title screen), Level (screen),
                         Tiles (LevelTile, ItemTile), Ambience, Footer
```
