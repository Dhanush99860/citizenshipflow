import type { Metadata } from "next";
import {
  getSkilledCountries,
  getSkilledPrograms,
  type ProgramMeta,
  type CountryMeta,
} from "@/lib/skilled-content";

import ResidencyHero from "@/components/Residency/ResidencyHero";
import ResidencyLanding from "@/components/Residency/ResidencyLanding";

import InsightsPreview from "@/components/Insights/InsightsPreview";

import Footer from "@/components/Layout/Footer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Skilled Migration & Work Permits – Countries & Options",
  description:
    "Explore skilled migration, points-based PR, work permits and talent visas by country. Compare timelines, eligibility and costs.",
  alternates: { canonical: "/skilled" },
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

export default function SkilledPage() {
  // Use the skilled lib exactly like the residency landing does
  const countries: CountryMeta[] = getSkilledCountries();
  const programs: ProgramMeta[] = getSkilledPrograms();
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
