// app/about/page.tsx
import type { Metadata } from "next";

// sections
import HeroAbout from "@/components/about/HeroAbout";
import Credibility from "@/components/about/Credibility";
import Services from "@/components/about/Services";
import WhyUs from "@/components/about/WhyUs";
import OutcomesHNIs from "@/components/about/OutcomesHNIs";
import ProgramsSpotlight from "@/components/about/ProgramsSpotlight";
import PrivateClientDesk from "@/components/about/PrivateClientDesk";
import CaseStudies from "@/components/about/CaseStudies";
import Leadership from "@/components/about/Leadership";
import Timeline from "@/components/about/Timeline";
import Compliance from "@/components/about/Compliance";
import FAQ from "@/components/about/FAQ";

export const metadata: Metadata = {
  title:
    "About XIPHIAS Immigration – Residency, Citizenship, Corporate & Skilled Migration",
  description:
    "Trusted by HNIs, investors and enterprises. Licensed, transparent and results-focused immigration advisory with concierge handling and strict privacy.",
  alternates: { canonical: "https://www.xiphiasimmigration.com/about" },
  openGraph: {
    title:
      "About XIPHIAS Immigration – Trusted Partner for HNIs & Corporates",
    description:
      "Discover our mission, outcomes, flagship programs, leadership and why global clients choose us.",
    url: "https://www.xiphiasimmigration.com/about",
    siteName: "XIPHIAS Immigration",
    images: [{ url: "/og/about.jpg", width: 1200, height: 630, alt: "XIPHIAS Immigration" }],
    type: "website",
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title:
      "About XIPHIAS Immigration – Trusted Partner for HNIs & Corporates",
    description:
      "Licensed. Transparent. Concierge-level advisory for residency, citizenship & enterprise mobility.",
    images: ["/og/about.jpg"],
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "XIPHIAS Immigration",
  url: "https://www.xiphiasimmigration.com",
  logo: "https://www.xiphiasimmigration.com/logo.png",
  sameAs: [
    "https://www.linkedin.com/company/xiphias-immigration/",
    "https://twitter.com/xiphiasimmig",
  ],
  description:
    "Global immigration consultancy for Residency, Citizenship, Corporate Mobility and Skilled Migration.",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["en"],
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you guarantee visa approvals?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No. We never guarantee outcomes. We provide regulation-aligned advice, meticulous documentation and transparent eligibility so risks are minimized.",
      },
    },
    {
      "@type": "Question",
      name: "Is my information confidential?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. We operate with strict confidentiality, access controls and encrypted storage to protect HNI data and corporate information.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer paid expert consultations?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. You can book a priority, fee-based session with a senior expert for in-depth strategy and program selection.",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0A0B0F] dark:text-white">
        <HeroAbout />
        <Credibility />
        <Services />
        <WhyUs />
        <OutcomesHNIs />
        <ProgramsSpotlight />
        <PrivateClientDesk />
        <CaseStudies />
        <Leadership />
        <Timeline />
        <Compliance />
        <FAQ />
      </main>
    </>
  );
}
