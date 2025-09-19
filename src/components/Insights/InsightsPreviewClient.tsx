"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/** Align with your content fields */
type Item = {
  url: string;
  title?: string;
  heading?: string;
  excerpt?: string;
  summary?: string;

  // image fields across your codebase
  hero?: string;
  heroPoster?: string;
  image?: string;
  imageUrl?: string;
  cover?: string;

  kind?: string;
  category?: string;
  updated?: string;
  date?: string;
  publishedAt?: string;
  readingTime?: string | number;
  team?: string;
};

const pick = <T,>(...vals: (T | undefined)[]) =>
  vals.find((v) => v !== undefined && v !== null && v !== "") as T | undefined;

const formatDate = (input?: string) => {
  if (!input) return "";
  const d = new Date(input);
  return Number.isNaN(d.getTime())
    ? input
    : d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

/** Fix common bad URLs (spaces, //cdn, missing scheme, Drive/Dropbox) */
function sanitizeImageUrl(raw?: string) {
  if (!raw) return undefined;
  let u = raw.trim();

  // Google Drive share -> direct-ish
  const g = u.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (g?.[1]) return `https://drive.google.com/uc?export=view&id=${g[1]}`;

  // Dropbox -> dl=1
  if (/dropbox\.com\/s\//i.test(u) && !/dl=1/.test(u)) {
    u += (u.includes("?") ? "&" : "?") + "dl=1";
  }

  // keep data:, blob:, http(s): (encode spaces)
  if (/^(data:|blob:|https?:)/i.test(u)) return u.split(" ").join("%20");

  // protocol-relative
  if (/^\/\//.test(u)) return "https:" + u;

  // root-relative
  if (/^\//.test(u)) return u.split(" ").join("%20");

  // bare domain
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return "https://" + u;

  return u.split(" ").join("%20");
}

/** Native img with fallback (no next/image needed) */
function Img({
  src,
  alt,
  className = "",
  decoding = "async",
  importance = "auto", // auto | high | low
  sizes,
  style,
}: {
  src?: string;
  alt: string;
  className?: string;
  decoding?: "sync" | "async" | "auto";
  importance?: "high" | "low" | "auto";
  sizes?: string;
  style?: React.CSSProperties;
}) {
  const [error, setError] = useState(false);
  const safe = sanitizeImageUrl(src);
  const show = !!safe && !error;

  return show ? (
    <img
      src={safe}
      alt={alt}
      className={className}
      decoding={decoding}
      loading={importance === "high" ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      sizes={sizes}
      style={style}
      onError={() => setError(true)}
    />
  ) : (
    <div className={`relative ${className}`} style={style} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,.18),transparent_40%)]" />
    </div>
  );
}

export default function InsightsPreviewClient({
  items,
  title = "Latest insights & updates",
  viewAllHref = "/insights",
}: {
  items: Item[];
  title?: string;
  viewAllHref?: string;
}) {
  if (!items?.length) return null;

  // Guard sort (newest first) using updated -> date -> publishedAt
  const sorted = useMemo(() => {
    const clone = [...items];
    clone.sort((a, b) => {
      const tb = Date.parse(b.updated ?? b.date ?? b.publishedAt ?? "");
      const ta = Date.parse(a.updated ?? a.date ?? a.publishedAt ?? "");
      if (Number.isNaN(tb) && Number.isNaN(ta)) return 0;
      if (Number.isNaN(tb)) return 1;
      if (Number.isNaN(ta)) return -1;
      return tb - ta;
    });
    return clone;
  }, [items]);

  const first = sorted[0];
  const rest = sorted.slice(1, 6);

  // Prefer hero/heroPoster for images to match your other components
  const hero = {
    url: first.url,
    title: pick(first.title, first.heading) ?? "Untitled",
    excerpt: pick(first.excerpt, first.summary) ?? "",
    kind: (pick(first.kind, first.category) ?? "Insight").toString(),
    when: formatDate(pick(first.updated, first.date, first.publishedAt)),
    img: pick(first.hero, first.heroPoster, first.image, first.imageUrl, first.cover),
    team: first.team,
    time: first.readingTime,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sorted.slice(0, 6).map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      name: (pick(it.title, it.heading) ?? "Insight").toString().slice(0, 180),
    })),
  };

  return (
    <section
      aria-labelledby="insights-top6-title"
      className="relative container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="insights-top6-title"
          className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50"
        >
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 dark:border-slate-600/60 bg-white/70 dark:bg-slate-800/70 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-50 shadow-sm hover:bg-white/90 dark:hover:bg-slate-800/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
        >
          View all
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Layout: hero + list with small thumbs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HERO */}
        <article className="lg:col-span-2">
          <Link
            href={hero.url}
            className="group block overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60"
            aria-label={`Read: ${hero.title}`}
          >
            <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
              <Img
                src={hero.img}
                alt={hero.title}
                className="absolute inset-0 h-full w-full object-cover"
                importance="high"
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full bg-white/90 text-slate-900 px-2.5 py-1 text-xs font-medium shadow">
                  {hero.kind}
                </span>
                {hero.when && (
                  <span className="rounded-full bg-black/50 text-white px-2.5 py-1 text-xs font-medium backdrop-blur">
                    {hero.when}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur px-4 sm:px-5 py-4">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
                {hero.title}
              </h3>
              {hero.excerpt && (
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3">
                  {hero.excerpt}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                {hero.team && <span>{hero.team}</span>}
                {hero.time && (
                  <span>• {typeof hero.time === "number" ? `${hero.time} min read` : hero.time}</span>
                )}
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-primary font-medium">
                Read the full story
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </article>

        {/* LIST (small square thumbs) */}
        <aside className="lg:col-span-1">
          <ul
            role="list"
            className="divide-y divide-slate-200/70 dark:divide-slate-700/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur"
          >
            {sorted.slice(1, 6).map((it) => {
              const title = (pick(it.title, it.heading) ?? "Untitled").toString();
              const when = formatDate(pick(it.updated, it.date, it.publishedAt));
              const kind = (pick(it.kind, it.category) ?? "Insight").toString();
              const time = it.readingTime;
              const thumb = pick(it.hero, it.heroPoster, it.image, it.imageUrl, it.cover);

              return (
                <li key={it.url} className="p-4 sm:p-5">
                  <Link
                    href={it.url}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 rounded-md"
                    aria-label={`Read: ${title}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16">
                        <Img
                          src={thumb}
                          alt={title}
                          className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200/70 dark:ring-slate-700/60 bg-slate-100 dark:bg-slate-800"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 font-semibold">
                            {kind}
                          </span>
                          {when && <span>{when}</span>}
                          {time && (
                            <span>• {typeof time === "number" ? `${time} min read` : time}</span>
                          )}
                        </div>
                        <h3 className="mt-1 text-[15px] sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {title}
                        </h3>
                        <span className="mt-0.5 inline-flex items-center gap-1 text-primary text-xs font-medium">
                          Read
                          <svg
                            aria-hidden
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
