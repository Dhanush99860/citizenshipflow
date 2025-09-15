// src/app/page.tsx
import React from "react";
import type { Metadata } from "next";

import Header from "@/components/Layout/Header";

import Hero from "@/components/Home/Hero";
import WhyChooseUs from "@/components/Home/whychooseus";
import Platform from "@/components/Home/platform";
import Perks from "@/components/Home/perks";
import BottomContactBar from "@/components/Common/BottomContactBar";

import ArticlesPreview from "@/components/Common/ArticlesSection/ArticlesPreview";
import { getAllArticlesMeta } from "@/lib/getArticles";

import ResidencyPreview from "@/components/Residency/ResidencyPreview";
import SkilledPreview from "@/components/Skilled/SkilledPreview";
import CitizenshipPreview from "@/components/Citizenship/CitizenshipPreview";
import CorporatePreview from "@/components/Corporate/CorporatePreview";


// Revalidate home once per day (adjust as needed)
export const revalidate = 86400; // seconds

// ✅ Full SEO metadata for homepage (uses layout.tsx metadataBase)
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
  // If getAllArticlesMeta() is async in your project, change this file to `export default async function Home()`
  // and `const articles = await getAllArticlesMeta();`
  const articles = getAllArticlesMeta();

  return (
    <>
      <Header />

      {/* Use id="main" so a skip-link can target it from layout.tsx */}
      <main id="main" className="min-h-screen">
        <Hero />
        <WhyChooseUs />
        <ResidencyPreview />
        <CitizenshipPreview />
        <SkilledPreview />
      <CorporatePreview />
        <Platform />
        <ArticlesPreview articles={articles} limit={6} />
        <Perks />
        <BottomContactBar />
      </main>
    </>
  );
}
