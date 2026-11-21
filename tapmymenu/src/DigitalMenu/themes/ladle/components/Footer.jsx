import React from "react";
import { ReviewLinks } from "../../shared/menuKit";
import { LadleDoodle } from "./Doodles";

// The reference's round badge with phone and hours, next to a chalk
// ladle; Wi-Fi, reviews and the legal line under it.
export default function Footer({ owner, strings }) {
  const phone = owner.menu_owner_phone;
  const hours = owner.menu_owner_working_schedule;
  const name = owner.menu_owner_name || "";
  return (
    <footer className="tl-footer">
      <div className="tl-footer-row">
        {phone || hours ? (
          <div className="tl-badge">
            {phone ? (
              <a className="tl-badge-phone" href={`tel:${String(phone).replace(/\s+/g, "")}`}>
                {phone}
              </a>
            ) : null}
            {hours ? <p className="tl-badge-hours">{hours}</p> : null}
          </div>
        ) : null}
        <div className="tl-footer-ladle">
          <LadleDoodle className="tl-ladle" />
          {owner.menu_owner_slogan ? <p className="tl-note">{owner.menu_owner_slogan}</p> : null}
        </div>
      </div>
      {owner.menu_owner_wifi ? (
        <p className="tl-wifi">
          {strings.wifi}: {owner.menu_owner_wifi}
        </p>
      ) : null}
      <div className="tl-footer-reviews">
        <ReviewLinks links={owner.menu_owner_review_links} />
      </div>
      <p className="tl-legal">
        © {new Date().getFullYear()}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
