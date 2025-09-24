"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const OurApproach = () => {
  // Steps with detailed content and key points
  const steps = [
    {
      label: "Discovery",
      number: "01",
      title:
        "We start with an in‑depth consultation to understand your goals, needs and eligibility.",
      keyPoints: [
        "Comprehensive analysis of personal and business objectives",
        "Eligibility checks across available migration and investment options",
        "Transparent overview of timelines and requirements",
      ],
      image: "/images/solutions/recommended.svg",
    },
    {
      label: "Strategy",
      number: "02",
      title:
        "Our experts craft a bespoke migration or investment plan aligned with your goals.",
      keyPoints: [
        "Tailored program selection and risk-benefit analysis",
        "Clear roadmap with legal and financial guidance",
        "Strategic allocation across applicable pathways",
      ],
      image: "/images/solutions/recommended.svg",
    },
    {
      label: "Preparation",
      number: "03",
      title:
        "We manage document collection, due diligence and legal compliance end-to-end.",
      keyPoints: [
        "Comprehensive document checklist and guidance",
        "Coordination with legal and financial partners",
        "Pre‑submission review ensuring accuracy and compliance",
      ],
      image: "/images/solutions/recommended.svg",
    },
    {
      label: "Execution",
      number: "04",
      title:
        "We handle application submission and guide you through to successful approval.",
      keyPoints: [
        "Complete application management and follow‑ups",
        "Real‑time updates and progress tracking",
        "Post‑approval assistance and relocation support",
      ],
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
      <div className="max-w-7xl w-full mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text text-transparent">
              Approach
            </span>{" "}
            to your global success
          </h2>
          <Link
            href="/contact"
            className="bg-primary text-white px-6 py-3 rounded-full font-medium shadow hover:opacity-90 transition"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Stepper navigation */}
        <div className="mb-12 relative">
          <div className="relative inline-flex flex-wrap items-center gap-4">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 -z-10">
              <div className="w-full h-0.5 bg-gray-300 dark:bg-dark_border" />
            </div>

            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Step ${step.number}: ${step.label}`}
                className={`relative z-10 text-center py-2 px-4 rounded-full text-xs sm:text-sm font-medium transition
                  ${
                    activeIndex === idx
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 dark:bg-darklight text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slateGray"
                  }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
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
          {steps.map((step, idx) => (
            <SwiperSlide key={idx}>
              <article className="relative bg-white dark:bg-darklight text-light_text dark:text-dark_text rounded-2xl flex flex-col md:flex-row items-stretch shadow-md overflow-hidden h-full border border-blue-100 dark:border-blue-200">
                {/* Glossy overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 dark:from-black/20 dark:via-transparent dark:to-black/5 opacity-60" />
                </div>

                {/* Text section */}
                <div className="relative z-10 px-6 md:px-10 py-10 md:py-16 md:w-1/2 flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">
                    <span className="border border-gray-400 dark:border-dark_border rounded-full px-3 py-0.5 text-xs font-semibold">
                      {step.number}
                    </span>
                    {step.label.toUpperCase()}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-snug mb-4">
                    {step.title}
                  </h3>
                  {/* Key points */}
                  <ul className="space-y-2">
                    {step.keyPoints.map((point, pi) => (
                      <li key={pi} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Graphic / Image section */}
                <div className="relative z-10 md:w-1/2 h-64 md:h-auto flex">
                  <img
                    src={step.image}
                    alt={step.label}
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

export default OurApproach;
