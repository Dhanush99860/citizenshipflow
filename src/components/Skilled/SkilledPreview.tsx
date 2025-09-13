// src/components/Skilled/SkilledPreview.tsx
import CountryCarousel from "@/components/Residency/CountryCarousel";
import { getSkilledCountries } from "@/lib/skilled-content";

// tiny helper (local copy)
function slugify(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function SkilledPreview() {
  // fetch skilled countries and normalize a few fields the carousel expects
  const raw = await getSkilledCountries();
  const countries = (raw ?? []).map((c: any) => ({
    ...c,
    category: c?.category ?? "skilled",
    title: c?.title ?? c?.country ?? "Skilled country",
    country: c?.country ?? c?.title ?? "Unknown",
    countrySlug:
      c?.countrySlug ?? c?.slug ?? (c?.country ? slugify(c.country) : "unknown"),
    // heroImage is optional; the carousel has a safe fallback
  }));

  return (
    <section className="mx-auto max-w-screen-2xl px-4">
      <CountryCarousel
        countries={countries as any}
        title="Skilled Migration by Country"
        description="Explore points-based PR, work permits and talent visas."
        ctaText="View all countries"
        ctaHref="/skilled"
      />
    </section>
  );
}
