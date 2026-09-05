// Central Affiliate & Referral Configuration
// When you receive your official affiliate IDs, replace the placeholders or set env variables.

export const AFFILIATE_CONFIG = {
  // Official Amazon Associate ID
  AMAZON_TAG: "movieint-20",

  // Official OTT Affiliate URLs (Amazon Associates, Impact.com, etc.)
  PRIME_VIDEO: process.env.NEXT_PUBLIC_PRIME_AFFILIATE || "https://www.amazon.com/s",
  APPLE_TV: process.env.NEXT_PUBLIC_APPLE_AFFILIATE || "https://tv.apple.com",

  // High-Conversion VPN Partners (40-100% Commission)
  // Update with your official partner dashboard referral link once approved
  NORD_VPN: process.env.NEXT_PUBLIC_NORDVPN_AFFILIATE || "https://nordvpn.com",
  SURFSHARK: process.env.NEXT_PUBLIC_SURFSHARK_AFFILIATE || "https://surfshark.com",

  // Business / Sponsored Content Contact
  SPONSOR_EMAIL: "partners@movieint.com",
};

export function getSmartStreamLink(platform: string, title: string): string {
  const query = encodeURIComponent(title);

  switch (platform.trim().toLowerCase()) {
    case "netflix":
      return `https://www.netflix.com/search?q=${query}`;

    case "prime video":
    case "amazon prime":
    case "amazon":
      // Directs to Prime Video search results with the affiliate tracking tag attached
      return `${AFFILIATE_CONFIG.PRIME_VIDEO}?k=${query}&i=instant-video&tag=${AFFILIATE_CONFIG.AMAZON_TAG}`;

    case "apple tv":
      return `${AFFILIATE_CONFIG.APPLE_TV}`;

    case "disney+":
    case "disney plus":
      return `https://www.disneyplus.com/search?q=${query}`;

    default:
      // Fallback redirect to VPN partner page if no matching stream provider is found
      return `${AFFILIATE_CONFIG.NORD_VPN}`;
  }
}
