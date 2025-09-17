// src/components/Corporate/CorporatePreview.tsx
import CountryCarousel from "@/components/Residency/CountryCarousel";
import { getCorporateCountries } from "@/lib/corporate-content";

// tiny helper
function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function CorporatePreview() {
  const raw = await getCorporateCountries(); // must exist in your corporate-content lib

  const countries = (raw ?? []).map((c: any) => ({
    ...c,
    category: c?.category ?? "corporate",
    title: c?.title ?? c?.country ?? "Corporate country",
    country: c?.country ?? c?.title ?? "Unknown",
    countrySlug:
      c?.countrySlug ??
      c?.slug ??
      (c?.country ? slugify(c.country) : "unknown"),
  }));

  return (
    <section className="mx-auto max-w-screen-2xl px-4">
      <CountryCarousel
        countries={countries as any}
        variant="compact"
        title="Corporate Immigration by Country"
        description="Work permits, company setup & sponsored employment routes."
        ctaText="View all countries"
        ctaHref="/corporate"
      />
    </section>
  );
}
