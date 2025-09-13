// src/app/(site)/skilled/[country]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSkilledCountrySlugs,
  getSkilledCountries,
  getSkilledPrograms,
  loadCountryPage,
  // if you also have getCountryFrontmatter in skilled-content you can switch like residency
} from "@/lib/skilled-content";
import { baseFromCategory } from "@/lib/section-helpers";
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

export const revalidate = 86400;

/** SSG params */
export async function generateStaticParams() {
  const slugs = await getSkilledCountrySlugs();
  return slugs.map((country) => ({ country }));
}

/** SEO */
export async function generateMetadata({
  params,
}: {
  params: { country: string };
}): Promise<Metadata> {
  const all = await getSkilledCountrySlugs();
  if (!all.includes(params.country)) return { title: "Skilled country not found" };

  const { meta } = await loadCountryPage(params.country);

  const heroImage = (meta as any).heroImage as string | undefined;
  const title =
    (meta as any).seo?.title ??
    (meta as any).metaTitle ??
    (meta as any).title ??
    (meta as any).name ??
    `${params.country} — Skilled Migration`;

  const description =
    (meta as any).seo?.description ??
    (meta as any).metaDescription ??
    (meta as any).summary ??
    (meta as any).description ??
    `Skilled migration programs in ${(meta as any).name ?? params.country}.`;

  const keywords =
    ((meta as any).seo?.keywords as string[] | undefined) ??
    ((meta as any).keywords as string[] | undefined);

  const canonical = `${baseFromCategory("skilled")}/${params.country}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, images: [heroImage ?? "/og.jpg"] },
  };
}

export default async function CountryPage({ params }: { params: { country: string } }) {
  const slugs = await getSkilledCountrySlugs();
  if (!slugs.includes(params.country)) notFound();

  const { meta, content } = await loadCountryPage(params.country);
  const programs = await getSkilledPrograms(params.country);

  const countryName = (meta as any).country ?? (meta as any).name ?? params.country;

  // ---- RANGES (same as residency) ----
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

  // ---- OPTIONAL META FIELDS ----
  const { overview, keyPoints, facts, applicationProcess, requirements, faq, introPoints } =
    (meta as any) as Record<string, any>;

  // ---- RELATED (match residency logic exactly) ----
  const related = getSkilledCountries()
    .filter((c) => c.countrySlug !== params.country)
    .slice(0, 2);

  const videoSrc = (meta as any).heroVideo as string | undefined;
  const poster = (meta as any).heroPoster as string | undefined;
  const heroImage = (meta as any).heroImage as string | undefined;

  return (
    <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-black">
      <h1 className="sr-only">Skilled migration in {countryName}</h1>

      <JsonLd
        data={breadcrumbLd([
          { name: "Skilled", url: baseFromCategory("skilled") },
          { name: countryName, url: `${baseFromCategory("skilled")}/${params.country}` },
        ])}
      />

      <section className="pt-4">
        <MediaHero
          title={(meta as any).title ?? (meta as any).name ?? countryName}
          subtitle={(meta as any).summary ?? (meta as any).description}
          videoSrc={videoSrc}
          poster={poster}
          imageSrc={heroImage}
          actions={[{ href: "/PersonalBooking", label: "Book Consultation", variant: "primary" }]}
        />
      </section>

      <div className="mt-3">
        <Breadcrumb />
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-12">
        <aside className="md:col-span-4 space-y-6">
          <SidebarStatsPanel
            programsCount={programs.length}
            investRange={minInvestmentRange}
            timelineRange={timelineRange}
          />
          <SidebarProgramsList country={countryName} programs={programs} />
          <SidebarHighlights points={introPoints} />
          <div className="hidden md:block">
            <ContactForm />
          </div>
        </aside>

        <div className="md:col-span-8 space-y-8">
          <AboutCountrySection country={countryName} overview={overview} facts={facts} />
          <WhyCountrySection country={countryName} points={keyPoints} />
          <ProcessSteps steps={applicationProcess} />
          <EligibilityRequirements items={requirements} />
          <FAQSection faqs={faq} />
          <MDXDetailsSection country={countryName} content={content} />
          <div className="md:hidden">
            <ContactForm />
          </div>
        </div>
      </div>

      <RelatedCountriesSection related={related} />
    </main>
  );
}
