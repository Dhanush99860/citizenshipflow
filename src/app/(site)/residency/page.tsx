import type { Metadata } from "next";
import {
  getResidencyCountries,
  getResidencyPrograms,
  ProgramMeta,
  CountryMeta,
} from "@/lib/residency-content";
import ResidencyHero from "@/components/Residency/ResidencyHero";
import ResidencyLanding from "@/components/Residency/ResidencyLanding";
import InsightsPreview from "@/components/Insights/InsightsPreview";
import TestimonialCarousel from "@/components/Citizenship/TestimonialCarousel";
import OurOffer from "@/components/Citizenship/OurOffer";

import Footer from "@/components/Layout/Footer";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Residency Programs – Countries & Options",
  description:
    "Explore residency pathways by country. Compare timelines, requirements and costs. Book a personal consultation.",
  alternates: { canonical: "/residency" },
  openGraph: { images: ["/og.jpg"] },
  twitter: { images: ["/og.jpg"], card: "summary_large_image" },
};

function pickTopPrograms(all: ProgramMeta[], n = 10): ProgramMeta[] {
  const ranked = [...all].sort((a, b) => {
    const tA = a.timelineMonths ?? 999;
    const tB = b.timelineMonths ?? 999;
    if (tA !== tB) return tA - tB;
    const iA = a.minInvestment ?? Number.MAX_SAFE_INTEGER;
    const iB = b.minInvestment ?? Number.MAX_SAFE_INTEGER;
    if (iA !== iB) return iA - iB;
    return (a.title + a.country).localeCompare(b.title + b.country);
  });
  return ranked.slice(0, n);
}

export default function ResidencyPage() {
  const countries: CountryMeta[] = getResidencyCountries();
  const programs = getResidencyPrograms();
  const top10 = pickTopPrograms(programs, 10);

  return (
    <>
      <main className="max-w-screen-2xl mx-auto px-4 py-10">
        <ResidencyHero />
        <ResidencyLanding countries={countries} topPrograms={top10} />
      </main>
      <div className="mt-10 grid gap-6 lg:grid-cols-3 max-w-screen-2xl mx-auto px-4 py-10 text-black dark:text-white">
        <OurOffer className="lg:col-span-2" />
        <TestimonialCarousel
          items={[
            {
              quote:
                "Flawless execution from due diligence to passport delivery.",
              author: "Family Office, Dubai",
            },
            {
              quote: "Transparent costs and genuinely vetted projects.",
              author: "HNWI, Singapore",
            },
            {
              quote: "Impressive compliance depth—exactly what we needed.",
              author: "Private Banker, Zurich",
            },
          ]}
        />
      </div>
      <InsightsPreview limit={6} />
      <Footer />
    </>
  );
}
