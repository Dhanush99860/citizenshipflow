import React from "react";
import type { Metadata } from "next";

import Header from "@/components/Layout/Header";

// render the dynamic subtree on the client to avoid SSR/CSR differences
import ClientOnly from "@/components/Common/ClientOnly";

import Hero from "@/components/Home/Hero";
import WhyChooseUs from "@/components/Home/whychooseus";
import FAQJourney from "@/components/Home/FAQJourney";
import BottomContactBar from "@/components/Common/BottomContactBar";

import InsightsPreview from "@/components/Insights/InsightsPreview";
import ResidencyPreview from "@/components/Residency/ResidencyPreview";
import SkilledPreview from "@/components/Skilled/SkilledPreview";
import CitizenshipPreview from "@/components/Citizenship/CitizenshipPreview";
import CorporatePreview from "@/components/Corporate/CorporatePreview";
import AdvisorConsultationCard from "@/components/Citizenship/AdvisorConsultationCard";

// Revalidate home once per day (adjust as needed)
export const revalidate = 86400; // seconds

export const metadata: Metadata = {
  title: "XIPHIAS Immigration – Global Residency & Citizenship Solutions",
  description:
    "XIPHIAS Immigration is a leading immigration consultancy offering Residency by Investment, Citizenship by Investment, Business, and Skilled Migration solutions.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "XIPHIAS Immigration – Global Residency & Citizenship Solutions",
    description:
      "Explore Residency and Citizenship by Investment programs with XIPHIAS Immigration. Trusted by entrepreneurs, investors, and professionals worldwide.",
    url: "https://www.xiphiasimmigration.com",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "XIPHIAS Immigration – Global Residency & Citizenship Solutions",
    description:
      "Leading consultants for Residency & Citizenship by Investment. Build your global future with XIPHIAS Immigration.",
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

          {/* ADVISOR SPOTLIGHT (component) */}
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
