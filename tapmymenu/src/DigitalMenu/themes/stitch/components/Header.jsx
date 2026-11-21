import React from "react";
import { CrossRow, Sampler, ThreadWords } from "./Stitches";

export default function Header({ owner, strings, locale }) {
  const name = owner.menu_owner_name || strings.menu;
  return (
    <header className="st-header">
      <Sampler locale={locale} />
      <CrossRow />
      {owner.menu_owner_logo_url ? <img className="st-logo" src={owner.menu_owner_logo_url} alt="" /> : null}
      <h1 className="st-title">
        <ThreadWords text={name} />
      </h1>
      {owner.menu_owner_slogan ? <p className="st-slogan">{owner.menu_owner_slogan}</p> : null}
      <CrossRow className="st-xrow-short" />
    </header>
  );
}
