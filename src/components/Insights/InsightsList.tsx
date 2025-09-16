// FILE: src/components/Insights/InsightsList.tsx
import InsightCard from "./InsightCard";
import type { InsightMeta } from "@/types/insights";

export default function InsightsList({ items }: { items: InsightMeta[] }) {
  if (!items || items.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 p-8 text-center text-sm text-gray-600 dark:text-gray-300"
      >
        No results. Try a different keyword or clear filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <InsightCard key={it.url} item={it} />
      ))}
    </div>
  );
}
