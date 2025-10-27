// Map PROGRAM href -> brochure URL (PDF). Put PDFs in /public/brochures/*.
const brochureMap: Record<string, string> = {
    // Residency → Bulgaria (examples)
    "/residency/bulgaria/bulgaria-aif-residency": "/brochures/bulgaria-aif.pdf",
    "/residency/bulgaria/bulgaria-government-bonds-residency": "/brochures/bulgaria-gov-bonds.pdf",
    "/residency/bulgaria/bulgaria-real-estate-residency": "/brochures/bulgaria-real-estate.pdf",
  
    // Residency → Canada
    "/residency/canada/startupvisa": "/brochures/canada-startup-visa.pdf",
  
    // ...continue all programs from your menu
  };
  
  export function getBrochureUrl(programHref: string): string | null {
    return brochureMap[programHref] ?? null;
  }
  
  export type BrochureMap = typeof brochureMap;
  