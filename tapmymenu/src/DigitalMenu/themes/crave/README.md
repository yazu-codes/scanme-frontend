# Crave theme

The menu as a social feed: built to be fun to use, quick to read on a
phone, and easy to share. Enable with `"theme": "crave"`.

Built on the shared **menuKit** (`themes/shared/menuKit/`): category tree,
translated-menu fixes, hash navigation, pinned tabs + chips, scroll-spy,
dish sheet, drawer, back-gesture closing, analytics and the YummGPT / QR /
language widgets. This folder holds the look and Crave's own features.

## Why it's built this way (creative brief)

- **Photos sell.** Two thirds of diners (77 % of 18–24s) prefer menus with dish photos, so photos lead everywhere and are never cropped.
- **Shareable moments.** Every dish can be shared as an image card or a link that opens that dish.
- **Motion with a job.** Every animation confirms a tap, guides the eye, or makes a dish more tempting; nothing animates just to fill space. All of it is transform/opacity only (smooth on cheap phones) and switches off for guests who prefer reduced motion.
- **No small print.** Big type, big touch targets.
- **Honest.** The API has no popularity data, so there are no invented "Trending" badges. "Promo" badges come only from the owner's own Promotions category.

## What guests see

**Home page**
- Kinetic header: the restaurant name bounces in letter by letter in four owner-derived colours, and leans with scroll speed.
- **Story bar:** every top-level category as a round "story" with a spinning colour ring and its first dish photo. Tap to jump there.
- A tilted **ticker** of the category names.
- Pinned category tabs (pill style) + sub-category chips, like every menuKit theme.
- Each category: a huge highlighted title, a count sticker and **▶ Swipe through** (opens the feed). Photo dishes are chunky sticker-style cards, a sideways swipe strip on phones and a grid on wide screens, with a wobbling price sticker, a **PROMO** badge where it applies and a ♥. Photo-less dishes (drinks) are punchy price lines with a ♥.

**The feed** (tap any photo card)
- One dish per screen, full height. Swipe up for the next (the category's photo dishes, in menu order). On wide screens it is a centred phone-width column.
- The photo floats on a blurred copy of itself with a slow zoom. The name slides in word by word and the price sticker pops.
- Right rail: **♥ Crave · ↗ Share · ⓘ Details · 🍽 Table** (with a count).
- **Double-tap the photo** to crave it: a heart and confetti burst, a short vibration on Android, and a toast.
- A progress bar and "3 / 14" at the top, plus a "swipe up" hint once per visit.
- Closes on ✕, Escape and the back gesture. ⓘ opens the normal detail sheet above the feed; back closes the sheet first, then the feed.

**My table**
- Every craved dish collects here: a floating **"My table · 3"** pill (bottom-centre, clear of the widgets and scroll-to-top).
- The list shows the original name in translated menus, the price, ✕ to remove, and the total.
- **Show to the staff**: big type with the **Bulgarian names first**, so the guest just turns the phone around.
- Saved **only on the guest's phone** (localStorage, per menu). It is not an order and nothing is sent. It survives a reload and a language switch.

**Sharing**
1. **Image card** (1080×1350: photo, name, description, price sticker, restaurant name, in the owner-derived colours) through the phone's share sheet.
2. If that isn't possible: the **link** through the share sheet.
3. Otherwise the link is copied ("Link copied").

The link is `…#d-<dish>`. It opens that dish's detail sheet, in **any language**: the id is the pairing key + original name, not a translated name or slug.

> ⚠️ **The image card needs CORS on your photo server.** The browser only lets a page turn a photo into a shareable image when the image host sends `Access-Control-Allow-Origin` for it. Without that, Crave quietly falls back to sharing the link. To enable cards, allow your menu domain (or `*`) on the image host / CDN.

## How owner colours map

Approved for this theme: companion colours are **derived** from the owner's `font_color` (ink) by rotating its hue, then nudged lighter/darker until each reads at least 3:1 on `background_color`:

| Variable | From | Used for |
|---|---|---|
| `--cv-pop1` | ink | price stickers, active tab, ticker, My table |
| `--cv-pop2` | ink rotated +55° | highlighter, chips, second sticker colour |
| `--cv-pop3` | ink rotated +180° (complement) | hearts, PROMO, confetti |
| `--cv-pop4` | ink rotated −60° | count stickers, fourth sticker colour |
| `--cv-on-popN` | best of bg / black / white on that pop | text on stickers |

If the owner's ink is a neutral (grey/black/white, saturation under 15 %), there is no hue to rotate, so the pops become **shades of ink** instead: a monochrome brand stays monochrome.

Fallback (nothing set): cream `#FFF4E6` + hot pink `#E0115F`.

`font_family` is the body font, `font_size` scales everything (em). Contrast below 3:1 logs a `console.warn`. Font: **Unbounded** (Cyrillic) for display.

## Analytics

- `item_click` fires when a dish opens in the feed or the detail sheet.
- `category_click` fires on tabs, chips, stories and ▶ Swipe through.

No new event names were added. If you want them, `crave`/`share` events are one line each in `Theme.jsx` (`toggleCrave`, `share`).

## Files

```
crave/
  Theme.jsx            root: owner colours + menuKit + home + feed + table
  palette.js           OWNER colours -> CSS variables, hue-derived pops
  crave-theme.css      styles (cv-), shared pieces restyled as .cv-root .mk-*
  share.js             image card (canvas) -> link -> clipboard
  haptics.js           navigator.vibrate, safely
  hooks/useCraves.js   My table, per menu, on the device
  hooks/useDishLink.js #d-<dish> links
  hooks/useScrollVelocity.js  kinetic lean (CSS variable, no re-renders)
  components/          Hero (kinetic name, stories), Marquee, Board (cards,
                       lines), Feed, TableSheet, TableButton, Bursts, Toast,
                       Heart, Blobs
```
