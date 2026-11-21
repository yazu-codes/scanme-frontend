import React from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export function BurgerIcon({ size = 20 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function PhoneIcon({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function ClockIcon({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function WifiIcon({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0" />
      <path d="M12 19h.01" />
    </svg>
  );
}

export function InfoIcon({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function ChevronIcon({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 18 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M12 19V5m-6 6 6-6 6 6" />
    </svg>
  );
}
