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
import "./stitch-theme.css";
import { STITCH_FALLBACK_BG, STITCH_FALLBACK_INK, stitchVars } from "./palette";
import Header from "./components/Header";
import Board from "./components/Board";
import Footer from "./components/Footer";

const getStrings = makeStrings();

// "Stitch": a cross-stitch sampler menu. The alphabet stitched across
// the top, a title in pixel "thread" letters, sections in double
// dashed-stitch frames in three shades of the owner's text colour, and a
// stitched sign-off. Navigation, translated-menu fixes, dish sheet and
// drawer come from the shared menuKit.
export default function StitchTheme(props) {
  const { owner, config } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Stitch",
    fallbackBg: STITCH_FALLBACK_BG,
    fallbackInk: STITCH_FALLBACK_INK,
    makeVars: stitchVars,
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
      <div className="mk-root st-root" style={vars} ref={kit.rootRef}>
        <StatusScreen status={kit.status} strings={strings}>
          <span className="st-status">
            <CategoryIcon iconKey="egg" size={64} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="mk-root st-root" style={vars} ref={kit.rootRef}>
      <Header owner={owner} strings={strings} locale={kit.locale} />
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
      <main className="st-board">{board}</main>
      <Footer owner={owner} strings={strings} />
      <MenuChrome kit={kit} owner={owner} accent={accent} />
    </div>
  );
}
