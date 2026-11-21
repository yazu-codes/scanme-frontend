import React from "react";
import { ReviewLinks } from "../../shared/menuKit";

// The reference's bottom strip: an accent band of labels (OPEN • VISIT
// US • DELIVERY) over three dashed-ruled columns. Here: hours, Wi-Fi and
// phone, each column only when the owner filled it in.
export default function InfoStrip({ owner, strings }) {
  const cols = [];
  if (owner.menu_owner_working_schedule) {
    cols.push({ key: "hours", label: strings.hours, body: <span className="dn-prewrap">{owner.menu_owner_working_schedule}</span> });
  }
  if (owner.menu_owner_wifi) {
    cols.push({ key: "wifi", label: strings.wifi, body: <span>{owner.menu_owner_wifi}</span> });
  }
  if (owner.menu_owner_phone) {
    const tel = String(owner.menu_owner_phone).replace(/\s+/g, "");
    cols.push({ key: "call", label: strings.call, body: <a href={`tel:${tel}`}>{owner.menu_owner_phone}</a> });
  }
  const name = owner.menu_owner_name || "";

  return (
    <footer className="dn-footer">
      {cols.length ? (
        <>
          <div className="dn-strip" aria-hidden="true">
            {cols.map((c, i) => (
              <React.Fragment key={c.key}>
                {i > 0 ? <span className="dn-strip-dot">•</span> : null}
                <span>{c.label}</span>
              </React.Fragment>
            ))}
          </div>
          <dl className="dn-info" style={{ "--dn-cols": cols.length }}>
            {cols.map((c) => (
              <div key={c.key} className="dn-info-col">
                <dt className="dn-info-label">{c.label}</dt>
                <dd>{c.body}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
      <div className="dn-footer-reviews">
        <ReviewLinks links={owner.menu_owner_review_links} />
      </div>
      <p className="dn-legal">
        © {new Date().getFullYear()}
        {name ? ` ${name}.` : ""} {strings.rights}
      </p>
    </footer>
  );
}
