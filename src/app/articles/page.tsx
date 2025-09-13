// src/app/articles/page.tsx
import ArticlesList from "@/app/articles/ArticlesList"; // client component
import { getAllArticlesMeta } from "@/lib/getArticles";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

// ✅ Full SEO metadata for articles listing page
export async function generateMetadata(): Promise<Metadata> {
  const articles = getAllArticlesMeta();

  const title = "Articles & News | XIPHIAS Immigration";
  const description =
    "Stay updated with the latest articles, news, and expert insights from XIPHIAS Immigration. Explore immigration tips, policies, and global opportunities.";
  const url = "https://www.xiphiasimmigration.com/articles";

  const keywords = articles.flatMap((a) => a.tags || []).join(", ");
  const ogImage = articles[0]?.image || "/images/default-og.jpg";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "XIPHIAS Immigration",
      images: [{ url: ogImage, alt: articles[0]?.title || "XIPHIAS Articles" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    metadataBase: new URL("https://www.xiphiasimmigration.com"),
  };
}

export default function ArticlesPageServer() {
  const articles = getAllArticlesMeta();

  return (
    <>
      {/* ✅ JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            url: "https://www.xiphiasimmigration.com/articles",
            name: "Articles & News | XIPHIAS Immigration",
            description:
              "Discover the latest articles, news, and expert insights from XIPHIAS Immigration.",
            itemListElement: articles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://www.xiphiasimmigration.com/articles/${article.slug}`,
              name: article.title,
              image: article.image || "/images/default-og.jpg",
              description: article.description,
              author: article.author ? { "@type": "Person", name: article.author } : undefined,
              datePublished: article.date,
              dateModified: article.updated || article.date,
            })),
          }),
        }}
      />

      {/* ✅ Fixed modern header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg shadow-sm border-b border-neutral-200 dark:border-neutral-800 font-['Lato']">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="py-5 md:py-8">
            <h1 className="text-xl md:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
              Articles & News
            </h1>
            <p className="mt-2 md:mt-3 text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
              Stay updated with the latest{" "}
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                insights, tips, and news
              </span>{" "}
              from{" "}
              <span className="font-semibold text-primary dark:text-secondary">
                XIPHIAS Immigration
              </span>
            </p>
          </div>
          <Breadcrumb />
        </div>
      </div>

      {/* Push content below fixed header */}
      <div className="mt-[180px] md:mt-[190px] font-['Lato']">
        <ArticlesList articles={articles} />
      </div>
    </>
  );
}
