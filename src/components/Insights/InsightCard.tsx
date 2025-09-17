// src/components/Insights/InsightCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { InsightMeta } from "@/types/insights";

/** Format date in UTC for consistent display (e.g., 16 September 2025) */
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

/* ──────────────────────────────────────────────────────────────────────────
   UX strategy: small, color-coded kind badge + compact readable meta
   - Badge: top-left over media (color per kind)
   - Media: 16:9, covers, graceful gradient fallback using kind colors
   - Title: 18px / 2 lines, summary: 14px / 2 lines
   - Meta: date • author • reading time (12px)
   - Hover: subtle lift + soft color ring, full-card clickable
   - A11y: <article>, <time>, alt text, large clickable target
   ------------------------------------------------------------------------ */

type KindKey = NonNullable<InsightMeta["kind"]> | "default";

const KIND_UI: Record<
  KindKey,
  {
    label: string;
    /** Badge appearance */
    badge: string;
    /** Ambient/fallback gradient colors */
    ambientFrom: string;
    ambientTo: string;
  }
> = {
  articles: {
    label: "Article",
    badge:
      "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:ring-indigo-800/60",
    ambientFrom: "rgba(79,70,229,0.85)",
    ambientTo: "rgba(99,102,241,0.55)",
  },
  blog: {
    label: "Blog",
    badge:
      "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800/60",
    ambientFrom: "rgba(16,185,129,0.80)",
    ambientTo: "rgba(52,211,153,0.50)",
  },
  news: {
    label: "News",
    badge:
      "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800/60",
    ambientFrom: "rgba(217,119,6,0.85)",
    ambientTo: "rgba(245,158,11,0.50)",
  },
  media: {
    label: "Media",
    badge:
      "bg-fuchsia-50 text-fuchsia-800 ring-1 ring-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:ring-fuchsia-800/60",
    ambientFrom: "rgba(192,38,211,0.85)",
    ambientTo: "rgba(168,85,247,0.50)",
  },
  default: {
    label: "Content",
    badge:
      "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-200 dark:ring-neutral-700",
    ambientFrom: "rgba(2,132,199,0.75)",
    ambientTo: "rgba(59,130,246,0.45)",
  },
};

export default function InsightCard({
  item,
  showKindBadge = true,
}: {
  item: InsightMeta;
  showKindBadge?: boolean;
}) {
  const displayDate = formatDateUTC(item.updated || item.date);
  const author =
    (typeof (item as any).author === "string"
      ? (item as any).author
      : (item as any).author?.name) || "";

  const ui = KIND_UI[item.kind as KindKey] ?? KIND_UI.default;

  return (
    <Link
      href={item.url}
      aria-label={`Open ${ui.label.toLowerCase()} “${item.title}”`}
      className="block focus:outline-none"
    >
      <article
        className="
          relative isolate overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition
          hover:-translate-y-0.5 hover:shadow-md hover:ring-2 hover:ring-indigo-300/40
          focus-visible:ring-2 focus-visible:ring-indigo-300/60
          dark:border-neutral-800 dark:bg-neutral-900 dark:hover:ring-indigo-500/30
          will-change-transform
        "
      >
        {/* Media */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
          {item.hero ? (
            <Image
              src={item.hero}
              alt={item.heroAlt || item.title}
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              quality={85}
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(180px 120px at 15% 0%, ${ui.ambientFrom}, transparent 60%),
                             radial-gradient(220px 120px at 100% 20%, ${ui.ambientTo}, transparent 60%),
                             linear-gradient(to bottom right, rgba(241,245,249,.8), rgba(241,245,249,1))`,
              }}
              aria-hidden
            />
          )}

          {/* Tiny type badge */}
          {showKindBadge && (
            <span
              className={[
                "absolute left-3 top-3 z-10 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                ui.badge,
              ].join(" ")}
            >
              {ui.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Title (18px) */}
          <h3 className="line-clamp-2 text-[18px] font-semibold leading-6 text-neutral-900 dark:text-white">
            {item.title}
          </h3>

          {/* Description (14px) */}
          {item.summary && (
            <p className="mt-2 line-clamp-2 text-[14px] leading-5 text-neutral-700 dark:text-neutral-300">
              {item.summary}
            </p>
          )}

          {/* Meta row (12px) */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-neutral-500 dark:text-neutral-400">
            {displayDate && (
              <time dateTime={(item.updated || item.date)!} className="whitespace-nowrap">
                {displayDate}
              </time>
            )}
            {author && (
              <>
                <span aria-hidden className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="truncate">{author}</span>
              </>
            )}
            {typeof item.readingTimeMins === "number" && (
              <>
                <span aria-hidden className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="whitespace-nowrap">{item.readingTimeMins} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Subtle ambient glow (tinted per kind) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[1.1rem] opacity-[.05] blur-xl dark:opacity-[.09]"
          style={{
            background: `radial-gradient(180px 120px at 15% 0%, ${ui.ambientFrom}, transparent 60%),
                         radial-gradient(220px 120px at 100% 20%, ${ui.ambientTo}, transparent 60%)`,
          }}
        />
      </article>
    </Link>
  );
}
