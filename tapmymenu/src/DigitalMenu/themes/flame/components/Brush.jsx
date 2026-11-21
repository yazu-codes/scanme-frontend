import React from "react";

// A rough brush-stroke label (the reference's orange PIZZA / BURGER
// banners): text on an accent stroke drawn with a CSS mask, see
// .fl-brush in flame-theme.css.
export default function Brush({ children, as: Tag = "span", className = "", ...rest }) {
  return (
    <Tag className={`fl-brush ${className}`} {...rest}>
      <span className="fl-brush-text">{children}</span>
    </Tag>
  );
}
