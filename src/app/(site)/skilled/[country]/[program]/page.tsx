// src/app/(site)/skilled/[country]/[program]/page.tsx
// (same visuals; now EVERYTHING awaited + normalized so no /undefined links)
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSkilledCountrySlugs,
  getSkilledPrograms,
  loadProgramPageSections,
} from "@/lib/skilled-content";
import { baseFromCategory, pickSectionKey, investmentLabel } from "@/lib/section-helpers";

import MediaHero from "@/components/Residency/MediaHero";
import QuickFacts from "@/components/Residency/QuickFacts";
import ProcessTimeline from "@/components/Residency/ProcessTimeline";
import FAQAccordion from "@/components/Residency/FAQAccordion";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import ProgramQuickNav from "@/components/Residency/ProgramQuickNav";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Prose } from "@/components/ui/Prose";
import EligibilityQuickCheck from "@/components/Residency/EligibilityQuickCheck";
import SocialProof from "@/components/Residency/SocialProof";
import Prices from "@/components/Residency/Prices";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const countries = await getSkilledCountrySlugs();
  const params: { country: string; program: string }[] = [];
  for (const c of countries) {
    const progs = await getSkilledPrograms(c);
    for (const p of progs as any[]) {
      const programSlug = p.programSlug ?? p.slug;
      if (!programSlug) continue;
      params.push({ country: c, program: programSlug });
    }
  }
  return params;
}

export async function generateMetadata(
  props: {
    params: Promise<{ country: string; program: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  try {
    const { meta } = await loadProgramPageSections(params.country, params.program);
    const heroImage = (meta as any).heroImage as string | undefined;
    const title =
      (meta as any).seo?.title ??
      (meta as any).metaTitle ??
      (meta as any).title ??
      `${params.program} — ${(meta as any).country ?? params.country}`;
    const description =
      (meta as any).seo?.description ??
      (meta as any).metaDescription ??
      (meta as any).tagline ??
      (meta as any).description;
    const tags: string[] = (meta as any).tags ?? [];
    const keywords =
      (meta as any).seo?.keywords ?? [title, (meta as any).country ?? params.country, ...tags].join(", ");

    const canonical = `${baseFromCategory("skilled")}/${params.country}/${params.program}`;

    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "article",
        url: canonical,
        images: [heroImage ?? "/og.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [heroImage ?? "/og.jpg"],
      },
    };
  } catch {
    return { title: "Program not found" };
  }
}

function similarityScore(
  base: { title: string; tags?: string[] },
  cand: { title: string; tags?: string[] }
) {
  const baseTags = new Set((base.tags ?? []).map((t) => t.toLowerCase()));
  const candTags = new Set((cand.tags ?? []).map((t) => t.toLowerCase()));
  let score = 0;
  candTags.forEach((t) => baseTags.has(t) && (score += 3));
  const b = base.title.toLowerCase();
  const c = cand.title.toLowerCase();
  ["skilled", "talent", "work", "permit", "visa", "points"].forEach(
    (k) => b.includes(k) && c.includes(k) && (score += 1)
  );
  return score;
}

type RelatedItem = {
  url: string;
  title: string;
  country: string;
  minInvestment?: number;
  currency?: string;
  timelineMonths?: number;
  tags?: string[];
  heroImage?: string;
  score: number;
};

export default async function ProgramPage(
  props: {
    params: Promise<{ country: string; program: string }>;
  }
) {
  const params = await props.params;
  try {
    const { meta, sections } = await loadProgramPageSections(
      params.country,
      params.program
    );

    const videoSrc = (meta as any).heroVideo as string | undefined;
    const poster = (meta as any).heroPoster as string | undefined;
    const heroImage = (meta as any).heroImage as string | undefined;
    const brochure =
      ((meta as any).brochure as string | undefined) ??
      `/brochures/skilled/${params.country}/${params.program}.pdf`;

    const processSteps: any[] = (meta as any).processSteps ?? [];
    const quickCheck = (meta as any).quickCheck as any | undefined;
    const prices = (meta as any).prices as
      | { label: string; amount?: number; currency?: string; when?: string; notes?: string }[]
      | undefined;
    const proofOfFunds = (meta as any).proofOfFunds as
      | { label?: string; amount: number; currency?: string; notes?: string }[]
      | undefined;
    const disqualifiers: string[] = (meta as any).disqualifiers ?? [];

    const otherProgramsRaw = await getSkilledPrograms(params.country);
    const otherPrograms = (otherProgramsRaw as any[])
      .map((p) => ({ ...p, programSlug: p.programSlug ?? p.slug }))
      .filter((p) => p.programSlug !== params.program);

    const allCountrySlugs = await getSkilledCountrySlugs();
    const candidateTasks: Promise<RelatedItem | null>[] = [];

    for (const ctry of allCountrySlugs) {
      const progs = await getSkilledPrograms(ctry);
      for (const p of progs as any[]) {
        const progSlug = p.programSlug ?? p.slug;
        if (!progSlug) continue;
        if (ctry === params.country && progSlug === params.program) continue;

        candidateTasks.push(
          (async () => {
            try {
              const { meta: candMeta } = await loadProgramPageSections(ctry, progSlug);
              const candTitle =
                (candMeta as any).title ?? (candMeta as any).name ?? progSlug;
              const score = similarityScore(
                { title: (meta as any).title ?? params.program, tags: (meta as any).tags },
                { title: candTitle, tags: (candMeta as any).tags }
              );
              if (score <= 0) return null;
              return {
                url: `${baseFromCategory("skilled")}/${ctry}/${progSlug}`,
                title: candTitle as string,
                country: (candMeta as any).country ?? ctry,
                minInvestment: (candMeta as any).minInvestment as number | undefined,
                currency: (candMeta as any).currency as string | undefined,
                timelineMonths: (candMeta as any).timelineMonths as number | undefined,
                tags: ((candMeta as any).tags ?? []) as string[],
                heroImage: (candMeta as any).heroImage as string | undefined,
                score,
              };
            } catch {
              return null;
            }
          })()
        );
      }
    }

    const relatedRaw = (await Promise.all(candidateTasks)).filter(Boolean) as RelatedItem[];
    const relatedPrograms = relatedRaw
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        const ta = a.timelineMonths ?? Number.MAX_SAFE_INTEGER;
        const tb = b.timelineMonths ?? Number.MAX_SAFE_INTEGER;
        if (ta !== tb) return ta - tb;
        const ia = a.minInvestment ?? Number.MAX_SAFE_INTEGER;
        const ib = b.minInvestment ?? Number.MAX_SAFE_INTEGER;
        return ia - ib;
      })
      .slice(0, 6);

    const overviewKey = pickSectionKey(sections, ["overview"]);
    const compensationKey = pickSectionKey(sections, [
      "salary-overview",
      "investment-overview",
      "package-overview",
    ]);
    const comparisonKey = pickSectionKey(sections, [
      "comparison-with-provincial-entrepreneur-programs",
      "comparison",
      "alternatives",
    ]);
    const whyCountryKey = pickSectionKey(sections, [
      `why-${params.country.toLowerCase()}`,
      `why-${(meta as any).country?.toLowerCase?.() ?? ""}`,
      "why-country",
    ]);

    const compLabel = investmentLabel["skilled"]; // "Compensation"
    const sectionsForNav: { id: string; label: string }[] = [
      { id: "quick-facts", label: "Quick Facts" },
      { id: "overview", label: "Overview" },
      { id: "investment", label: compLabel },
      ...(prices?.length || proofOfFunds?.length ? [{ id: "prices", label: "Costs & Funds" }] : []),
      ...(((meta as any).requirements?.length ?? 0) ? [{ id: "requirements", label: "Eligibility" }] : []),
      ...(((meta as any).benefits?.length ?? 0) ? [{ id: "benefits", label: "Benefits" }] : []),
      ...(processSteps.length ? [{ id: "process", label: "Process" }] : []),
      { id: "comparison", label: "Comparison" },
      ...(whyCountryKey ? [{ id: "why-country", label: `Why ${(meta as any).country ?? params.country}` }] : []),
      { id: "faq", label: "FAQ" },
      ...(disqualifiers.length ? [{ id: "not-a-fit", label: "Not a fit?" }] : []),
      ...(otherPrograms.length ? [{ id: "other-programs", label: "Other Programs" }] : []),
      ...(relatedPrograms.length ? [{ id: "related", label: "Related" }] : []),
    ];

    const howToLdData =
      processSteps.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `${(meta as any).title ?? params.program} Application Process`,
            description: (meta as any).seo?.description ?? (meta as any).tagline,
            step: processSteps.map((step: any, index: number) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.description,
            })),
          }
        : null;

    const offerLd =
      prices && prices.length
        ? {
            "@context": "https://schema.org",
            "@type": "AggregateOffer",
            priceCurrency:
              prices.find((p) => p.currency)?.currency ||
              (meta as any).currency ||
              "USD",
            offers: prices
              .filter((p) => typeof p.amount === "number")
              .map((p) => ({
                "@type": "Offer",
                name: p.label,
                price: p.amount,
                priceCurrency: p.currency || (meta as any).currency || "USD",
                category: p.when || undefined,
                description: p.notes || undefined,
                availability: "https://schema.org/InStock",
              })),
          }
        : null;

    const webPageLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: (meta as any).title ?? params.program,
      url: `https://yourdomain.com${baseFromCategory("skilled")}/${params.country}/${params.program}`,
      mainEntity: howToLdData ? { "@id": "#application-howto" } : undefined,
    };

    return (
      <main
        className="
          relative container mx-auto px-4
          bg-light_bg dark:bg-dark_bg text-black dark:text-white
          pb-32 sm:pb-16
        "
        style={{ scrollBehavior: "smooth" } as React.CSSProperties}
      >
        {/* JSON-LD */}
        <JsonLd
          data={breadcrumbLd([
            { name: "Skilled", url: baseFromCategory("skilled") },
            { name: (meta as any).country ?? params.country, url: `${baseFromCategory("skilled")}/${params.country}` },
            {
              name: (meta as any).title ?? params.program,
              url: `${baseFromCategory("skilled")}/${params.country}/${params.program}`,
            },
          ])}
        />
        {(meta as any).faq?.length ? <JsonLd data={faqLd((meta as any).faq)!} /> : null}
        {howToLdData ? <JsonLd data={{ ...howToLdData, "@id": "#application-howto" }} /> : null}
        <JsonLd data={webPageLd} />
        {offerLd ? <JsonLd data={offerLd} /> : null}
        {/* HERO */}
        <div className="pt-4 pb-4">
          <div className="rounded-3xl bg-white/80 dark:bg-dark_bg/80 shadow-lg backdrop-blur">
            <MediaHero
              title={(meta as any).title ?? params.program}
              subtitle={(meta as any).tagline}
              videoSrc={videoSrc}
              poster={poster}
              imageSrc={heroImage}
              actions={[
                { href: "/PersonalBooking", label: "Book a Free Consultation", variant: "primary" },
                { href: brochure, label: "Download Brochure", variant: "ghost", download: true },
              ]}
            />
          </div>
          <Breadcrumb />
        </div>
        <ProgramQuickNav sections={sectionsForNav} />
        {/* BODY */}
        <div className="flex flex-col gap-8 pt-5 pb-16 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:px-8">
          {/* MAIN */}
          <div className="order-2 lg:order-1 lg:col-span-8 xl:col-span-8 space-y-10">
            <section id="quick-facts" className="scroll-mt-28">
              <QuickFacts
                minInvestment={(meta as any).minInvestment}
                currency={(meta as any).currency}
                timelineMonths={(meta as any).timelineMonths}
                tags={(meta as any).tags}
              />
            </section>

            {quickCheck?.questions?.length ? (
              <section
                id="quick-check-mobile"
                className="sm:hidden scroll-mt-28 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-200/60 dark:ring-emerald-800/60 p-4"
              >
                <EligibilityQuickCheck config={quickCheck} />
              </section>
            ) : null}

            {overviewKey && sections[overviewKey] && (
              <section id="overview" className="scroll-mt-28">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Program overview</h2>
                </header>
                <Prose>{sections[overviewKey]}</Prose>
              </section>
            )}

            {compensationKey && sections[compensationKey] && (
              <section id="investment" className="scroll-mt-28">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">{investmentLabel["skilled"]} overview</h2>
                </header>
                <Prose>{sections[compensationKey]}</Prose>
              </section>
            )}

            {(prices?.length || proofOfFunds?.length) ? (
              <section id="prices" className="scroll-mt-28 overflow-visible">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Costs & proof of funds</h2>
                </header>
                <div className="w-full overflow-visible">
                  <Prices
                    items={prices ?? []}
                    proofOfFunds={proofOfFunds ?? []}
                    defaultCurrency={(meta as any).currency}
                  />
                </div>
              </section>
            ) : null}

            {(meta as any).requirements?.length ? (
              <section
                id="requirements"
                className="scroll-mt-28 rounded-2xl bg-sky-50 dark:bg-sky-950/30 ring-1 ring-sky-200/60 dark:ring-sky-900/50 p-6"
              >
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Eligibility</h2>
                </header>
                <ul className="list-disc pl-5 space-y-2 text-[15px] leading-7">
                  {(meta as any).requirements.map((r: string) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(meta as any).benefits?.length ? (
              <section
                id="benefits"
                className="scroll-mt-28 rounded-2xl bg-emerald-50 dark:bg-emerald-950/25 ring-1 ring-emerald-200/60 dark:ring-emerald-900/40 p-6"
              >
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Key benefits</h2>
                </header>
                <ul className="list-disc pl-5 space-y-2 text-[15px] leading-7">
                  {(meta as any).benefits.map((b: string) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {processSteps.length > 0 && (
              <section id="process" className="scroll-mt-28">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Application process</h2>
                </header>
                <ProcessTimeline steps={processSteps} />
              </section>
            )}

            {comparisonKey && sections[comparisonKey] && (
              <section id="comparison" className="scroll-mt-28">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Comparison</h2>
                </header>
                <Prose>{sections[comparisonKey]}</Prose>
              </section>
            )}

            {whyCountryKey && sections[whyCountryKey] && (
              <section id="why-country" className="scroll-mt-28">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Why {(meta as any).country ?? params.country}</h2>
                </header>
                <Prose>{sections[whyCountryKey]}</Prose>
              </section>
            )}

            {disqualifiers.length ? (
              <section
                id="not-a-fit"
                className="scroll-mt-28 rounded-2xl bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200/60 dark:ring-amber-900/40 p-6"
              >
                <header className="mb-2">
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-300">
                    Who this program is NOT for
                  </h2>
                </header>
                <ul className="list-disc pl-5 text-[15px] leading-7 text-amber-900/90 dark:text-amber-100/90">
                  {disqualifiers.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[14px]">
                  Not a match? Explore{" "}
                  <Link href={`${baseFromCategory("skilled")}/${params.country}`} className="underline">
                    other programs in {(meta as any).country ?? params.country}
                  </Link>
                  .
                </p>
              </section>
            ) : null}

            {(meta as any).faq?.length ? (
              <section id="faq" className="scroll-mt-28">
                <header className="mb-3">
                  <h2 className="text-xl font-semibold">Frequently asked questions</h2>
                </header>
                <FAQAccordion faqs={(meta as any).faq} />
              </section>
            ) : null}

            {otherPrograms.length ? (
              <section id="other-programs" className="scroll-mt-28">
                <header className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-slate-600/10 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Explore
                  </span>
                  <h2 className="text-xl font-semibold">
                    Other programs in {(meta as any).country ?? params.country}
                  </h2>
                </header>

                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {otherPrograms.map((prog: any) => (
                    <li key={prog.programSlug}>
                      <Link
                        href={`${baseFromCategory("skilled")}/${params.country}/${prog.programSlug}`}
                        className="group block rounded-xl p-4 ring-1 ring-neutral-200/80 dark:ring-neutral-800/80 bg-white/80 dark:bg-neutral-900/40 hover:-translate-y-0.5 hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        aria-label={`View ${prog.title}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold leading-6">
                              {prog.title}
                            </h3>
                            <p className="mt-0.5 text-xs opacity-70">
                              {(meta as any).country ?? params.country} · same country
                            </p>
                          </div>
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700 bg-black/5 dark:bg-white/10 transition group-hover:bg-black/10 group-hover:dark:bg-white/15" aria-hidden>
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {relatedPrograms.length ? (
              <section id="related" className="scroll-mt-28">
                <header className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-indigo-600/10 px-2 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    Related
                  </span>
                  <h2 className="text-xl font-semibold">
                    Programs similar to {(meta as any).title ?? params.program}
                  </h2>
                </header>

                <ul className="grid gap-5 sm:grid-cols-2">
                  {relatedPrograms.map((r) => {
                    const hasImg = !!r.heroImage;
                    const price =
                      typeof r.minInvestment === "number"
                        ? `${r.currency ?? ""} ${r.minInvestment.toLocaleString()}`
                        : "No minimum";
                    const time = r.timelineMonths ? `${r.timelineMonths} mo` : "Varies";
                    return (
                      <li key={r.url}>
                        <Link
                          href={r.url}
                          className="group block overflow-hidden rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-800/80 bg-white/80 dark:bg-neutral-900/40 hover:-translate-y-0.5 hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`View ${r.title}`}
                        >
                          <div className="relative aspect-[16/9] overflow-hidden">
                            {hasImg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              (<img
                                src={r.heroImage!}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />)
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-neutral-800 dark:to-neutral-700 grid place-items-center">
                                <span className="text-xs opacity-70">
                                  {r.country}
                                </span>
                              </div>
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-base font-semibold leading-6">
                                  {r.title}
                                </h3>
                                <p className="mt-0.5 text-xs opacity-70">{r.country}</p>
                              </div>
                              {!!r.tags?.length && (
                                <div className="hidden md:flex flex-wrap gap-1 max-w-[220px] justify-end">
                                  {r.tags.slice(0, 3).map((t) => (
                                    <span key={t} className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] opacity-80 ring-1 ring-neutral-200 dark:ring-neutral-700">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                              <div className="rounded-xl p-2 bg-black/5 dark:bg-white/10 ring-1 ring-neutral-200 dark:ring-neutral-700">
                                <div className="font-medium tabular-nums">{price}</div>
                                <div className="text-[11px] opacity-70">Minimum investment</div>
                              </div>
                              <div className="rounded-xl p-2 bg-black/5 dark:bg-white/10 ring-1 ring-neutral-200 dark:ring-neutral-700">
                                <div className="font-medium">{time}</div>
                                <div className="text-[11px] opacity-70">Timeline</div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            <div className="sm:hidden h-24" aria-hidden="true" />
          </div>

          <aside className="order-1 lg:order-2 lg:col-span-4 xl:col-span-4 space-y-6 self-start lg:sticky lg:top-24">
            {quickCheck?.questions?.length ? (
              <div className="hidden lg:block">
                <EligibilityQuickCheck config={quickCheck} />
              </div>
            ) : null}

            <div className="hidden lg:block rounded-2xl ring-1 ring-neutral-200/70 dark:ring-neutral-800/70 p-6">
              <SocialProof />
            </div>

            <div className="hidden lg:block rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 ring-1 ring-neutral-200/70 dark:ring-neutral-800/70 p-6">
              <h3 className="text-base font-semibold">Brochure</h3>
              <p className="text-sm opacity-80 mt-1">
                Full details, requirements, and timelines.
              </p>
              <a
                href={brochure}
                download
                className="mt-4 inline-flex rounded-xl ring-1 ring-neutral-300 dark:ring-neutral-700 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Download PDF
              </a>
            </div>

            <div className="hidden lg:block">
              <ContactForm />
            </div>
          </aside>
        </div>
        <div className="border-t border-border dark:border-dark_border bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:px-6 lg:px-8">
            <h3 className="text-center text-xl font-semibold">
              Ready to start your {(meta as any).country ?? params.country} skilled migration journey?
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/PersonalBooking" className="rounded-xl bg-primary px-5 py-3 text-white shadow-sm">
                Book a Free Consultation
              </a>
              <a
                href={brochure}
                download
                className="rounded-xl ring-1 ring-neutral-300 dark:ring-neutral-700 bg-white/80 dark:bg-dark_bg/80 px-5 py-3 shadow-sm"
              >
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (e) {
    console.error("[Skilled ProgramPage] load error", e);
    notFound();
  }
}
