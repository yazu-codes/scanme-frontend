import React from "react";
import { ArrowUpIcon } from "./Icons";

// Bottom-LEFT on purpose: the YummGPT, QR and language widgets stack in
// the bottom-right corner.
export default function ScrollToTopButton({ visible, onClick, label }) {
  return (
    <button
      type="button"
      className={"mk-top" + (visible ? " mk-top-visible" : "")}
      onClick={onClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label={label}
    >
      <ArrowUpIcon />
    </button>
  );
}
