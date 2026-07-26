import React from "react";
import useDigitalMenu from "./core/useDigitalMenu";
import themes from "./themes";

// urlname -> which menu to fetch (core concern)
// theme   -> which visual style to render it with (themes concern)
export default function DigitalMenu({ urlname, theme = "classic" }) {
  const menuData = useDigitalMenu(urlname);
  console.log("AAAA",menuData.urlname)
  const Theme = themes[theme] || themes.classic;
  console.log("TUKSUSHTO:",menuData.urlname)
  return <Theme {...menuData} />;
}
