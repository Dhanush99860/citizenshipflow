// src/components/MDX/Prose.tsx
import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

/**
 * Prose — strict black/white, high-contrast, compact MDX typography.
 * - Dark mode: every descendant inherits pure white (no muted grays).
 * - Light mode: every descendant inherits pure black.
 * - Headings: bold, tight, autolink-safe (never blue), with subtle mono underline on H2/H3.
 * - Links: monochrome (inherit color); rely on underline for affordance.
 * - No color hues anywhere; only black/white with opacity for rules/markers/surfaces.
 */
export function Prose({ className = "", ...props }: Props) {
  return (
    <div
      className={[
        /* BASE SCOPE ------------------------------------------------------- */
        "prose max-w-none dark:prose-invert", // use invert to flip typography variables
        "prose:leading-7",

        /* ROOT COLOR (strict) ---------------------------------------------- */
        "prose:text-black dark:prose:text-white",

        /* ENSURE ALL COMMON DESCENDANTS INHERIT ROOT COLOR ----------------- */
        // paragraphs, inline spans, emphasis, strong, list items
        "[&_*:where(p,span,em,strong,li)]:text-inherit",
        // quotes, code (inline + block), table cells, captions, headings’ children
        "[&_*:where(blockquote,code,pre,th,td,figcaption)]:text-inherit",
        "[&_h1_*]:text-inherit [&_h2_*]:text-inherit [&_h3_*]:text-inherit [&_h4_*]:text-inherit",

        /* BODY SIZE + RHYTHM ----------------------------------------------- */
        "prose-p:text-[15px] prose-li:text-[15px] prose-a:text-[15px] prose-strong:text-[15px] prose-em:text-[15px] prose-blockquote:text-[15px]",
        "prose-p:my-3",
        "prose-ul:my-3 prose-ol:my-3",
        "prose-ul:pl-5 prose-ol:pl-5",
        "prose-li:my-1",
        // list bullets in monochrome
        "prose-li:marker:text-black/80 dark:prose-li:marker:text-white/85",

        /* HEADINGS (bold + tight; never blue/purple) ----------------------- */
        "prose-headings:text-black dark:prose-headings:text-white",
        "prose-headings:font-bold prose-headings:tracking-tight prose-headings:leading-tight prose-headings:scroll-mt-28",
        // sizes
        "prose-h1:text-[26px] sm:prose-h1:text-[28px]",
        "prose-h2:text-[22px] sm:prose-h2:text-[24px]",
        "prose-h3:text-[18px] sm:prose-h3:text-[19px]",
        "prose-h4:text-[16px]",
        // spacing
        "prose-h1:mt-7 prose-h1:mb-3",
        "prose-h2:mt-8 prose-h2:mb-3",
        "prose-h3:mt-6 prose-h3:mb-2",
        "prose-h4:mt-5 prose-h4:mb-2",
        // autolink wrappers must not change color or underline
        "prose-headings:[&_a]:text-inherit",
        "prose-headings:[&_a]:no-underline hover:prose-headings:[&_a]:no-underline focus:prose-headings:[&_a]:no-underline",
        // subtle mono underline bars for mid headings
        "prose-h2:pb-1 prose-h2:border-b prose-h3:pb-1 prose-h3:border-b",
        "prose-h2:border-black/20 dark:prose-h2:border-white/25",
        "prose-h3:border-black/15 dark:prose-h3:border-white/20",

        /* LINKS (monochrome; underline on hover/focus) --------------------- */
        "prose-a:text-inherit visited:prose-a:text-inherit",
        "prose-a:font-medium",
        "prose-a:no-underline hover:prose-a:underline focus:prose-a:underline",
        "prose-a:underline-offset-4",

        /* EMPHASIS ---------------------------------------------------------- */
        "prose-strong:font-semibold prose-strong:text-inherit",
        "prose-em:not-italic",

        /* CODE (inline + block) -------------------------------------------- */
        "prose-code:text-[13px] prose-code:px-1.5 prose-code:py-0.5",
        "prose-code:rounded-md",
        "prose-code:bg-black/[0.06] dark:prose-code:bg-white/[0.10]",
        "prose-code:text-inherit", // inherit root monochrome
        "prose-pre:overflow-x-auto prose-pre:text-[13px] prose-pre:p-4",
        "prose-pre:rounded-lg",
        "prose-pre:bg-black/[0.04] dark:prose-pre:bg-white/[0.06]",
        "prose-pre:ring-1 prose-pre:ring-black/10 dark:prose-pre:ring-white/15",
        "[&_.hljs]:!bg-transparent [&_.hljs]:!p-0",

        /* TABLES ------------------------------------------------------------ */
        "prose-table:text-[14px] prose-table:leading-6",
        "prose-thead:bg-black/[0.03] dark:prose-thead:bg-white/[0.06]",
        "prose-thead:border-b prose-thead:border-black/10 dark:prose-thead:border-white/15",
        "prose-th:font-semibold prose-td:align-top",
        "prose-th:px-3 prose-td:px-3",
        "prose-th:py-2 prose-td:py-2",

        /* QUOTES / RULES / MEDIA ------------------------------------------- */
        "prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:not-italic",
        "prose-blockquote:border-black/20 dark:prose-blockquote:border-white/25",
        "prose-hr:my-8 prose-hr:border-black/10 dark:prose-hr:border-white/15",
        "prose-img:rounded-xl prose-img:shadow-sm prose-img:my-4",

        /* QUALITY OF LIFE --------------------------------------------------- */
        "selection:bg-black/10 dark:selection:bg-white/20",
        "break-words hyphens-auto",

        className,
      ].join(" ")}
      {...props}
    />
  );
}
