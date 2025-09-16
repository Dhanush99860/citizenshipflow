import type { Metadata } from "next";
import {
  getCorporateCountries,
  getCorporatePrograms,
  type ProgramMeta,
  type CountryMeta,
} from "@/lib/corporate-content";

import ResidencyHero from "@/components/Residency/ResidencyHero";
import ResidencyLanding from "@/components/Residency/ResidencyLanding";

import InsightsPreview from "@/components/Insights/InsightsPreview";

import Footer from "@/components/Layout/Footer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Corporate Immigration & Company Setup – Countries & Options",
  description:
    "Explore corporate immigration, employer-sponsored permits, and company setup options by country. Compare timelines, requirements, and costs.",
  alternates: { canonical: "/corporate" },
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

export default function CorporatePage() {
  const countries: CountryMeta[] = getCorporateCountries();
  const programs = getCorporatePrograms();
  const top10 = pickTopPrograms(programs, 10);

  return (
    <>
      <main className="max-w-screen-2xl mx-auto px-4 py-10">
        <ResidencyHero />
        <ResidencyLanding countries={countries} topPrograms={top10} />
      </main>

      <InsightsPreview limit={6} />
      <Footer />
    </>
  );
}
