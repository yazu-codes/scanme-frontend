import React from "react";
import { ReviewLinks } from "../../shared/menuKit";

// The reference's wooden serving-board sign with a handle, lettered with
// the hours and phone; Wi-Fi, reviews and the legal line below.
export default function Footer({ owner, strings }) {
  const phone = owner.menu_owner_phone;
  const hours = owner.menu_owner_working_schedule;
  const name = owner.menu_owner_name || "";
  return (
    <footer className="tr-footer">
      {phone || hours ? (
        <div className="tr-board-sign">
          <div className="tr-board-text">
            {hours ? <p className="tr-board-hours">{hours}</p> : null}
            {phone ? (
              <a className="tr-board-phone" href={`tel:${String(phone).replace(/\s+/g, "")}`}>
                {phone}
              </a>
            ) : null}
          </div>
          <span className="tr-board-handle" aria-hidden="true" />
        </div>
      ) : null}
      {owner.menu_owner_wifi ? (
        <p className="tr-wifi">
          {strings.wifi}: {owner.menu_owner_wifi}
        </p>
      ) : null}
      <div className="tr-footer-reviews">
        <ReviewLinks links={owner.menu_owner_review_links} />
      </div>
      <p className="tr-legal">
        © {new Date().getFullYear()}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
