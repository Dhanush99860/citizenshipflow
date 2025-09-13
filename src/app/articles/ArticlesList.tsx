"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Newspaper, ArrowRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/getArticles";

interface Props {
  articles: ArticleMeta[];
}

export default function ArticlesList({ articles }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const articlesPerPage = 9;

  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      (article.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, articles]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));

  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    return filteredArticles.slice(startIndex, startIndex + articlesPerPage);
  }, [currentPage, filteredArticles]);

  const topNews = useMemo(() => articles.slice(0, 6), [articles]);

  return (
    <section className="w-full py-16 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 font-['Lato']">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* ===== MAIN COLUMN ===== */}
        <div className="lg:col-span-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article, i) => (
              <article
                key={article.slug}
                className="group bg-white/90 dark:bg-neutral-900/80 backdrop-blur-xl rounded-lg border-2 border-neutral-50 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col"
                itemScope
                itemType="https://schema.org/Article"
              >
                <Link href={`/articles/${article.slug}`} className="block">
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={article.image || "/images/hero/silhouettes.webp"}
                      alt={article.alt || article.title || "XIPHIAS Article"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL="/images/placeholder.png"
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>

                {/* Meta */}
                <div className="px-6 pt-4 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-2">
                  By{" "}
                  <span itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name" rel="author">
                      {article.author || "XIPHIAS Team"}
                    </span>
                  </span>
                  |{" "}
                  <time dateTime={article.date} itemProp="datePublished">
                    {article.date}
                  </time>
                </div>

                {/* Content */}
                <div className="px-6 pt-4 flex flex-col justify-between flex-1">
                  <div>
                    <h2 id={`article-${article.slug}`}
                      className="text-lg md:text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors"
                      itemProp="headline"
                    >
                      {article.title || "Untitled Article"}
                    </h2>
                    <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 line-clamp-3 mb-3"
                      itemProp="description"
                    >
                      {article.description || "Read more about this update from XIPHIAS Superfoods."}
                    </p>
                  </div>

                  {/* Neutral Read More */}
                  <Link href={`/articles/${article.slug}`}
                    className="group text-sm md:text-base font-medium text-neutral-800 dark:text-neutral-200 mt-auto inline-flex items-center gap-1 pb-4"
                  >
                    Read more 
                    <ArrowRight
                      size={18}
                      className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center mt-12 gap-3 items-center" aria-label="Pagination Navigation">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 flex items-center gap-2 text-sm md:text-base font-medium bg-white/90 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
              >
                <ChevronLeft size={18} /> Prev
              </button>

              <span className="px-4 py-2 text-sm md:text-base font-semibold">
                Page <span className="text-neutral-900 dark:text-neutral-200">{currentPage}</span> of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 flex items-center gap-2 text-sm md:text-base font-medium bg-white/90 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
              >
                Next <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </div>

        {/* ===== SIDEBAR ===== */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="sticky top-24 flex flex-col gap-8">
            
            {/* Search */}
            <div className="bg-white/95 dark:bg-neutral-900/90 backdrop-blur-lg p-4 rounded-lg shadow-sm border-2 border-neutral-50 dark:border-neutral-800">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Search Articles & News
              </h3>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Search articles by title"
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm md:text-base focus:ring-2 focus:ring-neutral-400 outline-none"
                />
                <Search size={18} className="absolute right-3 top-3 text-neutral-400" aria-hidden />
              </div>
            </div>

            {/* Top News */}
            <div className="bg-white/95 dark:bg-neutral-900/90 backdrop-blur-lg p-4 rounded-lg shadow-sm border-2 border-neutral-50 dark:border-neutral-800 max-h-[500px] overflow-y-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] 
    [&::-webkit-scrollbar]:hidden">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Newspaper size={18} /> Top News
              </h3>
              <ul className="space-y-4">
                {topNews.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={article.image || "/images/hero/silhouettes.webp"}
                          alt={article.alt || article.title || "Article"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-sm md:text-base font-medium line-clamp-2 text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
                        {article.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
