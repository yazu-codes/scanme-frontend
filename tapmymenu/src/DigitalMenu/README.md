# DigitalMenu structure

```
DigitalMenu/
  index.jsx              <- entry point: <DigitalMenu urlname="..." theme="classic" />
  core/                  <- NEVER CHANGES. Fetching, parsing, DOM/meta side effects.
    constants.js
    utils.js
    domHelpers.js
    hooks/
      useMenuData.js         fetches the menu JSON
      useGroupedMenuItems.js groups + sorts items by category
      useDocumentMeta.js     syncs <title>/meta tags/favicon
    useDigitalMenu.js     <- the one hook every theme calls to get data
    index.js              <- barrel export: `import { ... } from "../../core"`
  themes/                 <- ALL design/UI/UX. Swap freely, add new ones freely.
    index.js              <- registry, e.g. { classic: ClassicTheme, minimal: MinimalTheme }
    shared/hooks/          reusable UI *mechanics* any theme can opt into
      useBodyBackgroundSync.js
      usePanelScrollLock.js
      useCategoryScrollSpy.js
      useGoogleFont.js
    classic/               cards, photos, sticky pill nav, slide-in panel
      Theme.jsx
      theme.css
      useThemeVars.js
      components/
    minimal/                plain editorial list, inline expand, fixed palette
      Theme.jsx
      theme.css
      components/
```

## The rule

`core/` is the non-negotiable brain: fetching, parsing, sorting, price/allergen
formatting, meta-tag syncing. It has no opinion about how anything looks and
should never import from `themes/`.

`themes/` is everything visual/interactive. Every theme receives the exact
same data shape from `core/useDigitalMenu` — `{ status, owner, config,
categories, itemsByCategory }` — and is free to render it however it wants:
different markup, different CSS, different interaction patterns (Classic uses
a sticky nav + slide-in panel; Minimal uses a plain jump list + inline
accordion and ignores the menu's configured colors entirely).

## Adding a new theme

1. Copy `themes/minimal/` (simplest starting point) to `themes/<yourTheme>/`.
2. Edit `theme.css` and the components under `components/` — anything visual
   is fair game to rewrite.
3. Reuse whatever you want from `themes/shared/hooks/` (sticky nav + scroll
   spy, slide-in panel scroll lock, font loading) or skip them if your theme
   doesn't need that interaction pattern.
4. Register it in `themes/index.js`.
5. Use it: `<DigitalMenu urlname="..." theme="yourTheme" />`.

You should never need to touch `core/` to build a new theme. If a theme needs
a new piece of *derived data* (not styling), that logic belongs in `core/`
so every theme benefits from it — themes should only ever consume core, not
duplicate its logic.
