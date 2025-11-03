// src/app/(site)/[vertical]/page.tsx
import { getAllContentCached } from "@/lib/content";
import type { Metadata } from "next";
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

  // Extra guard (shouldn’t hit with dynamicParams=false, but keeps Vercel logs clean)
  if (!VERTICALS.includes(vertical)) return notFound();

  const docs = getAllContentCached();

  // Narrow AnyDoc -> ProgramDoc
  const programs = docs.filter(
    (d): d is ProgramDoc => d.kind === "program" && d.vertical === vertical
  );

  // Aggregate counts by country
  const byCountry = new Map<string, number>();
  for (const p of programs) {
    if (!p.country) continue; // safety
    byCountry.set(p.country, (byCountry.get(p.country) ?? 0) + 1);
  }

  const countries = [...byCountry.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

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

/**
 * Generate metadata for dynamic vertical pages.  The title and description
 * reflect the specific vertical and country being viewed.  This function
 * constructs Open Graph and Twitter metadata with an explicit canonical URL.
 */
export async function generateMetadata({ params }: { params: { vertical: Vertical; country: string } }): Promise<Metadata> {
  const { vertical, country } = params;
  if (!VERTICALS.includes(vertical) || !country) {
    return { title: "Not found" };
  }
  const capVertical = vertical.charAt(0).toUpperCase() + vertical.slice(1);
  const capCountry = country.charAt(0).toUpperCase() + country.slice(1);
  const title = `${capCountry} – ${capVertical} Programs`;
  const description = `Discover ${vertical} programs available in ${capCountry}. Compare your options and find the right path.`;
  const canonicalPath = `/${vertical}/${country}`;
  const canonicalUrl = `https://www.xiphiasimmigration.com${canonicalPath}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
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