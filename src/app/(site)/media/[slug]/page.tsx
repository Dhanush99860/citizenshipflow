// src/app/(site)/media/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightDetailView from "@/components/Insights/InsightDetailView";
import InsightJsonLd from "@/components/SEO/InsightJsonLd";
import { getInsightBySlug } from "@/lib/insights-content";

export const revalidate = 86400;

// Next 15: params is a Promise
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ await
  const record = await getInsightBySlug("media", slug);
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
  const { slug } = await params; // ✅ await
  const record = await getInsightBySlug("media", slug);
  if (!record) return notFound(); // ✅ proper 404

  return (
    <>
      <InsightJsonLd record={record} />
      <InsightDetailView record={record} />
    </>
  );
}
