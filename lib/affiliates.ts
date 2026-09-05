// Central Affiliate & Referral Configuration
// When you get your official affiliate IDs, simply replace the placeholders below.

export const AFFILIATE_CONFIG = {
  // Official Amazon Associate ID
  AMAZON_TAG: "movieint-20",

  // Official OTT Affiliate URLs (Amazon Associates, Impact.com, etc.)
  PRIME_VIDEO: process.env.NEXT_PUBLIC_PRIME_AFFILIATE || "https://www.amazon.com/s",
  APPLE_TV: process.env.NEXT_PUBLIC_APPLE_AFFILIATE || "https://tv.apple.com",
  
  // High-Conversion VPN Partners (40-100% Commission)
  // NordVPN approval পাওয়ার পর আপনার ড্যাশবোর্ডের রেফারেল লিঙ্ক এখানে বসাবেন
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
    case "amazon":
      // সরাসরি মুভি সার্চ রেজাল্ট এবং আপনার movieint-20 ট্যাগ যুক্ত হয়ে ওপেন হবে
      return `https://www.amazon.com/s?k=${query}&i=instant-video&tag=${AFFILIATE_CONFIG.AMAZON_TAG}`;

    case "apple tv":
      return `${AFFILIATE_CONFIG.APPLE_TV}`;

    case "disney+":
      return `https://www.disneyplus.com/search?q=${query}`;

    default:
      // অন্য কোনো প্লাটফর্ম না পাওয়া গেলে বাই-ডিফল্ট ভিপিএন অফার লিঙ্ক দেবে
      return `${AFFILIATE_CONFIG.NORD_VPN}`;
  }
}
