// src/app/page.tsx
import React from "react";
import type { Metadata } from "next";

import Header from "@/components/Layout/Header";

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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "XIPHIAS Immigration – Global Residency & Citizenship Solutions",
    description:
      "Explore Residency and Citizenship by Investment programs with XIPHIAS Immigration. Trusted by entrepreneurs, investors, and professionals worldwide.",
    url: "https://www.xiphiasimmigration.com",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: ["/og.jpg"], // 1200x630 in /public
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
        <Hero />
        <WhyChooseUs />
        <ResidencyPreview />
        <CitizenshipPreview />
        {/* ADVISOR SPOTLIGHT (component) */}
        <section className="scroll-mt-28 max-w-screen-xl mx-auto py-6 px-4">
          <AdvisorConsultationCard
            advisorName="Varun Singh"
            role="CBI & RBI - MD XIPHIAS"
            avatarSrc="/images/avtar/varun-singh.png"
            bookingUrl="/PersonalBooking"
            brochureUrl="/brochures/citizenship/grenada/real-estate.pdf"
            priceOptions={[
              {
                id: "std", label: "45–60 mins", price: "₹15,500", best: true, bullets: [
                  "Eligibility triage & risk pointers",
                  "Route comparison (donation vs real estate)",
                  "Project shortlist & checklist",
                ]
              },
              {
                id: "deep", label: "90 mins (in-depth)", price: "₹25,500", bullets: [
                  "Everything in Standard",
                  "File strategy & timeline modeling",
                  "Follow-up summary & next steps",
                ]
              },
            ]}
          />
        </section>
        <SkilledPreview />
        <CorporatePreview />
        <FAQJourney />
        <InsightsPreview />
        <BottomContactBar />
      </main>
    </>
  );
}
