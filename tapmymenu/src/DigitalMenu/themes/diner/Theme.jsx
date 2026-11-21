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
import "./diner-theme.css";
import { DINER_FALLBACK_BG, DINER_FALLBACK_INK, dinerVars } from "./palette";
import Sign from "./components/Sign";
import MenuBoard from "./components/MenuBoard";
import InfoStrip from "./components/InfoStrip";

const getStrings = makeStrings({
  bg: { welcome: "Добре дошли" },
  en: { welcome: "Welcome" },
});

// "Diner": a 1950s American diner menu. Checkerboard page, a rounded
// cream menu card, a neon-style sign with the restaurant name, boxed
// price lists with round category badges and a strip of opening info at
// the bottom. Navigation, translated-menu fixes, dish sheet and drawer
// come from the shared menuKit (themes/shared/menuKit).
export default function DinerTheme(props) {
  const { owner, config } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Diner",
    fallbackBg: DINER_FALLBACK_BG,
    fallbackInk: DINER_FALLBACK_INK,
    makeVars: dinerVars,
  });

  const kit = useMenuKit(props, { getStrings });
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem } = kit;

  // The board only re-renders when the menu changes, never on scroll.
  const board = useMemo(
    () => <MenuBoard kit={{ nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem }} />,
    [nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem]
  );

  if (!kit.ready) {
    return (
      <div className="mk-root dn-root" style={vars} ref={kit.rootRef}>
        <StatusScreen status={kit.status} strings={strings}>
          <span className="dn-status-badge">
            <CategoryIcon iconKey="burger" size={56} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="mk-root dn-root" style={vars} ref={kit.rootRef}>
      <div className="dn-panel">
        <Sign owner={owner} strings={strings} />
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
        <main className="dn-board">{board}</main>
        <InfoStrip owner={owner} strings={strings} />
      </div>
      <MenuChrome kit={kit} owner={owner} accent={accent} />
    </div>
  );
}
