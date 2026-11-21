import React, { useMemo } from "react";
import {
  CategoryIcon,
  MenuChrome,
  PinnedNav,
  StatusScreen,
  makeStrings,
  useMenuKit,
  useOwnerTheme,
} from "../shared/menuKit";
import "./flame-theme.css";
import { FLAME_FALLBACK_BG, FLAME_FALLBACK_INK, flameVars } from "./palette";
import Hero from "./components/Hero";
import Board from "./components/Board";
import Footer from "./components/Footer";

const getStrings = makeStrings();

// "Flame": a bold fast-food flyer. A fire-glow page with drifting embers,
// a huge slanted MENU, two featured dishes floating over brush-stroke
// labels, category names on brush strokes, photo cards and caps price
// lines with dotted leaders. Navigation, translated-menu fixes, dish
// sheet and drawer come from the shared menuKit.
export default function FlameTheme(props) {
  const { owner, config } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Flame",
    fallbackBg: FLAME_FALLBACK_BG,
    fallbackInk: FLAME_FALLBACK_INK,
    makeVars: flameVars,
  });

  const kit = useMenuKit(props, { getStrings });
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem, selectPath } = kit;

  // Re-render only when the menu changes, never on scroll.
  const board = useMemo(
    () => <Board data={{ nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem }} />,
    [nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem]
  );
  const hero = useMemo(
    () => <Hero owner={owner} strings={strings} nodes={nodes} itemsByLabel={itemsByLabel} onSelect={selectPath} />,
    [owner, strings, nodes, itemsByLabel, selectPath]
  );

  if (!kit.ready) {
    return (
      <div className="mk-root fl-root" style={vars} ref={kit.rootRef}>
        <StatusScreen status={kit.status} strings={strings}>
          <span className="fl-status">
            <CategoryIcon iconKey="pizza" size={64} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="mk-root fl-root" style={vars} ref={kit.rootRef}>
      <div className="fl-embers" aria-hidden="true" />
      {hero}
      {nodes.length ? (
        <PinnedNav
          rootRef={kit.rootRef}
          nodes={nodes}
          itemsByLabel={itemsByLabel}
          activeTop={kit.activeTop}
          activeSub={kit.activeSub}
          strings={strings}
          onSelectTop={kit.selectPath}
          onSelectSub={kit.selectPath}
          onMenu={kit.openMenu}
        />
      ) : null}
      <main className="fl-board">{board}</main>
      <Footer owner={owner} strings={strings} />
      <MenuChrome kit={kit} owner={owner} accent={accent} />
    </div>
  );
}
