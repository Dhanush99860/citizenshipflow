import React from "react";
import type { Metadata } from "next";

import Header from "@/components/Layout/Header";

// render the dynamic subtree on the client to avoid SSR/CSR differences
import ClientOnly from "@/components/Common/ClientOnly";

import Hero from "@/components/Home/Hero";
// Dynamically import heavier, below-the-fold components to reduce initial bundle size and improve performance.
import dynamic from "next/dynamic";

const WhyChooseUs = dynamic(() => import("@/components/Home/whychooseus"));
const FAQJourney = dynamic(() => import("@/components/Home/FAQJourney"));
const InsightsPreview = dynamic(() => import("@/components/Insights/InsightsPreview"));
const ResidencyPreview = dynamic(() => import("@/components/Residency/ResidencyPreview"));
const SkilledPreview = dynamic(() => import("@/components/Skilled/SkilledPreview"));
const CitizenshipPreview = dynamic(() => import("@/components/Citizenship/CitizenshipPreview"));
const CorporatePreview = dynamic(() => import("@/components/Corporate/CorporatePreview"));
const AdvisorConsultationCard = dynamic(() => import("@/components/Citizenship/AdvisorConsultationCard"));
const BottomContactBar = dynamic(() => import("@/components/Common/BottomContactBar"));

// Revalidate home once per day (adjust as needed)
export const revalidate = 86400; // seconds

export const metadata: Metadata = {
  title: "Best Immigration Consultants in India - XIPHIAS Immigration",
  description:
    "XIPHIAS Immigration is India’s leading immigration consultancy offering Citizenship & Residency by Investment, Business, and Skilled Migration solutions worldwide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Best Immigration Consultants in India – XIPHIAS Immigration",
    description:
      "Leading consultants for residency, citizenship, and skilled migration. Build your global future with XIPHIAS",
    url: "https://www.xiphiasimmigration.com",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Immigration Consultants in India – XIPHIAS Immigration",
    description:
      "Build your global future with XIPHIAS Immigration — experts in residency, citizenship, and migration",
    images: ["/og.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Header />

      {/* Use id="main" so a skip-link can target it from layout.tsx */}
      <main id="main" className="min-h-screen">
        <ClientOnly>
          <Hero />
          <WhyChooseUs />
          <CitizenshipPreview />
          <ResidencyPreview />
          <section className="scroll-mt-28 mx-auto lg:max-w-screen-2xl sm:px-6 lg:px-4">
          <AdvisorConsultationCard bookingHref="/booking?book=paid" />
          </section>

          <CorporatePreview />
          <SkilledPreview />
          <FAQJourney />
          <InsightsPreview />
          <BottomContactBar />
        </ClientOnly>
      </main>
    </>
  );
}
