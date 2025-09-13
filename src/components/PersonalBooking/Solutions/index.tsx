"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

const Solutions = () => {
  const solutions = [
    {
      label: "Solution-1",
      number: "01",
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
      image: "/images/solutions/recommended.svg",
    },
    {
      label: "Solution-2",
      number: "02",
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
      image: "/images/solutions/recommended.svg",
    },
    {
      label: "Solution-3",
      number: "03",
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
      image: "/images/solutions/recommended.svg",
    },
    {
      label: "Solution-4",
      number: "04",
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
      image: "/images/solutions/recommended.svg",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  return (
    <section className="bg-light_gray dark:bg-dark_bg text-light_text dark:text-dark_text transition-colors duration-300">
      {/* Container */}
      <div className="max-w-7xl w-full mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
  Dolor{" "}
  <span className="bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text text-transparent">sit amet</span>{" "}
  consectetur adipiscing
</h2>

          <button className="bg-primary text-white px-6 py-3 rounded-full font-medium shadow hover:opacity-90 transition">
            Schedule an expert call
          </button>
        </div>

        {/* Stepper with connecting line */}
        <div className="mb-12 relative">
          <div className="relative inline-flex flex-wrap items-center gap-4">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0">
              <div className="w-full h-0.5 bg-gray-300 dark:bg-dark_border" />
            </div>

            {solutions.map((sol, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Step ${sol.number}: ${sol.label}`}
                className={`relative z-10 text-center py-2 px-4 rounded-full text-xs sm:text-sm font-medium transition 
                  ${
                    activeIndex === idx
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 dark:bg-darklight text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slateGray"
                  }`}
              >
                {sol.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            768: { slidesPerView: 1, spaceBetween: 24 },
            1024: { slidesPerView: 1, spaceBetween: 32 },
          }}
        >
          {solutions.map((sol, idx) => (
            <SwiperSlide key={idx}>
              <article className="relative bg-white dark:bg-darklight text-light_text dark:text-dark_text rounded-2xl flex flex-col md:flex-row items-stretch shadow-md overflow-hidden h-full border border-blue-100 dark:border-blue-200">
                {/* Glossy overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/10 opacity-60" />
                </div>

                {/* Text */}
                <div className="relative z-10 px-6 md:px-10 py-10 md:py-16 md:w-1/2 flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">
                    <span className="border border-gray-400 dark:border-dark_border rounded-full px-3 py-0.5 text-xs font-semibold">
                      {sol.number}
                    </span>
                    {sol.label.toUpperCase()}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-snug">
                    {sol.title}
                  </h3>
                </div>

                {/* Image */}
                <div className="relative z-10 md:w-1/2 h-64 md:h-auto flex">
                  <img
                    src={sol.image}
                    alt={sol.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Solutions;
