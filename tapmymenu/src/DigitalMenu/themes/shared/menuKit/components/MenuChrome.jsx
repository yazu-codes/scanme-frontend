import React from "react";
import MenuChatWidget from "../../../../core/MenuChatWidget";
import QRCodeWidget from "../../../../core/QRWidget";
import LocaleWidget from "../../../../core/LocaleWidget";
import DishModal from "./DishModal";
import NavDrawer from "./NavDrawer";
import ScrollToTopButton from "./ScrollToTopButton";

// Everything that floats above a menuKit page: the dish sheet, the
// navigation drawer, scroll-to-top (bottom-LEFT) and the three shared
// widgets (YummGPT, QR, language; bottom-right, unchanged). Mounted right
// away: no theme has an intro, so the widgets' 2 s hints are seen.
export default function MenuChrome({ kit, owner, accent, placeholder }) {
  return (
    <>
      <DishModal
        item={kit.selectedItem}
        open={kit.modalOpen}
        onClose={kit.closeModal}
        strings={kit.strings}
        placeholder={placeholder}
      />
      <NavDrawer
        open={kit.drawerOpen}
        focusContacts={kit.focusContacts}
        owner={owner}
        nodes={kit.nodes}
        itemsByLabel={kit.itemsByLabel}
        activeTop={kit.activeTop}
        activeSub={kit.activeSub}
        strings={kit.strings}
        onClose={kit.closeDrawer}
        onOpen={kit.selectFromDrawer}
      />
      <ScrollToTopButton visible={kit.pastHero} onClick={kit.scrollTop} label={kit.strings.backToTop} />
      <MenuChatWidget restaurantName={kit.urlname} accentColor={accent} itemSelect={kit.selectItem} />
      <QRCodeWidget urlname={kit.urlname} accentColor={accent} />
      <LocaleWidget accentColor={accent} />
    </>
  );
}
