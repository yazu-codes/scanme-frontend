import React from "react";
import { ReviewLinks } from "../../shared/menuKit";
import { CrossRow } from "./Stitches";

// The reference's stitched sign-off: phone and hours in the stitch face,
// between rows of cross-stitches.
export default function Footer({ owner, strings }) {
  const phone = owner.menu_owner_phone;
  const name = owner.menu_owner_name || "";
  return (
    <footer className="st-footer">
      <CrossRow />
      {phone ? (
        <a className="st-footer-phone st-thread-1" href={`tel:${String(phone).replace(/\s+/g, "")}`}>
          {phone}
        </a>
      ) : null}
      {owner.menu_owner_working_schedule ? (
        <p className="st-footer-hours st-thread-2">{owner.menu_owner_working_schedule}</p>
      ) : null}
      {owner.menu_owner_wifi ? (
        <p className="st-footer-wifi">
          {strings.wifi}: {owner.menu_owner_wifi}
        </p>
      ) : null}
      <div className="st-footer-reviews">
        <ReviewLinks links={owner.menu_owner_review_links} />
      </div>
      <CrossRow />
      <p className="st-legal">
        © {new Date().getFullYear()}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
