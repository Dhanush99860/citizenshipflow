"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import CardSlider from "./slider";

// ✅ Lazy load ContactForm only after mount (improves TBT/LCP)
const ContactForm = dynamic(() => import("@/components/ContactForm/index"), {
  ssr: false,
  loading: () => null,
});

const Hero = () => {
  const leftAnimation = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  const rightAnimation = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section
      className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1"
      id="main-banner"
    >
      {/* ✅ Background Image with fetchPriority */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/silhouettes.webp"
          alt="Immigration and investment opportunities background"
          fill
          className="object-cover object-center"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-blue-600/90" />
      </div>

      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12">
          {/* ✅ Left Content */}
          <motion.div {...leftAnimation} className="lg:col-span-5 col-span-12">
            <div className="flex gap-6 items-center lg:justify-start justify-center mb-5 mt-24">
              <Image
                src="/images/icons/icon-bag.svg"
                alt="Residency and citizenship icon"
                width={40}
                height={40}
              />
              <p className="text-white sm:text-24 text-18 mb-0">
                Residency & Citizenship{" "}
                <span className="text-secondary">Made Easy</span>
              </p>
            </div>

            <h1 className="font-medium lg:text-76 md:text-70 text-54 lg:text-start text-center text-white mb-10">
              Secure Your <span className="text-secondary">Future</span> with
              Global <span className="text-secondary">Investment Visas</span>!
            </h1>

            {/* ✅ Buttons with accessible roles */}
            <div className="flex items-center md:justify-start justify-center gap-4 md:gap-8">
              <Link
                href="/eligibility-check"
                aria-label="Check your visa eligibility"
                className="bg-secondary border border-secondary rounded-lg 
                text-base md:text-[21px] leading-tight md:leading-normal 
                font-medium text-white 
                hover:bg-transparent hover:text-secondary 
                py-2 px-4 md:px-7 z-50 transition"
              >
                Check your Eligibility
              </Link>

              <Link
                href="/downloads/guide.pdf"
                aria-label="Download immigration guide"
                className="bg-transparent border border-secondary rounded-lg 
                text-base md:text-[21px] leading-tight md:leading-normal 
                font-medium text-white 
                hover:bg-secondary hover:text-white 
                py-2 px-4 md:px-7 transition"
              >
                Download Guide
              </Link>
            </div>

            {/* ✅ App Store Links */}
            <div className="flex items-center md:justify-start justify-center gap-12 mt-20">
              <Link
                href="https://play.google.com/store/apps/details?id=com.xiphiasimmigration"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download our app from Google Play Store"
                className="hover:scale-110 duration-300"
              >
                <Image
                  src="/images/hero/playstore.png"
                  alt="Google Play Store"
                  width={240}
                  height={72}
                  priority={false}
                />
              </Link>
              <Link
                href="https://apps.apple.com/app/idXXXXXXXX" // Replace with real app link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download our app from Apple App Store"
                className="hover:scale-110 duration-300"
              >
                <Image
                  src="/images/hero/applestore.png"
                  alt="Apple App Store"
                  width={240}
                  height={72}
                />
              </Link>
            </div>
          </motion.div>

          {/* ✅ Right Side (lazy ContactForm) */}
          <motion.div {...rightAnimation} className="col-span-7 lg:block hidden">
            <div className="ml-12 -mr-[13rem] p-[200px]">
              <ContactForm />
            </div>
          </motion.div>
        </div>

        <CardSlider />
      </div>

      {/* Background blur bubble */}
      <div className="absolute w-50 h-50 bg-gradient-to-bl from-secondary/30 via-secondary/10 to-secondary/20 blur-[120px] rounded-full -top-64 -right-14 -z-10"></div>
    </section>
  );
};

export default Hero;
