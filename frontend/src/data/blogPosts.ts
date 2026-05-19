export type BlogCategory = "Tech" | "Campaign Update" | "Oversight" | "Strategy";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readMinutes: number;
  category: BlogCategory;
  excerpt: string;
  body: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "auditing-county-land-rates",
    title: "Why Magadi loses millions in unaudited corporate land rates each year",
    date: "2026-05-12",
    readMinutes: 6,
    category: "Oversight",
    excerpt:
      "A FinTech engineer's breakdown of how transparent ledgers and automated reconciliation would protect Magadi's revenue base from corporate leakage.",
    body: `Magadi sits on some of the most valuable industrial mineral concessions in East Africa, yet the ward's revenue records remain on paper. \n\nThis post walks through a simple, open-source reconciliation pipeline that any county finance team can deploy in 90 days — and the three controls that would have prevented the leakages flagged in the last Auditor-General report.`,
  },
  {
    slug: "digital-economy-hubs-blueprint",
    title: "The Magadi Digital Economy Hubs Blueprint",
    date: "2026-05-08",
    readMinutes: 5,
    category: "Campaign Update",
    excerpt:
      "Three solar-powered digital hubs across Shompole, Olkiramatian and Entasopia — what they cost, what they unlock, and how they pay for themselves in 18 months.",
    body: `Connectivity is the new tarmac. This is the costed proposal for three community-owned digital hubs offering KRA services, M-Pesa float, free Wi-Fi study zones for KCSE candidates, and a co-working bench for youth running online gigs.`,
  },
  {
    slug: "carbon-credit-allocations",
    title: "Carbon credit allocations: who really owns Magadi's air?",
    date: "2026-04-29",
    readMinutes: 7,
    category: "Strategy",
    excerpt:
      "Carbon markets are reaching Kajiado faster than the policy can absorb them. Here is how I would structure community ownership before the next contract is signed.",
    body: `In the last six months, three brokers have approached community elders about long-tenor carbon offset agreements. The structures on offer transfer 80% of the upside to off-shore intermediaries. This piece proposes a community trust model with on-chain attestation.`,
  },
  {
    slug: "fintech-meets-bursary-distribution",
    title: "FinTech-grade bursary distribution: the end of ghost beneficiaries",
    date: "2026-04-21",
    readMinutes: 4,
    category: "Tech",
    excerpt:
      "Five years inside Equity Bank's KYC stack taught me one thing: identity-bound disbursement kills ghost lists. Here is the architecture I will push for Magadi.",
    body: `From SIM swap controls to one-time payout tokens linked to a verified parent or guardian, this post breaks down the exact controls that would have caught the ghost beneficiary scandal flagged by the 2024 NG-CDF audit.`,
  },
  {
    slug: "ilmeguaraa-age-set-leadership",
    title: "Why the Ilmeguaraa age-set is the most under-utilised political asset in Magadi",
    date: "2026-04-15",
    readMinutes: 5,
    category: "Strategy",
    excerpt:
      "Indigenous governance structures still settle 80% of local disputes faster than any tribunal. We should be plugging them into county policy, not bypassing them.",
    body: `The Ilmeguaraa age-set holds an authority no county committee can replicate. This post lays out a formal advisory role for age-set councils inside the Magadi Ward Development Committee.`,
  },
  {
    slug: "morning-leadership-checkin",
    title: "The 4:00 AM Leadership Check-In — operating cadence for the campaign",
    date: "2026-04-10",
    readMinutes: 3,
    category: "Campaign Update",
    excerpt:
      "Why the team starts at 4 AM, how field reports flow up, and the public dashboard you can use to hold us to it.",
    body: `Discipline compounds. Every morning at 4 AM the ward team files three numbers: voters onboarded, issues resolved, kilometres covered. This is the public-facing version of that dashboard.`,
  },
];
