import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/getArticles";
import MDXContent from "@/components/Common/ArticlesSection/MDXContent";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ScrollProgress from "@/components/ScrollProgress";
import TableOfContents from "@/components/Common/ArticlesSection/TableOfContents";
import RelatedArticles from "@/components/Common/ArticlesSection/RelatedArticles";
import type { Metadata } from "next";
import { User, Calendar, Clock } from "lucide-react";

// ✅ 1. Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  const meta = article.meta;
  const url = `https://www.xiphiasimmigration.com/articles/${meta.slug}`;
  const imageUrl = meta.image || "/images/default-og.jpg";

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags?.join(", ") || undefined,
    authors: meta.author ? [{ name: meta.author }] : undefined,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url,
      siteName: "XIPHIAS Immigration",
      images: [{ url: imageUrl, alt: meta.title }],
      publishedTime: meta.date,
      authors: meta.author ? [meta.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    metadataBase: new URL("https://www.xiphiasimmigration.com"),
  };
}

// ✅ 2. Page Component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();

  const { meta, mdxSource, toc } = article;
  const ogImage = meta.image || "/images/default-og.jpg";

  // inside ArticlePage, after you destructure article
  const faqSchema = meta.faqs && meta.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: meta.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;


  return (
    <>
      {/* ✅ JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: meta.title,
            description: meta.description,
            image: ogImage?.startsWith("http")
              ? ogImage
              : `https://www.xiphiasimmigration.com${ogImage || ""}`,
            author: {
              "@type":
                meta.author === "XIPHIAS Immigration" ? "Organization" : "Person",
              name: meta.author,
              url:
                meta.author === "XIPHIAS Immigration"
                  ? "https://www.xiphiasimmigration.com"
                  : undefined,
            },
            publisher: {
              "@type": "Organization",
              name: "XIPHIAS Immigration",
              logo: {
                "@type": "ImageObject",
                url: "https://www.xiphiasimmigration.com/logo.png",
              },
            },
            datePublished: meta.date
              ? new Date(meta.date).toISOString()
              : undefined,
            dateModified: meta.updated
              ? new Date(meta.updated).toISOString()
              : meta.date
                ? new Date(meta.date).toISOString()
                : undefined,
            url: `https://www.xiphiasimmigration.com/articles/${meta.slug}`,
          }),
        }}
      />

      {/* ✅ JSON-LD FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}



      <div className="max-w-screen-2xl mx-auto h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans pb-5" style={{ fontFamily: "'Lato', sans-serif" }}>
        {/* HEADER */}
        <div className="pt-5 pb-2 px-6 dark:border-gray-700">
          <Breadcrumb />
          <ScrollProgress targetId="article-scroll" />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 px-4 md:px-8">
          {/* LEFT - TOC */}
          <aside
            className="hidden lg:flex lg:col-span-3 flex-col min-h-0"
            aria-label="Table of Contents"
          >
            <div>
              <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
                Table Of Content
              </h2>
              <TableOfContents toc={toc} rootId="article-scroll" />

            </div>

          </aside>

          {/* MIDDLE - Content */}
          <main
            id="article-scroll"
            className="lg:col-span-6 prose prose-lg max-w-none overflow-y-auto scroll-smooth px-2 py-4 
             [scrollbar-width:none] [-ms-overflow-style:none] 
             [&::-webkit-scrollbar]:hidden"
            style={{ fontSize: "16px", lineHeight: "1.6" }}
          >
            <h1 className="text-2xl md:text-3xl font-extrabold mt-3 leading-snug text-gray-900 dark:text-gray-100">
              {meta.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <span className="flex items-center gap-2 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <User className="w-4 h-4 text-blue-500" />
                {meta.author}
              </span>
              <span className="flex items-center gap-2 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <Calendar className="w-4 h-4 text-purple-500" />
                Updated {meta.updated || meta.date}
              </span>
              <span className="flex items-center gap-2 bg-gray-50 text-green-600 dark:bg-green-900 dark:text-green-300 px-3 py-1.5 rounded-full shadow-sm border border-green-200/40 dark:border-green-700">
                <Clock className="w-4 h-4 text-green-500" />
                {meta.readTime}
              </span>
            </div>

            {/* Cover Image */}
            {ogImage && (
              <div className="my-6">
                <Image
                  src={ogImage}
                  alt={meta.title}
                  width={1200}
                  height={630}
                  priority={false}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 700px"
                  placeholder="blur"
                  blurDataURL="/images/blur-placeholder.png"
                  className="rounded-md object-cover w-full h-auto shadow-sm"
                />
              </div>
            )}

            <MDXContent source={mdxSource} />
          </main>

          {/* RIGHT - Related */}
          <aside
            className="hidden lg:flex lg:col-span-3 flex-col min-h-0 space-y-6"
            aria-label="Related Reads"
          >
            <div>
              <h2 className="font-semibold mb-4 text-lg text-gray-900 dark:text-gray-100">
                Related Reads
              </h2>
              <RelatedArticles currentSlug={meta.slug} tags={meta.tags} />
            </div>
          </aside>
        </div>

        {/* MOBILE TOC + Related */}
        <div className="lg:hidden px-4 pb-6 space-y-6">
          <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-gray-100">📖 Table of Contents</summary>
            <div className="mt-3">
              <TableOfContents toc={toc} rootId="article-scroll" />
            </div>
          </details>

          <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-gray-100">✨ Related Articles</summary>
            <div className="mt-3">
              <RelatedArticles currentSlug={meta.slug} tags={meta.tags} />
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
