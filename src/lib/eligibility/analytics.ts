export function trackEvent(name: string, params: Record<string, any> = {}) {
    // GA4 via gtag
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", name, params);
    }
    // GTM dataLayer fallback
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: name, ...params });
    }
  }
  