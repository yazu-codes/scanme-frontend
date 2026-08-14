import { useEffect, useState } from "react";
import { API_BASE } from "../constants";
import Cookies from 'js-cookie';

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
        // Get language from cookie (default to "en")
        const language = Cookies.get('app_locale') || 'bg';

        let menuUrl = `https://${API_BASE}/${urlname}?lang=${language}`

        console.log("MENU URL:", menuUrl)

        const res = await fetch(menuUrl);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          // console.log(data.menu)
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
