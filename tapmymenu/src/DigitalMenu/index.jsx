import React from "react";
import useDigitalMenu from "./core/useDigitalMenu";
import themes from "./themes";

// urlname -> which menu to fetch (core concern)
// code -> menu code to use for QR
// theme   -> which visual style to render it with (themes concern)
export default function DigitalMenu({ urlname, theme = "classic" }) {
  const menuData = useDigitalMenu(urlname);

  // TODO: get locale cookie from browser, use google translate to translate anything that is not explicitly translated straight from database.
  

  // console.log("AAAA",code);
  const Theme = themes[theme] || themes.classic;
  // console.log("TUKSUSHTO:",menuData.urlname)
  return <Theme {...menuData} />;
}
