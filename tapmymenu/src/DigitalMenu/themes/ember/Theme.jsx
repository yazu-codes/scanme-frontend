import React, { useCallback, useMemo } from "react";
import {
  CategoryIcon,
  MenuChrome,
  StatusScreen,
  makeStrings,
  useMenuKit,
  useOwnerTheme,
} from "../shared/menuKit";
import "./ember-theme.css";
import { EMBER_FALLBACK_BG, EMBER_FALLBACK_INK, emberVars } from "./palette";
import useLevels, { parentPath } from "./hooks/useLevels";
import Ambience from "./components/Ambience";
import Hud from "./components/Hud";
import Header from "./components/Header";
import Level, { isShishaPath, shishaItemSet } from "./components/Level";
import Footer from "./components/Footer";

const getStrings = makeStrings({
  bg: {
    lounge: "Lounge",
    select: "Изберете",
    here: "Предложения",
    back: "Назад",
    explored: "Разгледано",
  },
  en: {
    lounge: "Lounge",
    select: "Select",
    here: "On the menu",
    back: "Back",
    explored: "Explored",
  },
});

// "Ember": a shisha-lounge menu in Noir's spirit, played like a game's
// level select. One level of the menu per screen: home -> category ->
// sub-category -> … -> dishes, with a HUD (◀ up, level code + name,
// ☰ map), zoom transitions between levels, glowing tiles and "explored"
// marks. Very little text on screen: dishes show picture, name and price;
// the rest is in the detail sheet.
//
// From menuKit: the category tree + translated-menu fixes, the dish
// sheet, the map (drawer), back-gesture closing, analytics and the
// widgets. The long-page navigation is off (sections: false); levels,
// history and the hash are handled by hooks/useLevels.js.
export default function EmberTheme(props) {
  const { owner, config, urlname } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Ember",
    fallbackBg: EMBER_FALLBACK_BG,
    fallbackInk: EMBER_FALLBACK_INK,
    makeVars: emberVars,
  });

  const kit = useMenuKit(props, { getStrings, sections: false });
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem, pathMap, rootRef, ready } = kit;
  const { trackCategory, closeDrawerForNav } = kit;

  const { path, dir, explored, go, up } = useLevels({ ready, pathMap, urlname, onEnter: trackCategory });
  const entry = path != null ? pathMap.get(path) : null;
  const node = entry ? entry.node : null;
  const parent = path != null ? pathMap.get(parentPath(path)) : null;

  const openLevel = useCallback((p) => go(p), [go]);
  // From the map (drawer): its history entry is replaced by the level.
  const openFromMap = useCallback(
    (p) => {
      trackCategory(p);
      closeDrawerForNav();
      go(p, { replace: true });
    },
    [trackCategory, closeDrawerForNav, go]
  );

  // Photo-less dishes show their category's icon in the detail sheet
  // (hookah for anything under a shisha category).
  const iconOfItem = useMemo(() => {
    const shisha = shishaItemSet(nodes, itemsByLabel, iconKeyOf);
    const m = new Map();
    Object.entries(itemsByLabel).forEach(([label, list]) =>
      list.forEach((i) => m.set(i, shisha.has(i) ? "hookah" : iconKeyOf[label] || "cloche"))
    );
    return m;
  }, [nodes, itemsByLabel, iconKeyOf]);
  const placeholder = useCallback(
    (item) => <CategoryIcon iconKey={iconOfItem.get(item) || "cloche"} size={56} />,
    [iconOfItem]
  );
  const data = useMemo(
    () => ({ itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem }),
    [itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem]
  );

  // Where the map (drawer) should show "you are here".
  const activeTop = path != null ? Number(path.split("-")[0]) : -1;
  const activeSub = path != null && path.includes("-") ? path : null;

  if (!ready) {
    return (
      <div className="mk-root em-root" style={vars} ref={rootRef}>
        <Ambience />
        <StatusScreen status={kit.status} strings={strings}>
          <span className="em-status">
            <CategoryIcon iconKey="hookah" size={64} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="mk-root em-root" style={vars} ref={rootRef}>
      <Ambience />
      <Hud
        path={path}
        title={node ? node.label : ""}
        parentTitle={parent ? parent.node.label : ""}
        owner={owner}
        strings={strings}
        onUp={up}
        onMap={kit.openMenu}
      />
      <main className={`em-stage em-stage-${dir}`} key={path == null ? "home" : path}>
        {path == null ? <Header owner={owner} strings={strings} itemCount={kit.itemCount} /> : null}
        <Level
          path={path}
          node={node}
          nodes={nodes}
          data={data}
          explored={explored}
          shisha={isShishaPath(path, pathMap, iconKeyOf)}
          onOpenLevel={openLevel}
        />
        {path == null ? <Footer owner={owner} strings={strings} /> : null}
      </main>
      <MenuChrome
        kit={kit}
        owner={owner}
        accent={accent}
        placeholder={placeholder}
        onDrawerOpen={openFromMap}
        activeTop={activeTop}
        activeSub={activeSub}
      />
    </div>
  );
}
