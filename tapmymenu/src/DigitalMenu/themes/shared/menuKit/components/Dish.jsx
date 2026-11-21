import React from "react";
import { parseAllergens } from "../../../../core";

// Small building blocks for themes' own dish cards and rows.

// Props that make any element a keyboard-accessible "open this dish"
// button: <article {...pressable(() => kit.selectItem(item), label)}>
export function pressable(onPress, label) {
  return {
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onClick: onPress,
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPress();
      }
    },
  };
}

// Allergen chips, at most `max` plus "+n". className is the theme's.
export function Allergens({ allergens, className, max = 3 }) {
  const list = parseAllergens(allergens);
  if (list.length === 0) return null;
  const shown = list.slice(0, max);
  const rest = list.length - shown.length;
  return (
    <span className={className}>
      {shown.map((a) => (
        <span key={a}>{a}</span>
      ))}
      {rest > 0 ? <span>+{rest}</span> : null}
    </span>
  );
}

// Original (Bulgarian) name under a translated one; nothing in bg menus
// or when the pairing failed.
export function OriginalName({ item, className }) {
  if (!item.original_name) return null;
  return (
    <p className={className} lang="bg">
      {item.original_name}
    </p>
  );
}

export function dishKey(item, i) {
  return `${item.display_order_position}-${item.name}-${i}`;
}
