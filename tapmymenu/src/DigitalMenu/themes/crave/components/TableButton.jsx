import React from "react";

// Floating "My table · 3" pill, bottom-centre (scroll-to-top is
// bottom-left, the widgets bottom-right). Appears with the first crave
// and bounces every time the count changes.
export default function TableButton({ count, onClick, label }) {
  return (
    <button
      type="button"
      className={"cv-table-btn" + (count ? " cv-table-btn-on" : "")}
      onClick={onClick}
      aria-hidden={!count}
      tabIndex={count ? 0 : -1}
    >
      <span className="cv-table-btn-label">{label}</span>
      <span className="cv-table-btn-count" key={count}>
        {count}
      </span>
    </button>
  );
}
