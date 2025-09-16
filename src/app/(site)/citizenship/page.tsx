// src/app/(site)/citizenship/page.tsx
import type { Metadata } from "next";
import {
  getCitizenshipCountries,
  getCitizenshipPrograms,
  ProgramMeta,
  CountryMeta,
} from "@/lib/citizenship-content";

import HeroPremium from "@/components/Citizenship/HeroPremium";
import OurOffer from "@/components/Citizenship/OurOffer";
import TestimonialCarousel from "@/components/Citizenship/TestimonialCarousel";
import InsightsPreview from "@/components/Insights/InsightsPreview";
// import Footer from "@/components/Layout/Footer";
import { JsonLd } from "@/lib/seo";
import ExploreGrid from "@/components/Citizenship/ExploreGrid";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Citizenship Programs – Countries & Options",
  description:
    "Explore citizenship routes by country. Compare timelines, requirements and costs. Book a personal consultation.",
  alternates: { canonical: "/citizenship" },
  openGraph: { images: ["/og.jpg"] },
  twitter: { images: ["/og.jpg"], card: "summary_large_image" },
};

/** Server ranker for JSON-LD only */
function pickTopProgramsForLd(all: ProgramMeta[], n = 5): ProgramMeta[] {
  const ranked = [...all].sort((a, b) => {
    const tA = a.timelineMonths ?? Number.MAX_SAFE_INTEGER;
    const tB = b.timelineMonths ?? Number.MAX_SAFE_INTEGER;
    if (tA !== tB) return tA - tB;
    const iA = a.minInvestment ?? Number.MAX_SAFE_INTEGER;
    const iB = b.minInvestment ?? Number.MAX_SAFE_INTEGER;
    if (iA !== iB) return iA - iB;
    return (a.title + a.country).localeCompare(b.title + b.country);
  });
  return ranked.slice(0, n);
}

export default function CitizenshipPage() {
  const countries: CountryMeta[] = getCitizenshipCountries();
  const programs: ProgramMeta[] = getCitizenshipPrograms();
  const top5 = pickTopProgramsForLd(programs, 5);

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Citizenship Programs – Countries & Options",
    url: "https://yourdomain.com/citizenship",
    description:
      "Explore citizenship routes by country. Compare timelines, requirements and costs. Book a personal consultation.",
  };
  const countryListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Citizenship Countries",
    itemListElement: countries.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://yourdomain.com/citizenship/${c.countrySlug}`,
      name: c.title || c.country,
    })),
  };
  const topProgramsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Citizenship Programs",
    itemListElement: top5.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://yourdomain.com/citizenship/${p.countrySlug}/${p.programSlug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={countryListLd} />
      <JsonLd data={topProgramsLd} />

      <main className="max-w-screen-2xl mx-auto px-4 py-10 text-black dark:text-white">
        <HeroPremium className="mb-6" />
        <ExploreGrid countries={countries} programs={programs} />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <OurOffer className="lg:col-span-2" />
          <TestimonialCarousel
            items={[
              { quote: "Flawless execution from due diligence to passport delivery.", author: "Family Office, Dubai" },
              { quote: "Transparent costs and genuinely vetted projects.", author: "HNWI, Singapore" },
              { quote: "Impressive compliance depth—exactly what we needed.", author: "Private Banker, Zurich" },
            ]}
          />
        </div>
      </main>

      <InsightsPreview limit={6} />
      {/* <Footer /> */}
    </>
  );
}
