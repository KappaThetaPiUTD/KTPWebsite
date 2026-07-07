// Small helper to send custom Google Analytics (GA4) events. Safe to call
// anywhere on the client: it no-ops if gtag isn't loaded (e.g. before hydration
// or if analytics is unavailable).
export function trackEvent(name, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
