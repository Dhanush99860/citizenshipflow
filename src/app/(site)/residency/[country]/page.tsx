import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getResidencyCountrySlugs,
  getResidencyPrograms,
  loadCountryPage,
  getCountryFrontmatter,
  getResidencyCountries,
} from "@/lib/residency-content";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import MediaHero from "@/components/Residency/MediaHero";
import ContactForm from "@/components/ContactForm";
import Breadcrumb from "@/components/Common/Breadcrumb";

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

export const runtime = "nodejs";
export const revalidate = 86400;         // ISR (24h)
export const dynamicParams = true;       // allow params not returned at build

// Normalize to lowercase so /residency/bulgaria works on case-sensitive Linux
function canonicalize(slug: string) {
  const all = getResidencyCountrySlugs();
  return (
    all.find((s) => s.toLowerCase() === slug.toLowerCase()) ??
    slug.toLowerCase()
  );
}

/** Pre-render known slugs; normalize to lowercase */
export async function generateStaticParams() {
  return getResidencyCountrySlugs().map((slug) => ({
    country: slug.toLowerCase(),
  }));
}

/** SEO */
export async function generateMetadata({
  params,
}: {
  params: { country: string };
}): Promise<Metadata> {
  const slug = canonicalize(params.country);

  try {
    const meta: any = getCountryFrontmatter(slug);
    const heroImage = meta?.heroImage as string | undefined;
    const title = meta?.seo?.title ?? meta?.title ?? "Residency";
    const description = meta?.seo?.description ?? meta?.summary ?? "";
    const keywords = (meta?.seo?.keywords as string[] | undefined) ?? undefined;

    return {
      title,
      description,
      keywords,
      alternates: { canonical: `/residency/${slug}` },
      openGraph: { title, description, images: [heroImage ?? "/og.jpg"] },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [heroImage ?? "/og.jpg"],
      },
    };
  } catch {
    // If frontmatter is missing, don't crash the build
    return { title: "Residency", description: "" };
  }
}

/** Page */
export default async function CountryPage({
  params,
}: {
  params: { country: string };
}) {
  const slug = canonicalize(params.country);

  let meta: any, content: any;
  try {
    ({ meta, content } = await loadCountryPage(slug));
  } catch {
    // Content not found -> proper 404
    notFound();
  }

  const programs = getResidencyPrograms(slug) ?? [];

  const videoSrc = meta?.heroVideo as string | undefined;
  const poster = meta?.heroPoster as string | undefined;
  const heroImage = meta?.heroImage as string | undefined;

  const minInvestments = programs
    .map((p: any) => p.minInvestment)
    .filter((n: any) => typeof n === "number");
  const timelines = programs
    .map((p: any) => p.timelineMonths)
    .filter((n: any) => typeof n === "number");

  const minInvestmentRange =
    minInvestments.length && programs[0]?.currency
      ? `${Math.min(...minInvestments).toLocaleString()}–${Math.max(
          ...minInvestments
        ).toLocaleString()} ${programs[0].currency}`
      : "Varies";

  const timelineRange = timelines.length
    ? `${Math.min(...timelines)}–${Math.max(...timelines)} months`
    : "Varies";

  const {
    overview,
    keyPoints,
    facts,
    applicationProcess,
    requirements,
    faq,
    introPoints,
  } = (meta ?? {}) as any;

  const related = getResidencyCountries()
    .filter((c: any) => (c.countrySlug ?? "").toLowerCase() !== slug)
    .slice(0, 2);

  return (
    <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-black">
      <h1 className="sr-only">Residency in {meta?.country ?? slug}</h1>

      <JsonLd
        data={breadcrumbLd([
          { name: "Residency", url: "/residency" },
          { name: meta?.country ?? slug, url: `/residency/${slug}` },
        ])}
      />

      {/* HERO */}
      <section className="pt-4">
        <MediaHero
          title={meta?.title ?? "Residency"}
          subtitle={meta?.summary ?? ""}
          videoSrc={videoSrc}
          poster={poster}
          imageSrc={heroImage}
          actions={[
            { href: "/personal-booking", label: "Book Consultation", variant: "primary" },
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
            programsCount={programs.length}
            investRange={minInvestmentRange}
            timelineRange={timelineRange}
          />
          <SidebarProgramsList country={meta?.country ?? slug} programs={programs} />
          <SidebarHighlights points={introPoints} />
          <div className="hidden md:block">
            <ContactForm />
          </div>
        </aside>

        {/* Main content */}
        <div className="md:col-span-8 space-y-8">
          <AboutCountrySection country={meta?.country ?? slug} overview={overview} facts={facts} />
          <WhyCountrySection country={meta?.country ?? slug} points={keyPoints} />
          <ProcessSteps steps={applicationProcess} />
          <EligibilityRequirements items={requirements} />
          <FAQSection faqs={faq} />
          <MDXDetailsSection country={meta?.country ?? slug} content={content} />
          <div className="md:hidden">
            <ContactForm />
          </div>
        </div>
      </div>

      <RelatedCountriesSection related={related} />
    </main>
  );
}