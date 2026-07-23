import React from "react";

export default function Footer({ owner }) {
  const { menu_owner_phone, menu_owner_name } = owner;
  if (!menu_owner_phone && !menu_owner_name) return null;

  return (
    <footer className="dml-footer">
      <div className="dml-footer-mark" aria-hidden="true" />
      {menu_owner_name ? (
        <p className="dml-footer-line">{menu_owner_name}</p>
      ) : null}
      {menu_owner_phone ? (
        <p className="dml-footer-line dml-footer-phone">
          <a href={`tel:${menu_owner_phone}`}>{menu_owner_phone}</a>
        </p>
      ) : null}
    </footer>
  );
}
