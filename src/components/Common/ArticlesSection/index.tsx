"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";
import { articlesData } from "@/app/api/articlesData";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Type for each article
interface Article {
  id: number | string;
  slug: string;
  title: string;
  description: string;
  author: string;
  authorImg?: string;
  date: string;
  image: string;
  alt: string;
  tags: string[]; // ✅ specify string array
}

export default function ArticlesSection() {
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "snap",
    slides: { perView: 4, spacing: 24 },
    breakpoints: {
      "(max-width: 1280px)": { slides: { perView: 3, spacing: 20 } },
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 20 } },
      "(max-width: 640px)": { slides: { perView: 1, spacing: 16 } },
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <section
      className="relative w-full py-16 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100"
      aria-labelledby="articles-heading"
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div className="text-center lg:text-left">
            <h2 id="articles-heading" className="text-4xl font-bold mb-3">
              Helpful Articles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-6 lg:mb-8">
              Explore our latest insights on Golden Visa, Citizenship by Investment, and global residency programs designed for investors, entrepreneurs, and families.
            </p>
            <Link
              href="/articles"
              className="inline-block px-6 py-3 rounded-lg border border-gray-400 dark:border-gray-600 text-base font-medium hover:bg-secondary/90 dark:hover:bg-secondary transition"
            >
              Browse all articles
            </Link>
          </div>

          {loaded && instanceRef.current && (
            <div className="flex justify-center lg:justify-end lg:self-end">
              <div className="flex gap-3">
                <button
                  aria-label="Previous articles"
                  onClick={() => instanceRef.current?.prev()}
                  className="w-12 h-12 flex items-center justify-center rounded-full shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  aria-label="Next articles"
                  onClick={() => instanceRef.current?.next()}
                  className="w-12 h-12 flex items-center justify-center rounded-full shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {articlesData.map((article: Article) => (
            <article
              key={article.id}
              className="keen-slider__slide"
              itemScope
              itemType="https://schema.org/Article"
            >
              <Link
                href={`/articles/${article.slug}`}
                className="block group"
                itemProp="url"
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden rounded-lg">
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    itemProp="image"
                  />
                </div>

                {/* Text */}
                <div className="mt-4">
                  <ul className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag: string, i: number) => (
                      <li
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p
                    className="text-sm text-gray-700 dark:text-gray-300 mb-1"
                    itemProp="author"
                  >
                    {article.author}
                  </p>
                  <time
                    className="block text-xs text-gray-500 dark:text-gray-400 mb-3"
                    dateTime={new Date(article.date).toISOString()}
                  >
                    {article.date}
                  </time>
                  <h3
                    className="text-lg font-semibold leading-snug text-gray-700 group-hover:text-black dark:group-hover:text-white transition mb-3"
                    itemProp="headline"
                  >
                    {article.title}
                  </h3>
                  {article.description && (
                    <p
                      className="mt-2 text-md text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
                      itemProp="description"
                    >
                      {article.description}
                    </p>
                  )}
                  <span
                    className="inline-block mt-1 text-sm font-medium text-secondary hover:underline"
                    aria-hidden="true"
                  >
                    Read more →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
