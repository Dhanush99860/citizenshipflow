// src/components/Citizenship/CitizenshipPreview.tsx
import CountryCarousel from "@/components/Residency/CountryCarousel";
import { getCitizenshipCountries } from "@/lib/citizenship-content";

// tiny helper
function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function CitizenshipPreview() {
  const raw = await getCitizenshipCountries();

  const countries = (raw ?? []).map((c: any) => ({
    ...c,
    category: c?.category ?? "citizenship",
    title: c?.title ?? c?.country ?? "Citizenship country",
    country: c?.country ?? c?.title ?? "Unknown",
    countrySlug:
      c?.countrySlug ??
      c?.slug ??
      (c?.country ? slugify(c.country) : "unknown"),
    // heroImage optional; carousel has a safe fallback
  }));

  return (
    <section className="mx-auto max-w-screen-2xl px-4">
      <CountryCarousel
        countries={countries as any}
        variant="compact"
        title="Citizenship by Country"
        description="Explore citizenship by investment and naturalization routes."
        ctaText="View all countries"
        ctaHref="/citizenship"
      />
    </section>
  );
}
