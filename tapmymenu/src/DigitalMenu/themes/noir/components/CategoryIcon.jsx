import React from "react";
import { DEFAULT_ICON } from "../iconKeywords";

// Line-art icons for the category strip and photo-less cover cards. Which
// one a category gets is decided by iconKeywords.js from the category's
// ORIGINAL title; this component only draws it.

const ICONS = {
  promo: (
    <>
      <path d="M24 6l4.8 9.8 10.8 1.6-7.8 7.6 1.8 10.8L24 30.7l-9.6 5.1 1.8-10.8-7.8-7.6 10.8-1.6z" />
      <path d="M12 41h24" />
    </>
  ),
  starter: (
    <>
      <path d="M8 31h32l-3 5H11z" />
      <path d="M13 31l5-9h8l-3 9M27 31l4-7 5 7" />
      <circle cx="20" cy="26" r="1" />
      <path d="M33 18c2-3 5-3 6-1" />
    </>
  ),
  salad: (
    <>
      <path d="M7 25h34c0 8-7 13-17 13S7 33 7 25z" />
      <path d="M14 25c-1-5 2-8 6-8M22 25c0-6 4-9 8-8M30 25c1-4 4-6 7-5" />
      <path d="M18 17c1-3 4-5 7-4" />
    </>
  ),
  soup: (
    <>
      <path d="M7 24h34c0 8-7 14-17 14S7 32 7 24z" />
      <path d="M18 18c-2-2 2-4 0-7M24 18c-2-2 2-4 0-7M30 18c-2-2 2-4 0-7" />
    </>
  ),
  egg: (
    <>
      <circle cx="21" cy="26" r="13" />
      <circle cx="21" cy="26" r="5" />
      <path d="M34 26h9" />
    </>
  ),
  pasta: (
    <>
      <path d="M7 27h34c0 7-7 11-17 11S7 34 7 27z" />
      <path d="M15 27c0-4 3-6 6-4s1 5 4 5 4-4 1-6-6 1-6-3 5-5 8-2" />
      <path d="M32 9l-6 18M35 10l-6 17" />
    </>
  ),
  pizza: (
    <>
      <path d="M24 39L9 14c9-5 21-5 30 0z" />
      <path d="M11.5 18c8-4 17-4 25 0" />
      <circle cx="20" cy="22" r="2" />
      <circle cx="28" cy="25" r="2" />
      <circle cx="24" cy="31" r="1.6" />
    </>
  ),
  burger: (
    <>
      <path d="M9 22c0-7 7-11 15-11s15 4 15 11z" />
      <path d="M8 26h32M10 30c4 2 8-2 14 0s10-2 14 0" />
      <path d="M10 33h28c0 3-2 5-5 5H15c-3 0-5-2-5-5z" />
      <path d="M18 16h1M24 15h1M30 16h1" />
    </>
  ),
  chicken: (
    <>
      <path d="M30 9c6 0 10 4 10 10 0 7-6 11-12 10l-9 9" />
      <path d="M30 9c-6 0-10 5-9 11l-9 9" />
      <path d="M12 29l7 9" />
      <path d="M9 32a3 3 0 1 0 4 4M15 41a3 3 0 1 0 4-4" />
    </>
  ),
  meat: (
    <>
      <path d="M10 26c-2-9 6-16 16-15 9 1 14 8 12 15-2 8-10 11-18 10-6-1-9-4-10-10z" />
      <circle cx="29" cy="22" r="3.5" />
      <path d="M15 26c2 3 6 5 10 4" />
    </>
  ),
  main: (
    <>
      <ellipse cx="24" cy="28" rx="17" ry="9" />
      <path d="M14 28c1-4 6-6 10-5 4 1 7 0 9-2 2 3 0 7-5 8-5 1-12 2-14-1z" />
      <path d="M19 27c2-1 4-1 6 0" />
    </>
  ),
  fish: (
    <>
      <path d="M8 24c5-7 14-9 22-5l7-5v20l-7-5c-8 4-17 2-22-5z" />
      <circle cx="15" cy="23" r="1" />
      <path d="M20 19c1 3 1 7 0 10" />
    </>
  ),
  lean: (
    <>
      <path d="M12 38C10 22 20 10 38 9c1 17-9 28-24 29" />
      <path d="M12 38c6-9 12-15 20-21" />
      <path d="M20 29l-1-6M25 24l5 0" />
    </>
  ),
  side: (
    <>
      <path d="M13 22h22l-3 16H16z" />
      <path d="M16 22l-1-12M21 22V8M26 22l1-13M31 22l2-10" />
    </>
  ),
  bread: (
    <>
      <path d="M8 30c0-9 7-15 16-15s16 6 16 15c0 4-3 6-6 6H14c-3 0-6-2-6-6z" />
      <path d="M17 21l3 5M23 19l3 5M29 21l3 5" />
    </>
  ),
  dessert: (
    <>
      <path d="M8 36h32V25L8 30z" />
      <path d="M8 30V25l32-6v6" />
      <path d="M8 25c6-5 18-9 32-6" />
      <path d="M30 14c0-2 2-4 4-3s1 4-1 5" />
    </>
  ),
  drinks: (
    <>
      <path d="M14 14h20l-3 24H17z" />
      <path d="M15 21h18" />
      <path d="M26 14l5-8h4" />
    </>
  ),
  coffee: (
    <>
      <path d="M10 20h24v8c0 6-5 10-12 10s-12-4-12-10z" />
      <path d="M34 22h3c2 0 3 2 3 4s-2 4-4 4h-3" />
      <path d="M17 15c-2-2 2-3 0-6M23 15c-2-2 2-3 0-6" />
      <path d="M8 41h28" />
    </>
  ),
  soft: (
    <>
      <path d="M20 6h8v5l4 6v21c0 2-1 3-3 3H19c-2 0-3-1-3-3V17l4-6z" />
      <path d="M16 22h16v10H16" />
    </>
  ),
  beer: (
    <>
      <path d="M12 14h18v24H12z" />
      <path d="M30 18h4c2 0 3 1 3 3v8c0 2-1 3-3 3h-4" />
      <path d="M12 14c-2-4 2-7 5-5 1-3 6-3 7 0 3-2 7 1 6 5" />
      <path d="M17 20v13M22 20v13" />
    </>
  ),
  wine: (
    <>
      <path d="M15 7h18c1 9-2 17-9 17S14 16 15 7z" />
      <path d="M15.5 14h17" />
      <path d="M24 24v13M17 40h14" />
    </>
  ),
  champagne: (
    <>
      <path d="M19 5h10l-1 16c0 3-2 5-4 5s-4-2-4-5z" />
      <path d="M19.4 12h9.2" />
      <path d="M24 26v12M18 40h12" />
      <circle cx="23" cy="17" r="0.6" />
      <circle cx="25.5" cy="20" r="0.6" />
      <path d="M33 8l3-2M34 13h4M33 18l3 2" />
    </>
  ),
  rakia: (
    <>
      <path d="M16 12h16l-2.5 26h-11z" />
      <path d="M17 22h14" />
      <path d="M14 42h20" />
    </>
  ),
  whisky: (
    <>
      <path d="M12 16h24l-2 22H14z" />
      <path d="M13 25h22" />
      <rect x="17" y="27" width="6" height="6" transform="rotate(-12 20 30)" />
      <rect x="24" y="28" width="6" height="6" transform="rotate(10 27 31)" />
    </>
  ),
  cocktail: (
    <>
      <path d="M9 10h30L24 26z" />
      <path d="M24 26v12M17 40h14" />
      <path d="M13 14h22" />
      <circle cx="30" cy="9" r="3" />
    </>
  ),
  cloche: (
    <>
      <path d="M8 33h32" />
      <path d="M11 33c0-8 6-14 13-14s13 6 13 14" />
      <path d="M24 19v-3M21 15h6" />
      <path d="M6 37h36" />
    </>
  ),
};

export default function CategoryIcon({ iconKey, size = 34 }) {
  const shape = ICONS[iconKey] || ICONS[DEFAULT_ICON];
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
