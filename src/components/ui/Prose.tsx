import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

/**
 * Prose — consistent, compact typography system for MDX/content blocks.
 * Goals:
 * - Uniform base size (15px) across paragraphs, lists, links, strong, etc.
 * - Slight, tasteful heading scale (so everything feels “equal” and tidy)
 * - Comfortable line-height and spacing rhythm
 * - Accessible links (always underlined), great dark-mode contrast
 * - Zero layout surprises across breakpoints
 */
export function Prose({ className = "", ...props }: Props) {
  return (
    <div
      className={[
        // Tailwind Typography base, but we override sizes per element
        "prose max-w-none",

        // === BASE TEXT ===
        // Force a single base size across most inline elements
        "prose-p:text-[15px] prose-li:text-[15px] prose-a:text-[15px] prose-strong:text-[15px] prose-em:text-[15px] prose-blockquote:text-[15px]",
        "prose-p:leading-7 prose-li:leading-7 prose-blockquote:leading-7",

        // === HEADINGS (small, even scale) ===
        // Keep headings visually stronger without dwarfing body copy
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-[22px] sm:prose-h1:text-[24px]",
        "prose-h2:text-[20px] sm:prose-h2:text-[22px]",
        "prose-h3:text-[18px] sm:prose-h3:text-[19px]",
        "prose-h4:text-[16px]",
        "prose-headings:scroll-mt-28",
        "prose-headings:mt-6 prose-headings:mb-3",

        // === LISTS / RHYTHM ===
        "prose-ul:my-3 prose-ol:my-3 prose-li:my-1.5",
        "prose-ul:pl-5 prose-ol:pl-5",
        "prose-li:marker:text-neutral-400 dark:prose-li:marker:text-neutral-500",

        // === LINKS ===
        // Always underlined for clarity; adapt color to theme
        "prose-a:underline prose-a:decoration-[1.5px] underline-offset-2",
        "prose-a:text-sky-700 hover:prose-a:text-sky-800",
        "dark:prose-a:text-sky-300 dark:hover:prose-a:text-sky-200",

        // === CODE / PRE ===
        "prose-code:text-[13px] prose-code:px-1.5 prose-code:py-0.5",
        "prose-code:rounded-md prose-code:bg-black/5 prose-code:text-black",
        "dark:prose-code:bg-white/10 dark:prose-code:text-white",
        "prose-pre:overflow-x-auto prose-pre:text-[13px]",
        "prose-pre:bg-neutral-950/90 dark:prose-pre:bg-neutral-900/60",
        "prose-pre:text-neutral-100 dark:prose-pre:text-neutral-100",

        // === TABLES ===
        "prose-table:text-[14px] prose-table:leading-6",
        "prose-thead:border-b prose-thead:border-neutral-200 dark:prose-thead:border-neutral-800",
        "prose-th:font-semibold",
        "prose-td:align-top",
        "prose-th:px-3 prose-td:px-3",
        "prose-th:py-2 prose-td:py-2",

        // === QUOTES / HR / IMG ===
        "prose-blockquote:border-l-4 prose-blockquote:border-neutral-200 dark:prose-blockquote:border-neutral-700",
        "prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-hr:my-6 prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800",
        "prose-img:rounded-xl",

        // === COLORS ===
        "prose-headings:text-black dark:prose-headings:text-white",
        "prose-p:text-black dark:prose-p:text-gray-100",
        "prose-li:text-black dark:prose-li:text-gray-100",
        "prose-strong:text-black dark:prose-strong:text-white",
        "dark:prose-invert",

        // === QUALITY-OF-LIFE ===
        "selection:bg-amber-200/40 dark:selection:bg-amber-300/20",
        "break-words hyphens-auto",

        className,
      ].join(" ")}
      {...props}
    />
  );
}
