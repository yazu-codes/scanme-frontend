import React from "react";

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M5 15l7-7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// targetRef points at the theme's root element. Using its scrollIntoView
// rather than window.scrollTo means this works whether the page itself
// scrolls or the app wraps everything in its own scrollable container —
// scrollIntoView walks up whatever the real scrolling ancestor turns out
// to be, instead of assuming it's the window.
export default function ScrollToTopButton({ visible, targetRef }) {
  function handleClick() {
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <button
      type="button"
      className={"dml-scroll-top" + (visible ? " dml-scroll-top-visible" : "")}
      onClick={handleClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label="Back to top"
    >
      <ChevronUpIcon />
    </button>
  );
}
