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
import "./ladle-theme.css";
import { LADLE_FALLBACK_BG, LADLE_FALLBACK_INK, ladleVars } from "./palette";
import Header from "./components/Header";
import Board from "./components/Board";
import Footer from "./components/Footer";

const getStrings = makeStrings();

// "Ladle": a chalkboard dessert-bar menu. Dark slate page, rounded
// hand-lettered headings with chalk doodles, round filled category icons
// with little script notes, tilted count stickers, and a round hours
// badge next to a chalk ladle at the bottom. Navigation, translated-menu
// fixes, dish sheet and drawer come from the shared menuKit.
export default function LadleTheme(props) {
  const { owner, config } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Ladle",
    fallbackBg: LADLE_FALLBACK_BG,
    fallbackInk: LADLE_FALLBACK_INK,
    makeVars: ladleVars,
  });

  const kit = useMenuKit(props, { getStrings });
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem } = kit;

  // Re-renders only when the menu changes, never on scroll.
  const board = useMemo(
    () => <Board data={{ nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem }} />,
    [nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem]
  );

  if (!kit.ready) {
    return (
      <div className="mk-root tl-root" style={vars} ref={kit.rootRef}>
        <StatusScreen status={kit.status} strings={strings}>
          <span className="tl-icon tl-icon-big">
            <CategoryIcon iconKey="dessert" size={56} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="mk-root tl-root" style={vars} ref={kit.rootRef}>
      <Header owner={owner} strings={strings} itemCount={kit.itemCount} />
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
      <main className="tl-board">{board}</main>
      <Footer owner={owner} strings={strings} />
      <MenuChrome kit={kit} owner={owner} accent={accent} />
    </div>
  );
}
