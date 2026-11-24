import React, { useCallback, useMemo } from "react";
import {
  CategoryIcon,
  MenuChrome,
  collectItems,
  PinnedNav,
  StatusScreen,
  makeStrings,
  useMenuKit,
  useOwnerTheme,
} from "../shared/menuKit";
import "./ember-theme.css";
import { EMBER_FALLBACK_BG, EMBER_FALLBACK_INK, emberVars } from "./palette";
import Ambience from "./components/Ambience";
import Header from "./components/Header";
import Covers from "./components/Covers";
import Board from "./components/Board";
import Footer from "./components/Footer";

const getStrings = makeStrings({
  bg: { lounge: "Лаунж" },
  en: { lounge: "Lounge" },
});

// "Ember": a modern shisha-lounge menu in Noir's editorial spirit. A
// near-dark page lit by a slowly breathing ember glow and faint smoke,
// a light serif masthead, a rail of numbered smoked-glass category
// "books", sections with brass hairlines, shisha flavours as glowing
// tiles with flavour-note chips, photo dishes as glass cards, drinks as
// quiet lines. Navigation, translated-menu fixes, dish sheet, drawer and
// widgets come from the shared menuKit; every colour from the owner's two.
export default function EmberTheme(props) {
  const { owner, config } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Ember",
    fallbackBg: EMBER_FALLBACK_BG,
    fallbackInk: EMBER_FALLBACK_INK,
    makeVars: emberVars,
  });

  const kit = useMenuKit(props, { getStrings });
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem, selectPath, rootRef } = kit;

  // Re-render only when the menu changes, never on scroll.
  const board = useMemo(
    () => <Board data={{ nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem }} />,
    [nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem]
  );
  const covers = useMemo(
    () => (
      <Covers
        nodes={nodes}
        itemsByLabel={itemsByLabel}
        iconKeyOf={iconKeyOf}
        originalLabelOf={originalLabelOf}
        strings={strings}
        onSelect={selectPath}
      />
    ),
    [nodes, itemsByLabel, iconKeyOf, originalLabelOf, strings, selectPath]
  );

  // Shisha dishes (anything under a category whose ORIGINAL title is a
  // shisha word) show the hookah icon in the detail sheet when they have
  // no photo.
  const shishaItems = useMemo(() => {
    const set = new Set();
    nodes.forEach((node) => {
      (function walk(n, inShisha) {
        const here = inShisha || iconKeyOf[n.label] === "hookah";
        if (here) collectItems(n, itemsByLabel).forEach((i) => set.add(i));
        else n.children.forEach((c) => walk(c, false));
      })(node, false);
    });
    return set;
  }, [nodes, itemsByLabel, iconKeyOf]);
  const placeholder = useCallback(
    (item) => <CategoryIcon iconKey={shishaItems.has(item) ? "hookah" : "cloche"} size={56} />,
    [shishaItems]
  );

  if (!kit.ready) {
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
      <Header owner={owner} strings={strings} itemCount={kit.itemCount} />
      {covers}
      {nodes.length ? (
        <PinnedNav
          rootRef={rootRef}
          nodes={nodes}
          itemsByLabel={itemsByLabel}
          activeTop={kit.activeTop}
          activeSub={kit.activeSub}
          strings={strings}
          onSelectTop={selectPath}
          onSelectSub={selectPath}
          onMenu={kit.openMenu}
        />
      ) : null}
      <main className="em-board">{board}</main>
      <Footer owner={owner} strings={strings} />
      <MenuChrome kit={kit} owner={owner} accent={accent} placeholder={placeholder} />
    </div>
  );
}
