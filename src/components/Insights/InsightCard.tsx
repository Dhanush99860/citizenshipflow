import Link from "next/link";
import Image from "next/image";
import type { InsightMeta } from "@/types/insights";

/** Format date in UTC for consistent display (e.g., 16 Sep 2025) */
function formatDateUTC(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * Blog-style card (matches the reference):
 * - Full-card link, large hero image, rounded corners
 * - Title 18px (2 lines), description 14px (2 lines)
 * - Meta row 12px: date • author • (optional) reading time
 * - Soft blue hover ring, subtle shadow
 * - Light/Dark themes
 */
export default function InsightCard({ item }: { item: InsightMeta }) {
  const displayDate = formatDateUTC(item.updated || item.date);
  const author =
    // Support common shapes: { author: "Name" } or { author: { name: "Name" } }
    (typeof (item as any).author === "string"
      ? (item as any).author
      : (item as any).author?.name) || "";

  return (
    <Link
      href={item.url}
      aria-label={`Open ${item.title}`}
      className="
        block focus:outline-none
        [--ring:theme(colors.blue.300/.55)]
      "
    >
      <article
        className="
          relative isolate overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition
          hover:shadow-md hover:ring-2 hover:ring-[var(--ring)]
          focus-visible:ring-2 focus-visible:ring-[var(--ring)]
          dark:border-neutral-800 dark:bg-neutral-900 dark:hover:ring-blue-500/40
        "
      >
        {/* Media */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
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
            <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_0%,theme(colors.blue.300/.35),transparent),linear-gradient(to_bottom_right,theme(colors.blue.50),theme(colors.blue.100))] dark:bg-[radial-gradient(80%_60%_at_30%_0%,theme(colors.blue.900/.5),transparent),linear-gradient(to_bottom_right,theme(colors.neutral.900),theme(colors.neutral.950))]" />
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
            {displayDate && <time dateTime={(item.updated || item.date)!}>{displayDate}</time>}
            {author && (
              <>
                <span aria-hidden className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="truncate">{author}</span>
              </>
            )}
            {typeof item.readingTimeMins === "number" && (
              <>
                <span aria-hidden className="text-neutral-300 dark:text-neutral-600">•</span>
                <span>{item.readingTimeMins} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Decorative blue ambient (very subtle) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[1.7rem] opacity-[.05] blur-xl dark:opacity-[.1]"
          style={{
            background:
              "radial-gradient(180px 120px at 15% 0%, rgba(37,99,235,.9), transparent 60%), radial-gradient(220px 120px at 100% 20%, rgba(59,130,246,.6), transparent 60%)",
          }}
        />
      </article>
    </Link>
  );
}
