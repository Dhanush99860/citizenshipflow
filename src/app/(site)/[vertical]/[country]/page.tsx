// ✅ src/app/(site)/[vertical]/[country]/page.tsx
// Country index: lists programs in a country for the given vertical
import { getAllContentCached } from "@/lib/content";
import type { Vertical, ProgramDoc } from "@/lib/content/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

const VERTICALS: Vertical[] = ["residency", "citizenship", "skilled", "corporate"];

export function generateStaticParams() {
  const docs = getAllContentCached();
  const combos = new Set<string>();
  for (const d of docs) {
    if ((d as any).kind === "program") {
      const p = d as ProgramDoc;
      if (VERTICALS.includes(p.vertical) && p.country) {
        combos.add(`${p.vertical}__${p.country}`);
      }
    }
  }
  return Array.from(combos).map((key) => {
    const [vertical, country] = key.split("__");
    return { vertical, country };
  });
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { vertical: Vertical; country: string };
}): Promise<Metadata> {
  const { vertical, country } = params;
  if (!VERTICALS.includes(vertical) || !country) return { title: "Not found" };
  const capVertical = vertical.charAt(0).toUpperCase() + vertical.slice(1);
  const capCountry = country.charAt(0).toUpperCase() + country.slice(1);
  const title = `${capCountry} – ${capVertical} Programs`;
  const description = `Discover ${vertical} programs available in ${capCountry}. Compare your options and find the right path.`;
  const canonicalPath = `/${vertical}/${country}`;
  const canonicalUrl = `https://www.xiphiasimmigration.com${canonicalPath}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "XIPHIAS Immigration",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: `${title} – XIPHIAS Immigration`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export default function CountryPage({
  params,
}: {
  params: { vertical: Vertical; country: string };
}) {
  const { vertical, country } = params;
  if (!VERTICALS.includes(vertical) || !country) return notFound();

  const docs = getAllContentCached();
  const programs = docs.filter(
    (d): d is ProgramDoc =>
      (d as any).kind === "program" &&
      (d as ProgramDoc).vertical === vertical &&
      (d as ProgramDoc).country === country
  );

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold capitalize">
        {country} – {vertical}
      </h1>

      {programs.length === 0 ? (
        <p className="text-neutral-600">No programs available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p.url}
              href={`/${p.vertical}/${p.country}/${p.program}`}
              className="rounded-2xl border p-5 transition hover:bg-gray-50"
            >
              <div className="text-xl font-medium">{p.title}</div>
              {p.summary ? (
                <div className="text-sm opacity-70 mt-1">{p.summary}</div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}