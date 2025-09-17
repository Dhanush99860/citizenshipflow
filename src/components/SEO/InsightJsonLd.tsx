import type { InsightRecord } from "@/types/insights";

/**
 * Outputs JSON-LD for Article / NewsArticle / BlogPosting / VideoObject depending on kind.
 */
export default function InsightJsonLd({ record }: { record: InsightRecord }) {
  const type =
    record.kind === "news"
      ? "NewsArticle"
      : record.kind === "blog"
        ? "BlogPosting"
        : record.kind === "media"
          ? "VideoObject"
          : "Article";

  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": type,
    headline: record.title,
    datePublished: record.date,
    dateModified: record.updated || record.date,
    author: record.author
      ? { "@type": "Person", name: record.author }
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": record.url,
    },
  };

  if (record.hero) {
    data.image = [record.hero];
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
