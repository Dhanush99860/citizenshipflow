// src/components/MDX/Prose.tsx
import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

/**
 * Prose — compact, readable typography for MDX content.
 * - Strong, clearly separated headings
 * - 15px body with comfy line-height
 * - No link underline by default; clear hover underline
 * - Dark mode tuned
 */
export function Prose({ className = "", ...props }: Props) {
  return (
    <div
      className={[
        // Typography base
        "prose max-w-none dark:prose-invert",

        // BODY — 15px, comfortable leading, slightly softer color
        "prose-p:text-[15px] prose-li:text-[15px] prose-a:text-[15px] prose-strong:text-[15px] prose-em:text-[15px] prose-blockquote:text-[15px]",
        "prose-p:leading-7 prose-li:leading-7 prose-blockquote:leading-7",
        "prose-p:text-neutral-800 dark:prose-p:text-neutral-200",
        "prose-li:text-neutral-800 dark:prose-li:text-neutral-200",

        // HEADINGS — clearly bolder, tighter, with generous spacing
        "prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100",
        "prose-headings:tracking-tight prose-headings:leading-tight prose-headings:scroll-mt-28",
        "prose-headings:font-semibold prose-h1:font-bold prose-h2:font-bold",
        // scale
        "prose-h1:text-[24px] sm:prose-h1:text-[26px]",
        "prose-h2:text-[21px] sm:prose-h2:text-[22px]",
        "prose-h3:text-[18px] sm:prose-h3:text-[19px]",
        "prose-h4:text-[16px]",
        // spacing around headings
        "prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:mt-10 prose-h2:mb-4",
        "prose-h3:mt-8 prose-h3:mb-3",
        "prose-h4:mt-6 prose-h4:mb-2",
        // if headings are wrapped by autolink, never show decoration
        "prose-headings:[text-decoration:none]",

        // PARAGRAPH / LIST rhythm
        "prose-p:my-4",
        "prose-ul:my-4 prose-ol:my-4",
        "prose-ul:pl-5 prose-ol:pl-5",
        "prose-li:my-1.5",
        "prose-li:marker:text-neutral-400 dark:prose-li:marker:text-neutral-500",

        // LINKS — subtle by default, underline on hover
        "prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-2 hover:prose-a:underline-offset-4",
        "prose-a:text-black hover:prose-a:text-black",
        "dark:prose-a:text-secondary dark:hover:prose-a:text-secondary",
        "prose-a:font-medium",

        // STRONG
        "prose-strong:font-semibold prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100",

        // INLINE CODE / PRE
        "prose-code:text-[13px] prose-code:px-1.5 prose-code:py-0.5",
        "prose-code:rounded-md prose-code:bg-neutral-100/80 prose-code:text-neutral-900",
        "dark:prose-code:bg-neutral-800/60 dark:prose-code:text-neutral-100",
        "prose-pre:overflow-x-auto prose-pre:text-[13px] prose-pre:p-4",
        "prose-pre:rounded-lg prose-pre:bg-neutral-50 dark:prose-pre:bg-neutral-900/60",
        "prose-pre:ring-1 prose-pre:ring-neutral-200 dark:prose-pre:ring-neutral-800",

        // TABLES
        "prose-table:text-[14px] prose-table:leading-6",
        "prose-thead:bg-neutral-50 dark:prose-thead:bg-neutral-900/40",
        "prose-thead:border-b prose-thead:border-neutral-200 dark:prose-thead:border-neutral-800",
        "prose-th:font-semibold prose-td:align-top",
        "prose-th:px-3 prose-td:px-3",
        "prose-th:py-2 prose-td:py-2",

        // QUOTES / RULES / IMAGES
        "prose-blockquote:border-l-2 prose-blockquote:border-neutral-300 dark:prose-blockquote:border-neutral-700",
        "prose-blockquote:pl-4 prose-blockquote:not-italic",
        "prose-hr:my-8 prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800",
        "prose-img:rounded-xl prose-img:shadow-sm",

        // QoL
        "selection:bg-amber-200/40 dark:selection:bg-amber-300/20",
        "break-words hyphens-auto",

        className,
      ].join(" ")}
      {...props}
    />
  );
}
