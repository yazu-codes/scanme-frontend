import React from "react";
import useDigitalMenu from "./core/useDigitalMenu";
import themes from "./themes";

// urlname -> which menu to fetch (core concern)
// code -> menu code to use for QR
// theme   -> which visual style to render it with (themes concern)
export default function DigitalMenu({ urlname, theme = "luxury" }) {
  const menuData = useDigitalMenu(urlname);
  
  const Theme = themes[menuData.config.theme] || themes.luxury;
  
  return <Theme {...menuData} />;
}
