import { getAllContentCached } from '@/lib/content';
import type { Vertical } from '@/lib/content/types';
import Link from 'next/link';

export function generateStaticParams() {
  const docs = getAllContentCached();
  return docs.filter((d) => d.kind === 'program').map((d) => ({ vertical: d.vertical, country: d.country }));
}
export const dynamicParams = false;

export default function CountryPage({ params }: { params: { vertical: Vertical; country: string } }) {
  const { vertical, country } = params;
  const docs = getAllContentCached();
  const programs = docs.filter((d) => d.kind === 'program' && d.vertical === vertical && d.country === country);
  const overview = docs.find(
    (d) => d.kind === 'hub' && d.countries?.includes(country) && d.verticals?.includes(vertical),
  );

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold capitalize">
          {country} — {vertical}
        </h1>
        {overview?.summary && <p className="opacity-80">{overview.summary}</p>}
      </header>
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((p) => (
          <a key={p.url} href={p.url} className="rounded-2xl border p-5 hover:bg-gray-50">
            <div className="text-lg font-medium">{p.title}</div>
            {p.summary && <div className="opacity-80 text-sm">{p.summary}</div>}
          </a>
        ))}
      </section>
    </main>
  );
}
