"use client";

import { useEffect, useMemo, useState } from "react";
import type { Heading } from "@/types/insights";

export default function InsightTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = useMemo(() => {
    const seen = new Set<string>();
    return (headings || []).filter((h) => {
      if (!h?.id) return false;
      if (seen.has(h.id)) return false;
      seen.add(h.id);
      return h.depth === 2 || h.depth === 3;
    });
  }, [headings]);

  useEffect(() => {
    if (!items.length) return;

    const targets = items
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-24% 0px -70% 0px", threshold: [0, 1] }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur p-4"
    >
      <h2 className="text-sm font-semibold text-black dark:text-white mb-2">On this page</h2>
      <ul className="space-y-1.5 text-sm">
        {items.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className={h.depth === 3 ? "ml-4" : ""}>
              <a
                href={`#${h.id}`}
                className={[
                  "inline-block rounded px-1.5 py-0.5 transition-colors",
                  isActive
                    ? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
                    : "text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white",
                ].join(" ")}
                aria-current={isActive ? "true" : undefined}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
