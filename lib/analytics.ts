// lib/analytics.ts
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Robust GA4 Event Tracker using both dataLayer and gtag
 */
export const trackAffiliateClick = ({
  movieTitle,
  platform,
  affiliateUrl,
  placement = "streaming_box",
}: {
  movieTitle: string;
  platform: string;
  affiliateUrl: string;
  placement?: string;
}) => {
  if (typeof window !== "undefined") {
    // 1. Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // 2. Direct dataLayer push (Works 100% reliably in Next.js)
    window.dataLayer.push({
      event: "affiliate_click",
      event_category: "Monetization",
      event_label: `${movieTitle} - ${platform}`,
      movie_title: movieTitle,
      streaming_platform: platform,
      destination_url: affiliateUrl,
      placement: placement,
      value: 1,
    });

    // 3. Also dispatch via gtag if available
    if (typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        event_category: "Monetization",
        event_label: `${movieTitle} - ${platform}`,
        movie_title: movieTitle,
        streaming_platform: platform,
        destination_url: affiliateUrl,
        placement: placement,
        value: 1,
      });
    }

    // Console log for quick local/browser verification
    console.log(`[GA4 Event Fired]: affiliate_click -> ${movieTitle} (${platform})`);
  }
};
