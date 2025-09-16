import type { Metadata } from "next";
import InsightDetailView from "@/components/Insights/InsightDetailView";
import InsightJsonLd from "@/components/SEO/InsightJsonLd";
import { getInsightBySlug } from "@/lib/insights-content";

export const revalidate = 86400;

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = await getInsightBySlug("media", params.slug);
  if (!record) return { title: "Not Found" };
  const description = record.summary || `Media: ${record.title}`;
  return {
    title: record.title,
    description,
    alternates: { canonical: record.url },
    openGraph: {
      title: record.title,
      description,
      type: "video.other",
      url: record.url,
      images: record.hero ? [{ url: record.hero }] : undefined,
    },
    twitter: {
      card: record.hero ? "summary_large_image" : "summary",
      title: record.title,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const record = await getInsightBySlug("media", params.slug);
  if (!record) return <div className="py-20 text-center">Not found</div>;
  return (
    <>
      <InsightJsonLd record={record} />
      <InsightDetailView record={record} />
    </>
  );
}
