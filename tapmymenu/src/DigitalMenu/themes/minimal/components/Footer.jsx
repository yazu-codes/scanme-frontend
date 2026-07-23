import React from "react";

export default function Footer({ owner }) {
  const { menu_owner_phone, menu_owner_name } = owner;
  if (!menu_owner_phone && !menu_owner_name) return null;

  return (
    <footer className="dmm-footer">
      {menu_owner_name ? <p>{menu_owner_name}</p> : null}
      {menu_owner_phone ? (
        <p>
          <a href={`tel:${menu_owner_phone}`}>{menu_owner_phone}</a>
        </p>
      ) : null}
    </footer>
  );
}
