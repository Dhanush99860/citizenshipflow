"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Grid } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

import awardsData, { Award } from "@/app/api/contex/awardsData/awardsData";

export default function AwardSection() {
  return (
    <section
      id="awards"
      className="py-24 bg-gradient-to-b from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden"
      aria-labelledby="awards-heading"
    >
      {/* Decorative Orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-neutral-300/20 dark:bg-neutral-700/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-neutral-400/20 dark:bg-neutral-800/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14">
          <div>
            <h2
              id="awards-heading"
              className="text-2xl md:text-3xl font-extrabold 
              text-neutral-900 dark:text-neutral-100 tracking-tight"
            >
              Awards & Recognition
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We are proud to be recognized for our commitment to excellence,
              leadership, and trusted client service worldwide.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6 md:mt-0">
            <button
              className="award-prev w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/50 dark:border-neutral-700/50 shadow-sm hover:shadow-lg hover:scale-105 transition"
              aria-label="Previous awards"
            >
              ◀
            </button>
            <button
              className="award-next w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/50 dark:border-neutral-700/50 shadow-sm hover:shadow-lg hover:scale-105 transition"
              aria-label="Next awards"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Grid]}
          navigation={{
            nextEl: ".award-next",
            prevEl: ".award-prev",
          }}
          pagination={{
            clickable: true,
            el: ".award-pagination",
            renderBullet: (index, className) => {
              return `<button class="${className} w-3 h-3 mx-1 inline-block rounded-full bg-neutral-400 dark:bg-neutral-600 transition-all" aria-label="Go to slide ${index + 1}"></button>`;
            },
          }}
          spaceBetween={18}
          slidesPerView={3}
          grid={{ rows: 2, fill: "row" }}
          slidesPerGroup={6}
          loop={false}
          speed={600}
          breakpoints={{
            1024: { slidesPerView: 3, grid: { rows: 2 }, slidesPerGroup: 6 },
            768: { slidesPerView: 2, grid: { rows: 2 }, slidesPerGroup: 4 },
            0: { slidesPerView: 1, grid: { rows: 2 }, slidesPerGroup: 2 },
          }}
          className="awards-swiper pb-20"
        >
          {awardsData.map((award: Award) => (
            <SwiperSlide className="pb-5" key={award.id} aria-label={`Award: ${award.title}`}>
              <article className="relative group w-full h-[220px] rounded-br-3xl overflow-hidden bg-white dark:bg-neutral-800 hover:shadow-md transition-all duration-500 ">
                <Image
                  src={award.img}
                  alt={`${award.title} award recognition`}
                  width={500}
                  height={320}
                  className="object-cover w-full h-full absolute inset-0 opacity-90 group-hover:opacity-100 transition duration-500 p-8"
                  loading="lazy"
                />
                <div className="sr-only">{award.title}</div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination */}
        <div
          className="award-pagination flex justify-center mt-5"
          aria-label="Awards pagination"
        ></div>

        {/* Fallback Static Content (for SEO bots without JS) */}
        <noscript>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {awardsData.map((award: Award) => (
              <li key={award.id} className="border rounded-lg p-4 bg-white dark:bg-neutral-800">
                <Image
                  src={award.img}
                  alt={`${award.title} award`}
                  width={400}
                  height={250}
                />
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {award.title}
                </p>
              </li>
            ))}
          </ul>
        </noscript>
      </div>

      {/* Custom Styles for Active Bullet */}
      <style jsx global>{`
        .award-pagination .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #2563eb, #9333ea);
          width: 20px;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
}
