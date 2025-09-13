import Hero from "@/components/PersonalBooking/Hero";
import Details from "@/components/PersonalBooking/Details";
import { getAllArticlesMeta } from "@/lib/getArticles";
import PressReleased from "@/components/Common/PressReleased";
import FAQSection from "@/components/Common/FAQSection";



import type { Metadata } from "next";


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
  alternates: {
    canonical: "https://www.xiphiasimmigration.com/personal-booking",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// -------------------------------
// Page Component
// -------------------------------
export default function PersonalBookingPage() {
  const articles = getAllArticlesMeta();

  return (
    <main className="bg-light_bg dark:bg-dark_bg text-light_text dark:text-dark_text">
      {/* Hero Section */}
      <Hero />

      {/* Details Sections */}
      <Details articles={articles} />
      
      <PressReleased />
      <FAQSection />
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ /* ...same as yours... */ }),
        }}
      />
    </main>
  );
}
