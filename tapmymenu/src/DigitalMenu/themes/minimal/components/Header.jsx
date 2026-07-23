import React from "react";

export default function Header({ owner }) {
  const { menu_owner_name, menu_owner_slogan } = owner;

  return (
    <header className="dmm-header">
      <h1 className="dmm-owner-name">{menu_owner_name || "Menu"}</h1>
      {menu_owner_slogan ? (
        <p className="dmm-slogan">{menu_owner_slogan}</p>
      ) : null}
    </header>
  );
}
