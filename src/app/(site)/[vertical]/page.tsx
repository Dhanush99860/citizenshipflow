import { getAllContentCached } from "@/lib/content";
import type { Vertical, ProgramDoc } from "@/lib/content/types";
import Link from "next/link";

export function generateStaticParams() {
  return ["residency", "citizenship", "skilled", "corporate"].map((v) => ({
    vertical: v,
  }));
}
export const dynamicParams = false;

export default async function VerticalPage(props: {
  params: Promise<{ vertical: Vertical }>;
}) {
  const params = await props.params;
  const { vertical } = params;
  const docs = getAllContentCached();

  // Narrow AnyDoc -> ProgramDoc using a type guard so TS knows `vertical`/`country` exist
  const programs = docs.filter(
    (d): d is ProgramDoc => d.kind === "program" && d.vertical === vertical,
  );

  const byCountry = new Map<string, number>();
  for (const p of programs)
    byCountry.set(p.country, (byCountry.get(p.country) || 0) + 1);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold capitalize">{vertical}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...byCountry.entries()].map(([country, count]) => (
          <Link
            key={country}
            href={`/${vertical}/${country}`}
            className="rounded-2xl border p-5 hover:bg-gray-50"
          >
            <div className="text-xl font-medium capitalize">{country}</div>
            <div className="opacity-70 text-sm">{count} programs</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
