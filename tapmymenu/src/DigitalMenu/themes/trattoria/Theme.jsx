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
import "./trattoria-theme.css";
import { TRATTORIA_FALLBACK_BG, TRATTORIA_FALLBACK_INK, trattoriaVars } from "./palette";
import Header from "./components/Header";
import Board from "./components/Board";
import Footer from "./components/Footer";

const getStrings = makeStrings();

// "Trattoria": a quiet Italian trattoria menu. A paper card with a soft
// vignette, letter-spaced small caps over a heavy serif name, sections
// with small seal icons and italic side notes over fine rules, italic
// descriptions, and a wooden serving-board sign with the hours at the
// bottom. Navigation, translated-menu fixes, dish sheet and drawer come
// from the shared menuKit.
export default function TrattoriaTheme(props) {
  const { owner, config } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Trattoria",
    fallbackBg: TRATTORIA_FALLBACK_BG,
    fallbackInk: TRATTORIA_FALLBACK_INK,
    makeVars: trattoriaVars,
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
      <div className="mk-root tr-root" style={vars} ref={kit.rootRef}>
        <StatusScreen status={kit.status} strings={strings}>
          <span className="tr-seal tr-seal-big">
            <CategoryIcon iconKey="pasta" size={56} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="mk-root tr-root" style={vars} ref={kit.rootRef}>
      <div className="tr-card">
      <Header owner={owner} strings={strings} categoryCount={nodes.length} />
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
      <main className="tr-board">{board}</main>
      <Footer owner={owner} strings={strings} />
      </div>
      <MenuChrome kit={kit} owner={owner} accent={accent} />
    </div>
  );
}
