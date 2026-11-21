import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePanelScrollLock from "../shared/hooks/usePanelScrollLock";
import {
  CategoryIcon,
  Contacts,
  MenuChrome,
  ReviewLinks,
  PinnedNav,
  StatusScreen,
  collectItems,
  makeStrings,
  dishIdentity,
  useMenuKit,
  useOwnerTheme,
} from "../shared/menuKit";
import useBackToClose from "../shared/menuKit/hooks/useBackToClose";
import "./crave-theme.css";
import { CRAVE_FALLBACK_BG, CRAVE_FALLBACK_INK, craveVars } from "./palette";
import useCraves from "./hooks/useCraves";
import useScrollVelocity from "./hooks/useScrollVelocity";
import useDishLink from "./hooks/useDishLink";
import shareDish from "./share";
import haptic from "./haptics";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Board from "./components/Board";
import Feed from "./components/Feed";
import TableSheet from "./components/TableSheet";
import TableButton from "./components/TableButton";
import Toast from "./components/Toast";
import Bursts from "./components/Bursts";
import Blobs from "./components/Blobs";

const getStrings = makeStrings({
  bg: {
    heroHint: "Докоснете ястие, плъзнете нагоре за следващото, докоснете два пъти, за да го запазите ♥",
    crave: "Запази в Моята маса",
    uncrave: "Махни от Моята маса",
    craveShort: "Искам",
    share: "Сподели",
    details: "Детайли",
    myTable: "Моята маса",
    myTableShort: "Маса",
    watch: "Разгледай",
    swipeHint: "Плъзнете нагоре",
    promo: "Промо",
    added: "Добавено в Моята маса",
    removed: "Махнато от Моята маса",
    copied: "Линкът е копиран",
    shareFailed: "Споделянето не успя",
    tableEmpty: "Още нищо. Докоснете ♥ на ястие или два пъти върху снимка, за да го добавите тук.",
    total: "Общо",
    showStaffBtn: "Покажи на сервитьора",
    backToList: "Обратно към списъка",
    forStaff: "За сервитьора",
    clear: "Изчисти",
    remove: "Махни",
    tableNote: "Списъкът е само на вашия телефон. Не е поръчка.",
  },
  en: {
    heroHint: "Tap a dish, swipe up for the next, double-tap to save it ♥",
    crave: "Save to My table",
    uncrave: "Remove from My table",
    craveShort: "Crave",
    share: "Share",
    details: "Details",
    myTable: "My table",
    myTableShort: "Table",
    watch: "Swipe through",
    swipeHint: "Swipe up",
    promo: "Promo",
    added: "Added to My table",
    removed: "Removed from My table",
    copied: "Link copied",
    shareFailed: "Couldn't share",
    tableEmpty: "Nothing yet. Tap ♥ on a dish, or double-tap a photo, to add it here.",
    total: "Total",
    showStaffBtn: "Show to the staff",
    backToList: "Back to the list",
    forStaff: "For the staff",
    clear: "Clear",
    remove: "Remove",
    tableNote: "This list lives only on your phone. It is not an order.",
  },
});

// "Crave": the menu as a social feed. A kinetic, colour-popping home page
// (bouncing name, story bar, ticker, swipe strips of dish cards with
// price stickers) and a full-screen dish FEED: one dish per screen,
// swipe up for the next, double-tap to crave. Craved dishes collect in
// "My table", a list to show the waiter. Any dish can be shared as an
// image card or a link that opens straight to it.
//
// Navigation, translated-menu fixes, dish sheet, drawer and widgets come
// from the shared menuKit; colours from the owner's two colours plus
// hue-rotated companions (palette.js).
export default function CraveTheme(props) {
  const { owner, config, urlname } = props;
  const { vars, accent } = useOwnerTheme(config, {
    name: "Crave",
    fallbackBg: CRAVE_FALLBACK_BG,
    fallbackInk: CRAVE_FALLBACK_INK,
    makeVars: craveVars,
  });

  const kit = useMenuKit(props, { getStrings });
  const { nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, selectItem, selectPath, rootRef, ready } = kit;
  const { trackItem, trackCategory } = kit;
  const { keys: cravedKeys, has: isCraved, toggle: toggleKey, add: addKey, remove: removeKey, clear: clearKeys } =
    useCraves(urlname);

  useScrollVelocity(rootRef, ready);
  useDishLink({ ready, itemsByLabel, onOpen: selectItem });

  // Display-ready items by pairing key, and the top-level category each
  // dish belongs to (the feed shows that category's photo dishes).
  const { byKey, topOf } = useMemo(() => {
    const k = new Map();
    const t = new Map();
    nodes.forEach((node, i) =>
      collectItems(node, itemsByLabel).forEach((item) => {
        k.set(dishIdentity(item), item);
        t.set(dishIdentity(item), i);
      })
    );
    return { byKey: k, topOf: t };
  }, [nodes, itemsByLabel]);

  // --- feedback: toasts and bursts ------------------------------------------
  const [toast, setToast] = useState(null);
  const [bursts, setBursts] = useState([]);
  const seq = useRef(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const say = useCallback(
    (text) => {
      seq.current += 1;
      const id = seq.current;
      setToast({ id, text });
      later(() => setToast((t) => (t && t.id === id ? null : t)), 1800);
    },
    [later]
  );
  const burst = useCallback(
    (e, big) => {
      let x = e && e.clientX;
      let y = e && e.clientY;
      if (!x && !y && e && e.currentTarget && e.currentTarget.getBoundingClientRect) {
        const r = e.currentTarget.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
      seq.current += 1;
      const id = seq.current;
      setBursts((b) => [...b, { id, x: x || window.innerWidth / 2, y: y || window.innerHeight / 2, big }]);
      later(() => setBursts((b) => b.filter((p) => p.id !== id)), 950);
    },
    [later]
  );

  // ♥: toggle. Double-tap: always add (like a like).
  const toggleCrave = useCallback(
    (item, e) => {
      const added = toggleKey(item);
      haptic(added ? [10, 40, 18] : 8);
      if (added) burst(e, false);
      say(added ? strings.added : strings.removed);
    },
    [toggleKey, burst, say, strings]
  );
  const crave = useCallback(
    (item, e) => {
      if (!isCraved(item)) {
        addKey(item);
        say(strings.added);
      }
      haptic([10, 40, 18]);
      burst(e, true);
    },
    [isCraved, addKey, burst, say, strings]
  );

  // --- feed ----------------------------------------------------------------
  const [feed, setFeed] = useState({ open: false, top: null, index: 0 });
  const feedItems = useMemo(
    () => (feed.top == null || !nodes[feed.top] ? [] : collectItems(nodes[feed.top], itemsByLabel).filter((i) => i.picture_url)),
    [feed.top, nodes, itemsByLabel]
  );
  const openFeed = useCallback(
    (item) => {
      const key = dishIdentity(item);
      const top = topOf.get(key);
      if (top == null) {
        selectItem(item);
        return;
      }
      const list = collectItems(nodes[top], itemsByLabel).filter((i) => i.picture_url);
      const index = Math.max(0, list.findIndex((i) => dishIdentity(i) === key));
      trackItem(item);
      setFeed({ open: true, top, index });
    },
    [topOf, nodes, itemsByLabel, selectItem, trackItem]
  );
  const openFeedAt = useCallback(
    (top) => {
      trackCategory(String(top));
      setFeed({ open: true, top, index: 0 });
    },
    [trackCategory]
  );
  const closeFeed = useCallback(() => setFeed((f) => ({ ...f, open: false })), []);

  // --- My table ---------------------------------------------------------------
  const [tableOpen, setTableOpen] = useState(false);
  const openTable = useCallback(() => setTableOpen(true), []);
  const closeTable = useCallback(() => setTableOpen(false), []);
  const tableItems = useMemo(() => cravedKeys.map((k) => byKey.get(k)).filter(Boolean), [cravedKeys, byKey]);

  usePanelScrollLock(feed.open || tableOpen);
  useBackToClose(feed.open, closeFeed, null);
  useBackToClose(tableOpen, closeTable, null);

  // --- share -------------------------------------------------------------------
  const share = useCallback(
    async (item) => {
      const colors = {
        bg: vars["--cv-bg"],
        ink: vars["--cv-ink"],
        pop1: vars["--cv-pop1"],
        pop2: vars["--cv-pop2"],
        pop3: vars["--cv-pop3"],
        onPop1: vars["--cv-on-pop1"],
        onPop2: vars["--cv-on-pop2"],
      };
      haptic(8);
      const result = await shareDish(item, { colors, restaurant: owner.menu_owner_name || "" });
      if (result === "copied") say(strings.copied);
      else if (result === "failed") say(strings.shareFailed);
    },
    [vars, owner.menu_owner_name, say, strings]
  );

  // The board re-renders when the menu or the craved set changes, never
  // on scroll.
  const craved = useMemo(() => ({ has: isCraved }), [isCraved]);
  const board = useMemo(
    () => (
      <Board
        data={{
          nodes,
          itemsByLabel,
          originalLabelOf,
          iconKeyOf,
          strings,
          craved,
          toggleCrave,
          openFeed,
          openFeedAt,
          openDetail: selectItem,
        }}
      />
    ),
    [nodes, itemsByLabel, originalLabelOf, iconKeyOf, strings, craved, toggleCrave, openFeed, openFeedAt, selectItem]
  );
  const marqueeWords = useMemo(() => nodes.map((n) => n.label), [nodes]);

  if (!ready) {
    return (
      <div className="mk-root cv-root" style={vars} ref={rootRef}>
        <Blobs />
        <StatusScreen status={kit.status} strings={strings}>
          <span className="cv-status">
            <CategoryIcon iconKey="cloche" size={64} />
          </span>
        </StatusScreen>
      </div>
    );
  }

  const feedTitle = feed.top != null && nodes[feed.top] ? nodes[feed.top].label : "";

  return (
    <div className="mk-root cv-root" style={vars} ref={rootRef}>
      <Blobs />
      <Hero
        owner={owner}
        strings={strings}
        nodes={nodes}
        itemsByLabel={itemsByLabel}
        iconKeyOf={iconKeyOf}
        onSelect={selectPath}
      />
      <Marquee words={marqueeWords} />
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
      <main className="cv-board">{board}</main>
      <footer className="cv-footer">
        {owner.menu_owner_name ? <p className="cv-footer-name">{owner.menu_owner_name}</p> : null}
        <Contacts owner={owner} strings={strings} />
        <div className="cv-footer-reviews">
          <ReviewLinks links={owner.menu_owner_review_links} />
        </div>
        <p className="cv-footer-legal">
          © {new Date().getFullYear()}
          {owner.menu_owner_name ? ` ${owner.menu_owner_name}.` : ""} {strings.rights}
        </p>
      </footer>

      <Feed
        open={feed.open}
        items={feedItems}
        startIndex={feed.index}
        title={feedTitle}
        strings={strings}
        craved={craved}
        onCrave={crave}
        onToggleCrave={toggleCrave}
        onClose={closeFeed}
        onInfo={selectItem}
        onShare={share}
        tableCount={tableItems.length}
        onOpenTable={openTable}
        covered={kit.modalOpen || tableOpen}
      />
      <TableSheet
        open={tableOpen}
        items={tableItems}
        strings={strings}
        onClose={closeTable}
        onRemove={removeKey}
        onClear={clearKeys}
        onOpenItem={selectItem}
        covered={kit.modalOpen}
      />
      <TableButton count={tableItems.length} onClick={openTable} label={strings.myTable} />
      <Bursts bursts={bursts} />
      <Toast toast={toast} />
      <MenuChrome kit={kit} owner={owner} accent={accent} />
    </div>
  );
}
