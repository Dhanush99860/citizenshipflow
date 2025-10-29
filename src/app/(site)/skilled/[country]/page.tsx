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

// Dynamically import heavy UI sections.  Splitting these into separate
// chunks lowers initial JS and improves the Lighthouse performance score【330944343751455†L23-L112】.
import nextDynamic from "next/dynamic";

const MediaHero = nextDynamic(() => import("@/components/Residency/MediaHero"));
const ContactForm = nextDynamic(() => import("@/components/ContactForm"));
const Breadcrumb = nextDynamic(() => import("@/components/Common/Breadcrumb"));
const SidebarStatsPanel = nextDynamic(() => import("@/components/Skilled/SidebarStatsPanel"));
const SidebarProgramsList = nextDynamic(() => import("@/components/Residency/Country/SidebarProgramsList"));
const SidebarHighlights = nextDynamic(() => import("@/components/Residency/Country/SidebarHighlights"));
const AboutCountrySection = nextDynamic(() => import("@/components/Residency/Country/AboutCountrySection"));
const WhyCountrySection = nextDynamic(() => import("@/components/Residency/Country/WhyCountrySection"));
const ProcessSteps = nextDynamic(() => import("@/components/Residency/Country/ProcessSteps"));
const EligibilityRequirements = nextDynamic(() => import("@/components/Residency/Country/EligibilityRequirements"));
const FAQSection = nextDynamic(() => import("@/components/Residency/Country/FAQSection"));
const MDXDetailsSection = nextDynamic(() => import("@/components/Residency/Country/MDXDetailsSection"));
const RelatedCountriesSection = nextDynamic(() => import("@/components/Residency/Country/RelatedCountriesSection"));

// Only include what you actually need. Examples:
export const runtime = "nodejs"; // or 'edge'
// Revalidate once per day.  We omit the `dynamic` export to avoid conflicts
// with `next/dynamic` imports; Next.js will infer static generation from
// the absence of a `dynamic` config.
export const revalidate = 86400; // 24h — must be a literal number
// export const preferredRegion = ['iad1'];  // if you used it before

/** SSG params */
export async function generateStaticParams() {
  const slugs = await getSkilledCountrySlugs();
  return slugs.map((country) => ({ country }));
}

/** SEO */
export async function generateMetadata(props: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const all = await getSkilledCountrySlugs();
  if (!all.includes(params.country))
    return { title: "Skilled country not found" };

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

  const canonicalPath = `${baseFromCategory("skilled")}/${params.country}`;
  const canonicalUrl = `https://www.xiphiasimmigration.com${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "XIPHIAS Immigration",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: heroImage ?? "/og.jpg",
          width: 1200,
          height: 630,
          alt: `${title} – XIPHIAS Immigration`,
        },
      ],
    },
  };
}

export default async function CountryPage(props: {
  params: Promise<{ country: string }>;
}) {
  const params = await props.params;
  const slugs = await getSkilledCountrySlugs();
  if (!slugs.includes(params.country)) notFound();

  const { meta, content } = await loadCountryPage(params.country);
  const programs = await getSkilledPrograms(params.country);

  const countryName =
    (meta as any).country ?? (meta as any).name ?? params.country;

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
          ...minInvestments,
        ).toLocaleString()} ${programs[0].currency}`
      : "Varies";

  const timelineRange = timelines.length
    ? `${Math.min(...timelines)}–${Math.max(...timelines)} months`
    : "Varies";

  // ---- OPTIONAL META FIELDS ----
  const {
    overview,
    keyPoints,
    facts,
    applicationProcess,
    requirements,
    faq,
    introPoints,
  } = meta as any as Record<string, any>;

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
          {
            name: countryName,
            url: `${baseFromCategory("skilled")}/${params.country}`,
          },
        ])}
      />

      <section className="pt-4">
        <MediaHero
          title={(meta as any).title ?? (meta as any).name ?? countryName}
          subtitle={(meta as any).summary ?? (meta as any).description}
          videoSrc={videoSrc}
          poster={poster}
          imageSrc={heroImage}
          actions={[
            {
              href: "/personal-booking",
              label: "Book Consultation",
              variant: "primary",
            },
          ]}
        />
      </section>

      <div className="mt-3">
        <Breadcrumb />
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-12">
        <aside className="md:col-span-4 space-y-6">
          <SidebarStatsPanel
            programsCount={programs.length}
            timelineRange={timelineRange}
          />
          <SidebarProgramsList country={countryName} programs={programs} />
          <SidebarHighlights points={introPoints} />
          <div className="hidden md:block">
            <ContactForm />
          </div>
        </aside>

        <div className="md:col-span-8 space-y-8">
          <AboutCountrySection
            country={countryName}
            overview={overview}
            facts={facts}
          />
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