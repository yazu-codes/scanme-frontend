# menuKit: shared layer for the diner, ladle, stitch, trattoria and flame themes

Five themes would otherwise copy the same ~1,500 lines of navigation,
translation fixes and dish/drawer UI. menuKit holds that once. Each theme
keeps only its **look**: palette, header, how dishes and sections are
drawn, footer, and stylesheet.

Lantern and Noir do **not** use menuKit (they are standalone), so nothing
here can affect them.

## What's in it

| File | What it does |
|---|---|
| `useMenuKit.js` | One hook: category tree, original-language pairing, hash navigation (`#c-<path>`), scroll-spy, dish sheet + drawer state with back-gesture closing, analytics, YummGPT `itemSelect`. |
| `useOwnerTheme.js` | Owner font (`useGoogleFont`), owner colours + theme fallbacks, contrast report, CSS variables, body background. |
| `colors.js` | `validHex`, `mix`, `rgba`, `strengthen`, `contrastRatio`, `bestOn`, `ownerPalette`, `kitTone` (the `--mk-*` variables), `useContrastReport`. |
| `menuData.js` | Noir's `utils.js` (tree, loose matching, leftovers, bilingual-prefix fix, pairing, icons, `splitWeight`) + `formatEuro` + `nodePathMap` + the Jaccard fix for parent-group originals. |
| `iconKeywords.js`, `components/CategoryIcon.jsx` | Noir's category icons, picked from the ORIGINAL title. |
| `hooks/` | `useHashNavigation`, `useScrollSpy`, `useBackToClose`, `useOriginalMenu`, `useReveal` (from Lantern/Noir). |
| `components/PinnedNav.jsx` | Category tabs + sub-category chips that pin with `position: fixed` + placeholder; publishes `--mk-pin-h`. |
| `components/MenuChrome.jsx` | Dish sheet, navigation drawer, scroll-to-top (bottom-left) and the three core widgets. |
| `components/Dish.jsx` | `pressable()`, `Allergens`, `OriginalName`, `dishKey` for themes' own dish markup. |
| `strings.js` | bg/en UI copy; `makeStrings({ bg, en })` adds theme keys. |
| `menu-kit.css` | Styles for the shared pieces. Classes `mk-`, variables `--mk-*`. |

## Rules for a theme built on it

- The root is `<div className="mk-root xx-root" style={vars} ref={kit.rootRef}>`.
- Every section anchor carries `data-mk-path={path}` (paths from the tree position: `"3"`, `"3-0-1"`).
- Colours: all from `useOwnerTheme` / the theme's `palette.js`. No hard-coded colours.
- Restyle shared pieces from the theme's CSS under its root: `.xx-root .mk-tab { … }`.
- Keep the pinned bar's height constant (don't add/remove borders when it pins), or landings drift.
- Memoise the menu body (`useMemo` on the tree data) so scrolling never re-renders it.

## Bugs fixed while building it (also fixed in Lantern)

1. **Drawer swallowed taps after closing.** An expanded branch had `visibility: visible`, which overrides the closed drawer's `visibility: hidden`: the branch stayed invisible but clickable over the page. Now `visibility: inherit`. Lantern had it too and is fixed in this delivery. **Noir has the same CSS pattern** (`.nr-tree-panel-open > ul { visibility: visible; }` in `noir-theme.css`) and was not changed; changing `visible` to `inherit` there should fix it.
2. **Wrong original for parent groups** (Noir): "Wine" showed "Алкохолни Напитки". Fixed with overlap ratio.
