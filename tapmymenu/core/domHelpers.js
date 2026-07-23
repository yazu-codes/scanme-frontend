// ---------------------------------------------------------------------
// NON-NEGOTIABLE: low-level document mutations. These don't know or
// care what a menu looks like — they just get title/meta/favicon/font
// tags into <head> correctly.
// ---------------------------------------------------------------------

export function setMeta(name, content, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content || "");
}

export function setFavicon(url) {
  if (!url) return;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

export function loadGoogleFont(fontFamily) {
  if (!fontFamily) return;
  const id = `font-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
    /\s+/g,
    "+"
  )}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
