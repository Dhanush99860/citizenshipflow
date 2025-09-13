// src/lib/seo.tsx

// Inline JSON-LD helper
export function JsonLd({ data }: { data: unknown }) {
    // Next/React will safely inject this as a <script type="application/ld+json">
    return (
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }
  
  // Breadcrumb JSON-LD
  export function breadcrumbLd(items: { name: string; url: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.url,
      })),
    };
  }
  
  // FAQ JSON-LD
  export function faqLd(faqs: { q: string; a: string }[] | undefined) {
    if (!faqs?.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    };
  }
  