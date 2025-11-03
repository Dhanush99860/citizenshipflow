// src/app/(site)/[vertical]/[country]/page.tsx
import { getAllContentCached } from "@/lib/content";
import type { Metadata } from "next";
import type { Vertical, ProgramDoc } from "@/lib/content/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const VERTICALS: Vertical[] = ["residency", "citizenship", "skilled", "corporate"];

type RouteParams = { vertical: Vertical; country: string };

export async function generateStaticParams() {
  const docs = getAllContentCached().filter(
    (d): d is ProgramDoc => d.kind === "program"
  );

  const seen = new Set<string>();
  const out: Array<{ vertical: string; country: string }> = [];

  for (const d of docs) {
    if (!d.vertical || !d.country) continue;
    const key = `${d.vertical}|${d.country}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ vertical: d.vertical, country: d.country });
  }

  return out;
}

export const dynamicParams = false;

export default async function CountryPage(
  { params }: { params: Promise<RouteParams> }
) {
  const { vertical, country } = await params;

  if (!VERTICALS.includes(vertical) || !country) return notFound();

  const docs = getAllContentCached();
  const programs = docs.filter(
    (d): d is ProgramDoc =>
      d.kind === "program" && d.vertical === vertical && d.country === country
  );

  if (programs.length === 0) return notFound();

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold capitalize">
        {country} – {vertical}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => {
          const subtitle = p.tagline ?? p.summary; // ✅ safe fallback
          return (
            <Link
              key={p.url /* ensures uniqueness */}
              href={p.url}
              className="rounded-2xl border p-5 transition hover:bg-gray-50"
            >
              <div className="text-lg font-medium">{p.title}</div>
              {subtitle && <div className="text-sm opacity-70">{subtitle}</div>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

/** Metadata for a specific vertical + country listing */
export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { vertical, country } = await params;

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