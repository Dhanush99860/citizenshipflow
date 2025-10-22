// ============================
// src/components/Contact/FAQ.tsx
// ============================
import * as React from "react";
import SectionCard from "@/components/Contact/SectionCard";

export type FAQItem = { q: string; a: string };

export default function FAQ({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  return (
    <SectionCard className={className} aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-xl font-semibold">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-blue-100/60 dark:divide-blue-900/30">
        {items.map((it, idx) => (
          <details key={idx} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
              <span>{it.q}</span>
              <span className="ml-4 h-5 w-5 rounded-full ring-1 ring-blue-200 group-open:rotate-45 flex items-center justify-center">+</span>
            </summary>
            <p className="mt-2 text-sm text-black/80 dark:text-white/80">{it.a}</p>
          </details>
        ))}
      </div>
    </SectionCard>
  );
}