"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Thomas R. Toe",
    role: "Project Manager",
    image: "/images/Testimonial/1.png",
    rating: 4,
    text: "Mauris Quisque bibendum uere puros sada suscep un antisenas mperdie lucus upis orta Orc natoque penaibus magnis parturien mones nascu onare maacinia grulcies nullm laoreet egestas non luctus es Uz sempe zodox Fusce sed eros luctus vehicula in sed diam Mauris a meus magna ultrices bibendum eu massa.",
  },
  {
    name: "Hanson Deck",
    role: "UX Designer",
    image: "/images/Testimonial/2.png",
    rating: 5,
    text: "Mauris Quisque bibendum uere puros sada suscep un antisenas mperdie lucus upis orta Orc natoque penaibus magnis parturien mones nascu onare maacinia grulcies nullm laoreet egestas non luctus es Uz sempe zodox Fusce sed eros luctus vehicula in sed diam Mauris a meus magna ultrices bibendum eu massa.",
  },
  {
    name: "Jane Doe",
    role: "Marketing Lead",
    image: "/images/Testimonial/3.png",
    rating: 5,
    text: "Mauris Quisque bibendum uere puros sada suscep un antisenas mperdie lucus upis orta Orc natoque penaibus magnis parturien mones nascu onare maacinia grulcies nullm laoreet egestas non luctus es Uz sempe zodox Fusce sed eros luctus vehicula in sed diam Mauris a meus magna ultrices bibendum eu massa.",
  },
  {
    name: "Alex Smith",
    role: "CEO",
    image: "/images/Testimonial/3.png",
    rating: 5,
    text: "Mauris Quisque bibendum uere puros sada suscep un antisenas mperdie lucus upis orta Orc natoque penaibus magnis parturien mones nascu onare maacinia grulcies nullm laoreet egestas non luctus es Uz sempe zodox Fusce sed eros luctus vehicula in sed diam Mauris a meus magna ultrices bibendum eu massa.",
  },
];

export default function TestimonialSlider() {
  return (
    <section className="w-full min-h-[60vh]  bg-white dark:bg-darklight py-10 md:py-16">

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 max-w-7xl w-full mx-auto px-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text text-transparent">unique approach</span>{" "}
            to wealth management
          </h2>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-medium shadow hover:opacity-90 transition">
            Schedule an expert call
          </button>
        </div>
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="!px-4 w-full flex items-center"
      >
        {testimonials.map((item, i) => (
          <SwiperSlide key={i} className="h-full">
            <div className="bg-light_bg dark:bg-dark_bg shadow-cause-shadow rounded-2xl flex flex-col md:flex-row items-stretch h-full overflow-hidden">
              {/* PROFILE SECTION */}
              <div className="border-b md:border-b-0 md:border-r border-border dark:border-dark_border p-4 flex md:flex-col items-center md:justify-center md:w-1/4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded-lg object-cover md:mt-4 md:order-2"
                />
                <div className="ml-4 md:ml-0 md:rotate-180 md:[writing-mode:vertical-rl] flex flex-col md:items-center gap-1 md:order-1">
                  <span className="text-14 font-bold uppercase text-light_text dark:text-dark_text">
                    {item.name}
                  </span>
                  <span className="text-12 text-section dark:text-muted tracking-wide">
                    {item.role}
                  </span>
                </div>
              </div>

              {/* TESTIMONIAL CONTENT */}
              <div className="relative flex-1 flex flex-col justify-between p-6 md:p-8">
                {/* Rating */}
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={18}
                      className={`${
                        idx < item.rating
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="relative z-10 text-16 text-light_text dark:text-dark_text mb-6 leading-relaxed">
                  “{item.text}”
                </p>

                {/* Decorative Quote Icon */}
                <Quote
                  size={80}
                  className="absolute bottom-4 right-4 text-muted/20 pointer-events-none select-none"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
