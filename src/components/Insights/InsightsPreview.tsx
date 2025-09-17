// src/components/Insights/InsightsPreview.tsx
import Link from "next/link";
import { getAllInsights } from "@/lib/insights-content";
import InsightCard from "./InsightCard";

export default async function InsightsPreview({
  limit = 6,
}: {
  limit?: number;
}) {
  const { items } = await getAllInsights({ pageSize: limit });
  if (!items.length) return null;

  return (
    <section className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          From the Insights
        </h2>
        <Link
          href="/insights"
          className="text-sm underline decoration-black/30 hover:decoration-black dark:decoration-white/30 dark:hover:decoration-white text-black dark:text-white"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <InsightCard key={it.url} item={it} />
        ))}
      </div>
    </section>
  );
}
