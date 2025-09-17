import Link from "next/link";

import InsightTOC from "./InsightTOC";
import ReadingProgress from "./ReadingProgress";
import ShareBar from "./ShareBar";
import InsightsList from "./InsightsList";
import MediaHero from "./MediaHero";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getRelatedContent } from "@/lib/insights-content";
import type { InsightRecord } from "@/types/insights";
import { Prose } from "@/components/ui/Prose";

/* -------------------------------------------------------------------------- */
/* utils + inline icons                                                       */
/* -------------------------------------------------------------------------- */

function formatDateUTC(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

const IconPen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5 20.5 7.5 8 20H4v-4L16.5 3.5z" />
  </svg>
);

const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M8 3v3M16 3v3M3 10h18" />
  </svg>
);

const IconClock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* main view                                                                  */
/* -------------------------------------------------------------------------- */

export default async function InsightDetailView({ record }: { record: InsightRecord }) {
  const related = await getRelatedContent(record);

  const displayDate = formatDateUTC(record.updated || record.date);
  const readingTime = record.readingTimeMins ? `${record.readingTimeMins} min` : "—";

  const countries = record.country ?? [];
  const programs = record.program ?? [];
  const tags = record.tags ?? [];

  return (
    <>
      <ReadingProgress />

      {/* TOP: crumbs + hero */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb />

        <MediaHero
          title={record.title}
          subtitle={record.summary || undefined}
          videoSrc={record.heroVideo || undefined}
          poster={record.heroPoster ?? record.hero ?? undefined}
          imageSrc={record.hero || undefined}
          actions={[
            { href: "/PersonalBooking", label: "Book a Free Consultation", variant: "primary" },
            { href: "/contact", label: "Contact Us", variant: "ghost" },
          ]}
        />
      </section>


      {/* INFO RIBBON — ONLY: Written by • Last updated • Read time • Share */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div
          className={[
            "relative w-full rounded-xl border border-black/10 dark:border-white/10",
            "bg-white/80 dark:bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-black/60",
            "px-4 sm:px-5 py-3",
          ].join(" ")}
          role="group"
          aria-label="Article meta"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <MetaBit icon={<IconPen className="h-4 w-4" />} label="Written by" value={record.author || "—"} />
            <Divider />
            <MetaBit icon={<IconCalendar className="h-4 w-4" />} label="Last updated" value={displayDate || "—"} />
            <Divider />
            <MetaBit icon={<IconClock className="h-4 w-4" />} label="Read time" value={readingTime} />

            {/* Share pinned to the right */}
            <div className="ms-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">Share</span>
                <ShareBar title={record.title} url={record.url} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* MAIN */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Use centralized typography system */}
            <Prose id="article-content" className="prose-headings:scroll-mt-28">
              {record.content}
            </Prose>

            {/* META LINKS */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {countries.length > 0 && (
                <MetaBox title="Countries">
                  {countries.map((c) => (
                    <Link
                      key={c}
                      href={`/insights?country=${encodeURIComponent(c)}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-black dark:text-white"
                    >
                      {c}
                    </Link>
                  ))}
                </MetaBox>
              )}
              {programs.length > 0 && (
                <MetaBox title="Programs">
                  {programs.map((p) => (
                    <Link
                      key={p}
                      href={`/insights?program=${encodeURIComponent(p)}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-black dark:text-white"
                    >
                      {p}
                    </Link>
                  ))}
                </MetaBox>
              )}
              {tags.length > 0 && (
                <MetaBox title="Tags">
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href={`/insights?tag=${encodeURIComponent(t)}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-black dark:text-white"
                    >
                      #{t}
                    </Link>
                  ))}
                </MetaBox>
              )}
            </div>

            {/* RELATED */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Related</h2>
                <InsightsList items={related} />
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              <InsightTOC headings={record.headings || []} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* small subcomponents                                                        */
/* -------------------------------------------------------------------------- */

function MetaBit({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-white">
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">{label}</div>
        <div className="text-sm font-semibold text-black dark:text-white">{value}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="h-6 w-px bg-black/10 dark:bg-white/15" />;
}

function MetaBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-black">
      <div className="mb-2 text-sm font-semibold text-black dark:text-white">{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
