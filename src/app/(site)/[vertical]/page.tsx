// src/app/(site)/[vertical]/page.tsx
import { getAllContentCached } from "@/lib/content";
import type { Vertical, ProgramDoc } from "@/lib/content/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const VERTICALS: Vertical[] = ["residency", "citizenship", "skilled", "corporate"];

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v }));
}

export const dynamicParams = false;

export default function VerticalPage({ params }: { params: { vertical: Vertical } }) {
  const { vertical } = params;

  // Hard guard (keeps Vercel build logs clean)
  if (!VERTICALS.includes(vertical)) return notFound();

  const docs = getAllContentCached();

  // Narrow AnyDoc -> ProgramDoc
  const programs = docs.filter(
    (d): d is ProgramDoc => d.kind === "program" && d.vertical === vertical
  );

  // Count programs per country
  const byCountry = new Map<string, number>();
  for (const p of programs) {
    const c = p.country;
    if (!c) continue;
    byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
  }

  const countries = [...byCountry.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold capitalize">{vertical}</h1>

      {countries.length === 0 ? (
        <p className="text-neutral-600">No programs available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map(([country, count]) => (
            <Link
              key={country}
              href={`/${vertical}/${country}`}
              className="rounded-2xl border p-5 transition hover:bg-gray-50"
            >
              <div className="text-xl font-medium capitalize">{country}</div>
              <div className="text-sm opacity-70">{count} programs</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
