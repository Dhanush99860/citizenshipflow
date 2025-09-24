"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  image: string;     // avatar
  text: string;      // short quote
  rating?: number;   // optional 1..5
  href?: string;     // full story link
};

const testimonials: Testimonial[] = [
  {
    name: "Thomas R. Toe",
    role: "Project Manager",
    image: "/images/Testimonial/1.png",
    text:
      "Clear guidance at every step. Turnaround was faster than expected and communication stayed crisp.",
    rating: 4,
    href: "/stories/thomas",
  },
  {
    name: "Hanson Deck",
    role: "UX Designer",
    image: "/images/Testimonial/2.png",
    text:
      "Felt genuinely supported throughout. The process was simple and I always knew what came next.",
    rating: 5,
    href: "/stories/hanson",
  },
  {
    name: "Jane Doe",
    role: "Marketing Lead",
    image: "/images/Testimonial/3.png",
    text:
      "Professional, reliable, and on time. Exactly the partner we needed to move quickly with confidence.",
    rating: 5,
    href: "/stories/jane",
  },
  {
    name: "Jane Doe",
    role: "Marketing Lead",
    image: "/images/Testimonial/3.png",
    text:
      "Professional, reliable, and on time. Exactly the partner we needed to move quickly with confidence.",
    rating: 5,
    href: "/stories/jane",
  },
  {
    name: "Jane Doe",
    role: "Marketing Lead",
    image: "/images/Testimonial/3.png",
    text:
      "Professional, reliable, and on time. Exactly the partner we needed to move quickly with confidence.",
    rating: 5,
    href: "/stories/jane",
  },
  {
    name: "Jane Doe",
    role: "Marketing Lead",
    image: "/images/Testimonial/3.png",
    text:
      "Professional, reliable, and on time. Exactly the partner we needed to move quickly with confidence.",
    rating: 5,
    href: "/stories/jane",
  },
];

export default function TestimonialSliderSimple({
  items = testimonials,
  title = "What our clients say",
  subtitle = "Real feedback from people who put their trust in us",
}: {
  items?: Testimonial[];
  title?: string;
  subtitle?: string;
}) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="w-full bg-white dark:bg-neutral-950 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {title}
            </h2>
            <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-300">
              {subtitle}
            </p>
          </div>

          {/* Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              ref={prevRef}
              aria-label="Previous testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              ref={nextRef}
              aria-label="Next testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, A11y]}
          onBeforeInit={(swiper) => {
            // @ts-ignore – Swiper types don't know refs at this point
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          a11y={{ enabled: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 22 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="!pb-2"
        >
          {items.map((t, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <article className="h-full rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900 p-6 md:p-7 shadow-sm">
                {/* Person */}
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                  />
                  <div>
                    <h3 className="text-base md:text-[1.05rem] font-semibold text-neutral-900 dark:text-neutral-50">
                      {t.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {t.role}
                    </p>
                    {typeof t.rating === "number" && (
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (t.rating ?? 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-300 dark:text-neutral-700"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  “{t.text}”
                </p>

              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile arrows (below slider) */}
        <div className="mt-6 sm:hidden flex items-center justify-center gap-3">
          <button
            ref={prevRef}
            aria-label="Previous testimonial"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            ref={nextRef}
            aria-label="Next testimonial"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
