"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/getArticles";

interface Props {
    articles: ArticleMeta[];
    limit?: number;
}

export default function ArticlesPreview({ articles, limit = 2 }: Props) {
    const previewArticles = articles.slice(0, limit);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 320; // px per click
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section
            className="w-full py-16 bg-gradient-to-br 
      from-neutral-50 via-white to-neutral-100 
      dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 
      font-['Lato']"
        >
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
                    {/* Left side */}
                    <div className="max-w-2xl">
                        <h2
                            className="text-2xl md:text-3xl font-extrabold mb-4 
              text-neutral-900 dark:text-neutral-100 tracking-tight"
                        >
                            Helpful Articles
                        </h2>
                        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                            Explore our latest insights on Golden Visa, Citizenship by
                            Investment, and global residency programs designed for investors,
                            entrepreneurs, and families.
                        </p>
                        <Link
                            href="/articles"
                            className="inline-block px-6 py-2.5 rounded-xl 
              border border-neutral-300 dark:border-neutral-700 
              bg-neutral-50 dark:bg-neutral-900
              hover:bg-neutral-100 dark:hover:bg-neutral-800 
              transition-colors duration-200 
              text-sm md:text-base font-medium 
              text-neutral-900 dark:text-neutral-100 shadow-sm"
                        >
                            Browse all articles
                        </Link>
                    </div>

                    {/* Right side (arrows – only show on md and up) */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => scroll("left")}
                            aria-label="Scroll articles left"
                            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            <ChevronLeft size={22} className="text-black dark:text-white" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            aria-label="Scroll articles right"
                            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            <ChevronRight size={22} className="text-black dark:text-white" />
                        </button>
                    </div>
                </div>

                {/* Scrollable cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth
          [scrollbar-width:none] [-ms-overflow-style:none] 
          [&::-webkit-scrollbar]:hidden"
                >
                    {previewArticles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/articles/${article.slug}`}
                            className="min-w-[280px] max-w-[280px] flex-shrink-0 
              bg-white dark:bg-neutral-900 rounded-xl shadow-sm 
              border border-neutral-200 dark:border-neutral-700 
              hover:shadow-lg hover:-translate-y-1 transition-all
              flex flex-col group"
                        >
                            {/* Image */}
                            <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                                <Image
                                    src={article.image || "/images/hero/silhouettes.webp"}
                                    alt={
                                        article.alt ||
                                        (article.title
                                            ? `Article about ${article.title}`
                                            : "Investment article")
                                    }
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                {/* Author + Date */}
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                    {article.author || "XIPHIAS"} | {article.date || "2025"}
                                </p>

                                {/* Title */}
                                <h3
                                    className="text-md md:text-xl font-bold mb-3 
                  text-neutral-900 dark:text-neutral-100 leading-snug 
                  group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors"
                                >
                                    {article.title}
                                </h3>

                                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 line-clamp-3 mb-3">
                                    {article.description?.split(" ").slice(0, 10).join(" ")}
                                    {article.description && article.description.split(" ").length > 8 ? "..." : ""}
                                </p>


                                {/* Read More (decorative only, avoids duplicate link text) */}
                                <span
                                    aria-hidden="true"
                                    className="group text-sm md:text-base font-medium text-neutral-800 dark:text-neutral-200 
                  inline-flex items-center gap-1 mt-auto"
                                >
                                    Read more
                                    <ArrowRight
                                        size={18}
                                        className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                                    />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
