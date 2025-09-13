import CountryCarousel from "./CountryCarousel";
import { getResidencyCountries } from "@/lib/residency-content";

export default function ResidencyPreview() {
  const countries = getResidencyCountries();
  return (
    <CountryCarousel
      countries={countries as any}
      variant="compact"
      title="Residency by Investment"
      description="Discover trusted residency pathways across popular countries."
      ctaText="View all countries"
      ctaHref="/residency"
    />
  );
}
