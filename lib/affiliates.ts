// Central Affiliate & Referral Configuration
// When you get your official affiliate IDs, simply replace the placeholders below.

export const AFFILIATE_CONFIG = {
  // Official OTT Affiliate URLs (Amazon Associates, Impact.com, etc.)
  PRIME_VIDEO: process.env.NEXT_PUBLIC_PRIME_AFFILIATE || "https://www.amazon.com/gp/video/storefront",
  APPLE_TV: process.env.NEXT_PUBLIC_APPLE_AFFILIATE || "https://tv.apple.com",
  
  // High-Conversion VPN Partners (40-100% Commission)
  NORD_VPN: process.env.NEXT_PUBLIC_NORDVPN_AFFILIATE || "https://nordvpn.com",
  SURFSHARK: process.env.NEXT_PUBLIC_SURFSHARK_AFFILIATE || "https://surfshark.com",

  // Business / Sponsored Content Contact
  SPONSOR_EMAIL: "partners@movieint.com",
};

export function getSmartStreamLink(platform: string, title: string): string {
  const query = encodeURIComponent(title);
  switch (platform.toLowerCase()) {
    case "netflix":
      return `https://www.netflix.com/search?q=${query}`;
    case "prime video":
    case "amazon prime":
      return `${AFFILIATE_CONFIG.PRIME_VIDEO}?tag=movieint-20&query=${query}`;
    case "apple tv":
      return `${AFFILIATE_CONFIG.APPLE_TV}`;
    case "disney+":
      return `https://www.disneyplus.com/search?q=${query}`;
    default:
      return `${AFFILIATE_CONFIG.NORD_VPN}`;
  }
}