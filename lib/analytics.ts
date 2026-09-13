// lib/analytics.ts
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks affiliate or outbound streaming clicks to GA4
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
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
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
};
