"use client";

import * as React from "react";

/**
 * FAQAccordion — elegant, accessible accordion
 * - Proper button semantics (no <summary> quirks)
 * - Keyboard + screen-reader friendly (aria-expanded/controls/region)
 * - Smooth height animation (CSS grid rows trick; no jank)
 * - Deep-linkable (#faq-your-question) and hash-sync on toggle
 * - Responsive, dark-mode polished, no overflow clipping
 *
 * Signature unchanged: { faqs?: { q: string; a: string }[] }
 */
export default function FAQAccordion({
  faqs,
}: {
  faqs?: { q: string; a: string }[];
}) {
  if (!faqs?.length) return null;

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  // Build stable slugs per question
  const slugs = React.useMemo(
    () => faqs.map((f) => slugify(f.q)),
    [faqs]
  );

  // On mount/hashchange: open the item matching the hash
  React.useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(
        (typeof window !== "undefined" ? window.location.hash : "").replace("#", "")
      );
      if (!hash) return;
      const idx = slugs.indexOf(hash);
      if (idx >= 0) setOpenIndex(idx);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [slugs]);

  const onToggle = (idx: number) => {
    setOpenIndex((cur) => {
      const next = cur === idx ? null : idx;
      // Update hash (or clear) for shareable deep links without page jump
      if (typeof window !== "undefined") {
        const nextHash = next === null ? "" : `#${slugs[next]}`;
        if (window.history?.replaceState) {
          const url = nextHash
            ? `${window.location.pathname}${window.location.search}${nextHash}`
            : `${window.location.pathname}${window.location.search}`;
          window.history.replaceState(null, "", url);
        }
      }
      return next;
    });
  };

  return (
    <section className="mt-5" role="region" aria-label="Frequently asked questions">
      <div
        className="
          overflow-visible rounded-2xl
          bg-gradient-to-br from-slate-50 to-white dark:from-neutral-900/60 dark:to-neutral-900/20
          ring-1 ring-slate-200/70 dark:ring-neutral-800/70
          shadow-sm divide-y divide-slate-200/70 dark:divide-neutral-800/70
        "
      >
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          const panelId = `faq-panel-${i}-${slugs[i]}`;
          const buttonId = `faq-button-${i}-${slugs[i]}`;

          return (
            <div key={panelId} className="px-4 sm:px-5">
              {/* Question row */}
              <h4 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => onToggle(i)}
                  className={[
                    "group flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left",
                    "text-[15px] sm:text-base font-semibold",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg",
                  ].join(" ")}
                >
                  <span className="pr-2">{f.q}</span>
                  <Chevron
                    className={[
                      "h-5 w-5 shrink-0 text-primary transition-transform duration-300",
                      isOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>
              </h4>

              {/* Answer panel (animated height with CSS grid rows) */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={[
                  "grid transition-all duration-300 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div className="pb-4 sm:pb-5 text-[15px] leading-7 text-black/80 dark:text-gray-200">
                    {f.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------ helpers ------------ */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
