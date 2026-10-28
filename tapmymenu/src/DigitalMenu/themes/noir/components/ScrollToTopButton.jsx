import React from "react";

// Round outlined arrow. Bottom-LEFT on purpose: the chat / QR / language
// widgets stack in the bottom-right corner.
export default function ScrollToTopButton({ visible, targetRef, label }) {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <button
      type="button"
      className={"nr-top" + (visible ? " nr-top-visible" : "")}
      onClick={handleClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
