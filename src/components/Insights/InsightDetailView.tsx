import Image from "next/image";
import Link from "next/link";

import InsightTOC from "./InsightTOC";
import ReadingProgress from "./ReadingProgress";
import ShareBar from "./ShareBar";
import InsightsList from "./InsightsList";

import { getRelatedContent } from "@/lib/insights-content";
import type { InsightRecord } from "@/types/insights";

// ✅ Stable, deterministic date formatter (avoids hydration mismatches)
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

function Breadcrumbs({ kind, title }: { kind: string; title: string }) {
  const pretty =
    kind === "articles" ? "Articles" : kind === "news" ? "News" : kind === "media" ? "Media" : "Blog";
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-black/60 dark:text-white/60">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:underline">Home</Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link href="/insights" className="hover:underline">Insights</Link>
        </li>
        <li aria-hidden>›</li>
        <li className="hidden sm:block">
          <Link href={`/${kind}`} className="hover:underline">{pretty}</Link>
        </li>
        <li aria-hidden className="hidden sm:block">›</li>
        <li className="truncate max-w-[40ch]" aria-current="page" title={title}>{title}</li>
      </ol>
    </nav>
  );
}

export default async function InsightDetailView({ record }: { record: InsightRecord }) {
  const related = await getRelatedContent(record);

  const countries = record.country ?? [];
  const programs = record.program ?? [];
  const tags = record.tags ?? [];

  const hasHero = Boolean(record.hero);

  // ✅ Precompute a stable date string on the server
  const displayDate = formatDateUTC(record.updated || record.date);

  return (
    <>
      <ReadingProgress />

      {/* HERO */}
      <section className="relative">
        {hasHero && (
          <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden bg-black">
            <Image
              src={record.hero!}
              alt={record.heroAlt || record.title}
              priority
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div
            className={[
              "relative",
              hasHero ? "-mt-24 sm:-mt-28 lg:-mt-32" : "mt-8",
              "rounded-2xl bg-white/95 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-black/60",
              "shadow-sm ring-1 ring-black/5 dark:ring-white/10",
            ].join(" ")}
          >
            <div className="p-5 sm:p-7 lg:p-8">
              <Breadcrumbs kind={record.kind} title={record.title} />

              <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-black dark:text-white">
                {record.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/70 dark:text-white/70">
                <span className="uppercase tracking-wide">{record.kind}</span>
                {displayDate && (
                  <>
                    <span aria-hidden>•</span>
                    <time dateTime={(record.updated || record.date)!}>{displayDate}</time>
                  </>
                )}
                {record.readingTimeMins && (
                  <>
                    <span aria-hidden>•</span>
                    <span>{record.readingTimeMins} min read</span>
                  </>
                )}
                {record.author && (
                  <>
                    <span aria-hidden>•</span>
                    <span>By {record.author}</span>
                  </>
                )}
              </div>

              <div className="mt-4">
                <ShareBar title={record.title} url={record.url} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <article className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* MAIN */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div
              id="article-content"
              className={[
                "prose prose-lg dark:prose-invert max-w-none",
                "prose-headings:scroll-mt-28",
                "prose-a:underline prose-a:decoration-black/30 hover:prose-a:decoration-black dark:prose-a:decoration-white/30 dark:hover:prose-a:decoration-white",
                "prose-img:rounded-xl prose-img:shadow-sm",
                "prose-hr:my-10",
              ].join(" ")}
            >
              {record.content}
            </div>

            {/* meta rows */}
            <div className="mt-10 space-y-3 text-sm text-black/80 dark:text-white/80">
              {countries.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-black dark:text-white">Countries:</span>
                  {countries.map((c) => (
                    <Link
                      key={c}
                      href={`/insights?country=${encodeURIComponent(c)}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-black dark:text-white"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}
              {programs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-black dark:text-white">Programs:</span>
                  {programs.map((p) => (
                    <Link
                      key={p}
                      href={`/insights?program=${encodeURIComponent(p)}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-black dark:text-white"
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-black dark:text-white">Tags:</span>
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href={`/insights?tag=${encodeURIComponent(t)}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-black dark:text-white"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Related</h2>
                <InsightsList items={related} />
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-28">
              <InsightTOC headings={record.headings || []} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
