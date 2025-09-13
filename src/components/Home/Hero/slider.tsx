"use client";
import { useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cardData } from "@/app/api/data";
import Image from "next/image";
import Link from "next/link";
import { FaRegNewspaper } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import Script from "next/script";

const CardSlider = () => {
  // Memoize slider settings
  const sliderSettings = useMemo(
    () => ({
      autoplay: true,
      dots: false,
      arrows: false,
      infinite: true,
      autoplaySpeed: 2500,
      speed: 800,
      slidesToShow: 4,
      slidesToScroll: 1,
      cssEase: "ease-in-out",
      responsive: [
        { breakpoint: 479, settings: { slidesToShow: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 1280, settings: { slidesToShow: 3 } },
      ],
    }),
    []
  );

  // Headlines for ticker
  const headlines = useMemo(
    () => cardData.map((item) => `${item.title} — ${item.short}`),
    []
  );

  // JSON-LD structured data
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: cardData.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.link,
        name: item.title,
        description: item.short,
      })),
    }),
    []
  );

  return (
    <>
      {/* JSON-LD SEO Schema */}
      <Script
        id="card-slider-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="lg:-mt-16 mt-16 bg-transparent dark:bg-transparent"
        aria-label="Latest Immigration and Investment News & Updates"
      >
        {/* News Ticker */}
        <div
          className="sticky top-0 z-20 flex items-center gap-4 mb-6 px-4 py-3 rounded-xl
          bg-white/90 dark:bg-dark_grey/90 border border-gray-200/30 dark:border-white/10
          backdrop-blur-lg shadow-sm"
          aria-label="News ticker"
        >
          {/* Left Label */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-lg
            bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold text-sm shadow-sm"
          >
            <FaRegNewspaper
              className="text-black text-base"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Latest News</span>
            <span className="sm:hidden">News</span>
          </div>

          {/* Headlines */}
          <Marquee
            gradient
            gradientWidth={30}
            speed={85}
            pauseOnHover
            className="flex-1"
          >
            {headlines.map((headline, index) => (
              <span
                key={index}
                className="text-sm mx-6 whitespace-nowrap text-gray-800 dark:text-gray-200
                  hover:text-yellow-500 transition-colors duration-200 cursor-pointer"
              >
                {headline}
              </span>
            ))}
          </Marquee>

          {/* Right Link */}
          <Link
            href="/newsroom"
            className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Card Slider */}
        <Slider {...sliderSettings}>
          {cardData.map((item, index) => (
            <article
              key={index}
              className="px-3"
              itemScope
              itemType="https://schema.org/CreativeWork"
            >
              <Link href={item.link} itemProp="url" aria-label={item.title}>
                <div
                  className="relative h-full flex flex-col rounded-xl transition-all duration-500
                    hover:-translate-y-2 hover:shadow-xl bg-white/95 dark:bg-dark_grey/95
                    border border-gray-200/30 dark:border-white/10 overflow-hidden group"
                >
                  {/* Glossy Hover Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-white/5 to-white/20 dark:via-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top Section */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-200/30 dark:border-white/10">
                    <div
                      className={`${item.background} ${item.padding} rounded-full shadow-inner flex-shrink-0 
                        border border-white/30 dark:border-white/20 animate-shimmer`}
                    >
                      <Image
                        src={item.icon}
                        alt={`${item.title} - Immigration & Investment Service`}
                        width={item.width}
                        height={item.height}
                        itemProp="image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h2
                      className="text-lg font-semibold text-gray-900 dark:text-white leading-snug"
                      itemProp="headline"
                    >
                      {item.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="flex-1 px-5 py-4 flex items-center">
                    <p
                      className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 opacity-90"
                      itemProp="description"
                    >
                      {item.short}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </Slider>
      </section>
    </>
  );
};

export default CardSlider;
