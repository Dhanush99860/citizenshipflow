import * as React from "react";

/**
 * FAQ blocks for MDX
 *
 * ✅ Works two ways:
 *  1) <FAQ items={[{ q: '...', a: <>answer</> }, ... ]} />
 *  2) <FAQ><FAQItem question="...">answer</FAQItem>...</FAQ>
 *
 * Pure black/white palette with clear hierarchy.
 * No client JS required — uses native <details>/<summary>.
 */

type FAQArrayItem = {
  q: React.ReactNode;
  a: React.ReactNode;
  defaultOpen?: boolean;
};

export type FAQProps = {
  items?: FAQArrayItem[];
  children?: React.ReactNode;
  className?: string;
  /** Optional heading for the whole block */
  title?: React.ReactNode;
};

export function FAQ({ items, children, className, title }: FAQProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black",
        className || "",
      ].join(" ")}
    >
      {title ? (
        <header className="px-4 sm:px-5 pt-4 sm:pt-5">
          <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
        </header>
      ) : null}

      <div className="divide-y divide-black/10 dark:divide-white/10">
        {items && items.length > 0
          ? items.map((it, i) => (
              <FAQItem key={i} question={it.q} defaultOpen={it.defaultOpen}>
                {it.a}
              </FAQItem>
            ))
          : children}
      </div>
    </section>
  );
}

type FAQItemProps = {
  question: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function FAQItem({ question, children, defaultOpen, className }: FAQItemProps) {
  return (
    <details className={["group", className || ""].join(" ")} open={defaultOpen}>
      <summary
        className={[
          "marker:hidden cursor-pointer list-none outline-none",
          "px-4 sm:px-5 py-4 sm:py-5",
          "flex items-start justify-between gap-4",
          "focus-visible:ring-2 focus-visible:ring-black/80 dark:focus-visible:ring-white/80 rounded-md",
        ].join(" ")}
      >
        <h3 className="text-base sm:text-lg font-medium leading-snug text-black dark:text-white">
          {question}
        </h3>
        <span
          aria-hidden
          className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/20 dark:border-white/20 text-black dark:text-white transition-transform group-open:rotate-45"
          title="Toggle"
        >
          +
        </span>
      </summary>

      <div className="px-4 sm:px-5 pb-5 -mt-1 text-sm leading-relaxed text-black/80 dark:text-white/80">
        {children}
      </div>
    </details>
  );
}

export default FAQ;
