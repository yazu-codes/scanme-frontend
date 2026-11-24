// Flavour notes, honestly: taken from what the owner wrote in the
// description ("мента, лимон и лед" -> мента · лимон · лед). There is no
// strength or popularity data in the API, so none is shown.
export function flavourNotes(description) {
  const text = String(description || "").trim();
  if (!text) return [];
  const parts = text
    .split(/\s*(?:,|;|\+|&|\/|\s+и\s+|\s+and\s+|\s+with\s+|\s+с\s+)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2 || parts.length > 6 || parts.some((p) => p.length > 24)) return [];
  return parts;
}

// "02-01" style level code for a node path ("1-0" -> "02·01").
export function levelCode(path) {
  if (path == null) return "";
  return path
    .split("-")
    .map((n) => String(Number(n) + 1).padStart(2, "0"))
    .join("·");
}
