import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  cloneElement,
  isValidElement,
} from "react";

const DEFAULT_ENDPOINT =
  "https://scanme-analytics-production.up.railway.app/events/";

/** Any element carrying this attribute is tracked on click. */
const CLICK_ATTR = "data-analytics";

const AnalyticsContext = createContext(null);

/**
 * Wrap your app once. Sends a "view" event on mount (and whenever `path`
 * changes), and a "click" event for every click on an element carrying
 * data-analytics="some_name".
 *
 * Renders nothing of its own — it is a pure side-effect provider.
 */
export function AnalyticsProvider({
  clientId,
  endpoint = DEFAULT_ENDPOINT,
  path,
  disabled = false,
  children,
}) {
  // React 18 StrictMode mounts effects twice in development, which would
  // double every page view. Refs survive that remount, so we guard with one.
  const lastViewRef = useRef(null);

  const track = useCallback(
    (name, itemName = "") => {
      if (disabled || !clientId) return;
      if (typeof navigator !== "undefined" && navigator.webdriver) return;

      const payload = JSON.stringify({
        client_id: clientId,
        name,
        corresponding_item_name: itemName,
      });

      // keepalive lets the request finish even if the page is being unloaded.
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        // No cookies or credentials — visitors stay anonymous.
        credentials: "omit",
      })
        .then(async (res) => {
          // fetch only rejects on network errors, so a 4xx lands here.
          // Surface it in development; stay silent in production.
          if (!res.ok && process.env.NODE_ENV !== "production") {
            console.warn(
              `[analytics] ${res.status} for ${name}`,
              "sent:", payload,
              "response:", await res.text()
            );
          }
        })
        .catch(() => {
          // Analytics must never break the host page. Swallow everything.
        });
    },
    [clientId, endpoint, disabled]
  );

  // Page view, on mount and on every subsequent path change.
  // Pass path={null} to suppress it — useful on redirect-only routes that
  // should report their own event instead.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path === null) return;

    const current = path ?? window.location.pathname;
    if (lastViewRef.current === current) return;
    lastViewRef.current = current;

    track("view", current);
  }, [track, path]);

  // One delegated listener for the whole document, so components added later
  // are tracked automatically without re-binding anything.
  useEffect(() => {
    if (disabled || typeof document === "undefined") return;

    const onClick = (event) => {
      // isTrusted is false for clicks synthesised by scripts.
      if (!event.isTrusted) return;

      const el = event.target?.closest?.(`[${CLICK_ATTR}]`);
      if (!el) return;

      const item = el.getAttribute(CLICK_ATTR);
      if (!item) return;

      track(el.getAttribute("data-analytics-event") || "click", item);
    };

    // Capture phase, so the event is recorded even if a handler calls
    // stopPropagation() or the element navigates away.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [track, disabled]);

  return (
    <AnalyticsContext.Provider value={track}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Manual tracking for things that aren't clicks: form submits, video plays,
 * a modal opening.
 *
 *   const track = useAnalytics();
 *   track("submit", "contact_form");
 */
export function useAnalytics() {
  const track = useContext(AnalyticsContext);
  if (!track) {
    throw new Error("useAnalytics must be used inside <AnalyticsProvider>");
  }
  return track;
}

/**
 * Declarative alternative to writing the data attribute by hand.
 *
 *   <Track item="pricing_cta"><button>Get started</button></Track>
 *
 * Adds the attribute to its child rather than wrapping it in a extra element,
 * so it never disturbs your layout.
 */
export function Track({ item, name, children }) {
  if (!isValidElement(children)) return children;

  return cloneElement(children, {
    [CLICK_ATTR]: item,
    ...(name ? { "data-analytics-event": name } : {}),
  });
}