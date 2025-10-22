// src/app/(site)/corporate/page.tsx
import type { Metadata } from "next";
import {
  getCorporateCountries,
  getCorporatePrograms,
  type ProgramMeta,
  type CountryMeta,
} from "@/lib/corporate-content";

import CorporateHero from "@/components/Corporate/CorporateHero";
import SkilledOffer from "@/components/Skilled/Overoffer";
import SkilledTestimonialCarousel from "@/components/Skilled/TestimonialCarousel";
import InsightsPreview from "@/components/Insights/InsightsPreview";
import { JsonLd } from "@/lib/seo";
import CorporateExploreGrid from "@/components/Corporate/CorporateExploreGrid"; // corporate-ready grid

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Corporate Setup & Employment Visas — Countries & Options",
  description:
    "Explore corporate routes by country: free zone & mainland company formation, investor/entrepreneur options, employment/work permits, and residence sponsorship. Compare timelines, eligibility, and fees.",
  alternates: { canonical: "/corporate" },
  openGraph: { images: ["/og.jpg"] },
  twitter: { images: ["/og.jpg"], card: "summary_large_image" },
};

/** Server ranker for JSON-LD only (same logic as other verticals) */
function pickTopProgramsForLd(all: ProgramMeta[], n = 5): ProgramMeta[] {
  const key = (x: ProgramMeta) =>
    `${x?.title ?? ""} ${x?.country ?? ""}`.trim();

  const ranked = [...all].sort((a, b) => {
    const tA = a.timelineMonths ?? Number.MAX_SAFE_INTEGER;
    const tB = b.timelineMonths ?? Number.MAX_SAFE_INTEGER;
    if (tA !== tB) return tA - tB;

    const iA = a.minInvestment ?? Number.MAX_SAFE_INTEGER;
    const iB = b.minInvestment ?? Number.MAX_SAFE_INTEGER;
    if (iA !== iB) return iA - iB;

    // fixed locale to avoid SSR/CSR differences
    return key(a).localeCompare(key(b), "en", { sensitivity: "base" });
  });

  return ranked.slice(0, n);
}

export default function CorporatePage() {
  const countries: CountryMeta[] = getCorporateCountries();
  const programs: ProgramMeta[] = getCorporatePrograms();
  const top5 = pickTopProgramsForLd(programs, 5);

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Corporate Setup & Employment Visas — Countries & Options",
    url: "https://yourdomain.com/corporate",
    description:
      "Explore corporate routes by country: free zone & mainland company formation, investor/entrepreneur options, employment/work permits, and residence sponsorship. Compare timelines, eligibility, and fees.",
  };
  const countryListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Corporate Countries",
    itemListElement: countries.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://yourdomain.com/corporate/${c.countrySlug}`,
      name: c.title || c.country,
    })),
  };
  const topProgramsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Corporate Programs",
    itemListElement: top5.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://yourdomain.com/corporate/${p.countrySlug}/${p.programSlug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={countryListLd} />
      <JsonLd data={topProgramsLd} />

      <main className="max-w-screen-2xl mx-auto px-4 py-10 text-black dark:text-white">
        {/* Temporary hero using shared MediaHero (we can replace with CorporateHero later) */}
        <CorporateHero className="mb-6" />
        {/* Corporate grid (countries + best program stats) */}
        <CorporateExploreGrid countries={countries} programs={programs} />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <SkilledOffer className="lg:col-span-2" />
          <SkilledTestimonialCarousel
            items={[
              { quote: "Fast, clear, and accurate guidance on skilled visas.", author: "Software Lead, Berlin" },
              { quote: "They mapped out the best route and handled everything.", author: "Data Scientist, Dubai" },
              { quote: "Transparent timelines and realistic eligibility advice.", author: "Product Manager, Singapore" },
            ]}
          />
        </div>
        {/* Right now we keep the same Insights rail; we’ll swap to corporate-specific promos later */}
        <div className="mt-10">
          <InsightsPreview limit={6} />
        </div>
      </main>
    </>
  );
}
