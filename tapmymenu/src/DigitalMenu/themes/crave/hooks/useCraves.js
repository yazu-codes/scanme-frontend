import { useCallback, useEffect, useMemo, useState } from "react";
import { dishIdentity } from "../../shared/menuKit";

// Dishes are stored by dishIdentity (pairing key + original name), so
// the list survives a language switch and two dishes that share a
// pairing key never get mixed up.
//
// "My table": the dishes a guest has craved (double-tap or ♥), kept on
// THEIR phone only (localStorage, per menu). Nothing is sent anywhere.
// Storage can be unavailable (private mode, blocked): then the list just
// lives in memory for the visit.
function load(key) {
  try {
    const raw = window.localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((k) => typeof k === "string") : [];
  } catch (e) {
    return [];
  }
}

export default function useCraves(urlname) {
  const storageKey = `dm-crave:${urlname}`;
  const [keys, setKeys] = useState(() => load(storageKey));

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(keys));
    } catch (e) {
      // storage unavailable: keep the in-memory list
    }
  }, [storageKey, keys]);

  const set = useMemo(() => new Set(keys), [keys]);
  const has = useCallback((item) => set.has(dishIdentity(item)), [set]);

  // Returns true when the dish was added, false when removed.
  const toggle = useCallback(
    (item) => {
      const k = dishIdentity(item);
      const adding = !set.has(k);
      setKeys((prev) => (adding ? [...prev.filter((x) => x !== k), k] : prev.filter((x) => x !== k)));
      return adding;
    },
    [set]
  );
  const add = useCallback((item) => {
    const k = dishIdentity(item);
    setKeys((prev) => (prev.includes(k) ? prev : [...prev, k]));
  }, []);
  const remove = useCallback((item) => {
    const k = dishIdentity(item);
    setKeys((prev) => prev.filter((x) => x !== k));
  }, []);
  const clear = useCallback(() => setKeys([]), []);

  return { keys, has, toggle, add, remove, clear };
}
