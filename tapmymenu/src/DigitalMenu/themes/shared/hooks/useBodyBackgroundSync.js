import { useEffect } from "react";

// Syncs the real page background (html/body) to whatever color a theme
// is using, so there's no mismatched-color frame around the component
// on any viewport, and locks horizontal overflow at the document level
// so nothing a theme renders can push the page wider than the device.
//
// This is a UI mechanic, not core data logic — a theme decides what
// color to pass in (it might use the menu's configured color, or ignore
// it entirely and hardcode its own palette).
export default function useBodyBackgroundSync(backgroundColor) {
  useEffect(() => {
    const previousBodyBg = document.body.style.backgroundColor;
    const previousHtmlBg = document.documentElement.style.backgroundColor;
    const previousBodyMargin = document.body.style.margin;
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;

    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      document.body.style.backgroundColor = previousBodyBg;
      document.documentElement.style.backgroundColor = previousHtmlBg;
      document.body.style.margin = previousBodyMargin;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
    };
  }, [backgroundColor]);
}
