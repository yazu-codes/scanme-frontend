import { useEffect, useState } from "react";
import { API_BASE } from "../constants";

// Fetches the menu for `urlname` and exposes { menu, status }.
// status is one of "loading" | "error" | "ready".
// This is the ONLY place network requests for menu data happen.
export default function useMenuData(urlname) {
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      setStatus("loading");
      try {
        const res = await fetch(`https://${API_BASE}/${urlname}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setMenu(data.menu);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load menu", err);
          setStatus("error");
        }
      }
    }

    fetchMenu();
    return () => {
      cancelled = true;
    };
  }, [urlname]);

  return { menu, status };
}
