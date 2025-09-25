// ===== Usage example (no slider, 1st big on left + list on right) =====
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
    // heroImage optional; component has a safe fallback
  }));

  return (
    <section className="mx-auto max-w-screen-2xl px-4">
      <CountryCarousel
        countries={countries as any}
        layout="featureList"         // new 3+5 layout
        variant="plush"
        title="Citizenship by Country"
        description="Explore citizenship by investment and naturalization routes."
        ctaText="Browse all countries"
        ctaHref="/citizenship"
        showSearch
        showRegionFilter             // only shows if your data has region
        rightInitialMobile={5}       // show 5 on phones
        rightInitialDesktop={10}     // show 10 on md+
        rightRevealStep={10}         // “Show more” step
        seoItemListJsonLd            // optional structured data
      />
    </section>
  );
}
