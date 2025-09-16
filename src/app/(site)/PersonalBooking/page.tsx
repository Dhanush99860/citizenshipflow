import Hero from "@/components/PersonalBooking/Hero";
import Details from "@/components/PersonalBooking/Details";
import PressReleased from "@/components/Common/PressReleased";
import FAQSection from "@/components/Common/FAQSection";

// ✅ NEW: use the server-only insights loader instead of old getArticles
import { getAllInsights } from "@/lib/insights-content";

import type { Metadata } from "next";

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: "Book a Private Consultation | XIPHIAS Immigration",
  description:
    "Book a personal consultation with XIPHIAS Immigration. With over 15 years of expertise and a 92% success rate in Golden Visa, PR, and Investment Migration programs, we empower investors, entrepreneurs, and families worldwide.",
  keywords: [
    "XIPHIAS Immigration",
    "Golden Visa Consultation",
    "Residency by Investment",
    "Citizenship by Investment",
    "Investment Migration",
    "Permanent Residency",
    "Global Mobility",
    "Immigration Consultants",
  ],
  openGraph: {
    title: "Book a Private Consultation | XIPHIAS Immigration",
    description:
      "Trusted advisors with 15+ years of excellence and a 92% success rate in global investment migration programs. Book your private consultation today.",
    url: "https://www.xiphiasimmigration.com/personal-booking",
    siteName: "XIPHIAS Immigration",
    images: [
      {
        url: "https://www.xiphiasimmigration.com/images/og-personal-booking.jpg",
        width: 1200,
        height: 630,
        alt: "Book a Consultation with XIPHIAS Immigration",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Private Consultation | XIPHIAS Immigration",
    description:
      "Book your personal consultation with XIPHIAS Immigration. Trusted by 10K+ clients across 25+ global programs.",
    images: ["https://www.xiphiasimmigration.com/images/og-personal-booking.jpg"],
  },
  alternates: { canonical: "https://www.xiphiasimmigration.com/personal-booking" },
  robots: { index: true, follow: true },
};

// -------------------------------
// Page Component (SERVER) ✅
// -------------------------------
export default async function PersonalBookingPage() {
  // Pull latest 6 articles from /content/articles/**
  const { items } = await getAllInsights({ kind: "article", pageSize: 6 });

  // Map to a simple shape the client component can render
  const articles = items.map((i) => ({
    title: i.title,
    url: `/articles/${i.slug}`, // pretty detail URL
    date: i.date,
    summary: i.summary,
    hero: i.hero,
    tags: i.tags,
  }));

  return (
    <main className="bg-light_bg dark:bg-dark_bg text-light_text dark:text-dark_text">
      <Hero />

      {/* Pass plain data to the client component */}
      <Details articles={articles} />

      <PressReleased />
      <FAQSection />

      {/* JSON-LD (your existing data) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            /* ...same as yours... */
          }),
        }}
      />
    </main>
  );
}
