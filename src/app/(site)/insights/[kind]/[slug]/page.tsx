import Link from "next/link";
import InsightsList from "@/components/Insights/InsightsList";
import { getAllInsights, getInsightsFacets } from "@/lib/insights-content";
import type { InsightKind } from "@/types/insights";
import FiltersBar from "@/components/Insights/FiltersBar";

export const revalidate = 86400;

type PageProps = {
  searchParams: {
    q?: string;
    kind?: InsightKind;
    country?: string;
    program?: string;
    tag?: string;
    page?: string;
  };
};

export default async function InsightsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page || "1");
  const { items, total, pageSize } = await getAllInsights({
    q: searchParams.q,
    kind: searchParams.kind,
    country: searchParams.country,
    program: searchParams.program,
    tag: searchParams.tag,
    page,
    pageSize: 12,
  });

  const facets = await getInsightsFacets();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const makePageHref = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.kind) params.set("kind", searchParams.kind);
    if (searchParams.country) params.set("country", searchParams.country);
    if (searchParams.program) params.set("program", searchParams.program);
    if (searchParams.tag) params.set("tag", searchParams.tag);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/insights${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">Insights</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Articles, news, media and blog updates from XIPHIAS Immigration.
      </p>

      {/* Client Filter Bar (URL-driven) */}
      <div className="mt-6">
        <FiltersBar
          initialQuery={searchParams.q || ""}
          initialKind={searchParams.kind}
          initialCountry={searchParams.country}
          initialProgram={searchParams.program}
          initialTag={searchParams.tag}
          facets={facets}
        />
      </div>

      <div className="mt-8">
        <InsightsList items={items} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between">
          <Link
            href={makePageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`px-3 py-1.5 rounded border ${
              page <= 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Previous
          </Link>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <Link
            href={makePageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`px-3 py-1.5 rounded border ${
              page >= totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  );
}
