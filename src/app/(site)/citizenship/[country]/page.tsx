// src/app/(site)/citizenship/[country]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCitizenshipCountrySlugs,
  getCitizenshipPrograms,
  loadCountryPage,
  getCountryFrontmatter,
  getCitizenshipCountries,
} from "@/lib/citizenship-content";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import MediaHero from "@/components/Residency/MediaHero";
import ContactForm from "@/components/ContactForm";
import Breadcrumb from "@/components/Common/Breadcrumb";

/* Shared modular sections */
import SidebarStatsPanel from "@/components/Residency/Country/SidebarStatsPanel";
import SidebarProgramsList from "@/components/Residency/Country/SidebarProgramsList";
import SidebarHighlights from "@/components/Residency/Country/SidebarHighlights";
import AboutCountrySection from "@/components/Residency/Country/AboutCountrySection";
import WhyCountrySection from "@/components/Residency/Country/WhyCountrySection";
import ProcessSteps from "@/components/Residency/Country/ProcessSteps";
import EligibilityRequirements from "@/components/Residency/Country/EligibilityRequirements";
import FAQSection from "@/components/Residency/Country/FAQSection";
import MDXDetailsSection from "@/components/Residency/Country/MDXDetailsSection";
import RelatedCountriesSection from "@/components/Residency/Country/RelatedCountriesSection";

// Only include what you actually need. Examples:
export const runtime = 'nodejs';          // or 'edge'
export const dynamic = 'force-static';    // or 'force-dynamic'
export const revalidate = 86400;          // 24h — must be a literal number
// export const preferredRegion = ['iad1'];  // if you used it before


/** SSG params */
export async function generateStaticParams() {
  return getCitizenshipCountrySlugs().map((slug) => ({ country: slug }));
}

/** SEO */
export async function generateMetadata(
  props: {
    params: Promise<{ country: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const meta = getCountryFrontmatter(params.country);
  const heroImage = (meta as any).heroImage as string | undefined;
  const title = (meta as any).seo?.title ?? meta.title;
  const description = (meta as any).seo?.description ?? meta.summary;
  const keywords = (meta as any).seo?.keywords as string[] | undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/citizenship/${params.country}` },
    openGraph: { title, description, images: [heroImage ?? "/og.jpg"] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage ?? "/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      // NOTE: dashed keys inside googleBot are required by Next's Metadata types
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/** Page */
export default async function CountryPage(
  props: {
    params: Promise<{ country: string }>;
  }
) {
  const params = await props.params;
  const { meta, content } = await loadCountryPage(params.country);
  const programs = getCitizenshipPrograms(params.country);

  // Hero media
  const videoSrc = (meta as any).heroVideo as string | undefined;
  const poster = (meta as any).heroPoster as string | undefined;
  const heroImage = (meta as any).heroImage as string | undefined;

  // Country-level stats from MDX (you added these in _country.mdx)
  const visaFreeCount = (meta as any).visaFreeCount as number | undefined;
  const passportRank = (meta as any).passportRank as number | undefined;

  // Aggregates (ranges) from program cards
  const minInvestments = programs
    .map((p) => p.minInvestment)
    .filter((n): n is number => typeof n === "number");
  const timelines = programs
    .map((p) => p.timelineMonths)
    .filter((n): n is number => typeof n === "number");

  const minInvestmentRange =
    minInvestments.length && programs[0]?.currency
      ? `${Math.min(...minInvestments).toLocaleString()}–${Math.max(
          ...minInvestments
        ).toLocaleString()} ${programs[0].currency}`
      : "Varies";

  const timelineRange = timelines.length
    ? `${Math.min(...timelines)}–${Math.max(...timelines)} months`
    : "Varies";

  // Optional fields from frontmatter
  const {
    overview,
    keyPoints,
    facts,
    applicationProcess,
    requirements,
    faq,
    introPoints,
  } = meta as any;

  // Related countries (simple: any other 2)
  const related = getCitizenshipCountries()
    .filter((c) => c.countrySlug !== params.country)
    .slice(0, 2);

  return (
    <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-black">
      <h1 className="sr-only">Citizenship in {meta.country}</h1>

      <JsonLd
        data={breadcrumbLd([
          { name: "Citizenship", url: "/citizenship" },
          { name: meta.country, url: `/citizenship/${params.country}` },
        ])}
      />

      {/* HERO */}
      <section className="pt-4">
        <MediaHero
          title={meta.title}
          subtitle={meta.summary}
          videoSrc={videoSrc}
          poster={poster}
          imageSrc={heroImage}
          actions={[
            {
              href: "/PersonalBooking",
              label: "Book Consultation",
              variant: "primary",
            },
          ]}
        />
      </section>

      <div className="mt-3">
        <Breadcrumb />
      </div>



      {/* LAYOUT */}
      <div className="mt-6 grid gap-8 md:grid-cols-12">
        {/* Sidebar */}
        <aside className="md:col-span-4 space-y-6">
          <SidebarStatsPanel
            {...({
              programsCount: programs.length,
              investRange: minInvestmentRange,
              timelineRange,
              visaFreeCount,
              passportRank,
            } as any)}
          />
          <div id="programs-list">
            <SidebarProgramsList country={meta.country} programs={programs} />
          </div>
          <SidebarHighlights points={introPoints} />
          <div className="hidden md:block">
            <ContactForm />
          </div>
        </aside>

        {/* Main content */}
        <div className="md:col-span-8 space-y-8">
          <AboutCountrySection
            country={meta.country}
            overview={overview}
            facts={facts}
          />
          <WhyCountrySection country={meta.country} points={keyPoints} />
          <ProcessSteps steps={applicationProcess} />
          <EligibilityRequirements items={requirements} />
          <FAQSection faqs={faq} />
          <MDXDetailsSection country={meta.country} content={content} />
          <div id="contact" className="md:hidden">
            <ContactForm />
          </div>
        </div>
      </div>

      <RelatedCountriesSection related={related} />

    </main>
  );
}

/* ----------------- Small UI helpers ----------------- */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-4 dark:bg-neutral-950 dark:ring-neutral-800">
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </div>
  );
}
