"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import LogoWhite from "@/components/Layout/Header/LogoWhite/index";

type Section = {
  title: string;
  links: { label: string; href: string }[];
};

const SECTIONS: Section[] = [
  {
    title: "Knowledge Repository",
    links: [
      { label: "Bonds", href: "#" },
      { label: "IPO", href: "#" },
      { label: "Mutual Funds", href: "#" },
      { label: "Portfolio Management Services", href: "#" },
      { label: "Wealth Monitor", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Investment Philosophy", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Contact", href: "#" },
      { label: "Disclaimer", href: "#" },
      { label: "Fraud Notice", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms & Disclosure", href: "#" },
    ],
  },
];

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen((p) => (p === key ? null : key));

  return (
    <footer className="relative text-gray-900 dark:text-white transition-colors duration-300">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-900 dark:via-indigo-800 dark:to-black" />
      <div className="relative container mx-auto px-4 md:px-6 lg:max-w-screen-xl">
        {/* ------- Top: Left (app+newsletter) + Right (links) ------- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 pb-10 border-b border-white/20 dark:border-white/10">
          {/* Left */}
          <div className="md:col-span-4">
            <div className="mb-6">
              <LogoWhite />
            </div>

            {/* App card */}
            <div className="bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg max-w-[400px] w-full border border-white/30">
              <div className="flex items-center gap-4">
                {/* Left side - QR Code */}
                <div className="h-24 w-24 rounded-lg bg-white/30 dark:bg-white/10 flex items-center justify-center shadow-md">
                  <img
                    src="/images/footer/qrcode.webp"
                    alt="Download app via QR Code"
                    className="h-20 w-20 object-contain"
                  />
                </div>

                {/* Right side - Text + Store icons */}
                <div className="flex-1">
                  <p className="text-sm md:text-base text-white/90">
                    Track all your documentation in one place
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src="/images/footer/appstore.svg"
                      alt="Download on App Store"
                      className="h-9 w-auto transition-transform hover:scale-110 hover:drop-shadow-lg"
                    />
                    <img
                      src="/images/footer/playstore.65459def.svg"
                      alt="Get it on Google Play"
                      className="h-9 w-auto transition-transform hover:scale-110 hover:drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter blurb */}
            <p className="text-sm md:text-base text-white/80 mt-5 max-w-xs">
              Our weekly expert newsletter on stories that matter to your money.
            </p>

            {/* Newsletter input */}
            <form
              className="flex items-stretch mt-3 max-w-[320px] shadow-md rounded-md overflow-hidden"
              aria-label="Subscribe to newsletter"
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-10 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 text-sm outline-none"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-sm font-medium text-white transition-colors"
              >
                Subscribe
              </button>
            </form>

          </div>

          {/* Right – desktop grid / mobile accordion */}
          <div className="md:col-span-8">
            {/* Desktop: 3 columns */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {SECTIONS.map((sec) => (
                <div key={sec.title}>
                  <h4 className="text-md md:text-md lg:text-lg font-semibold text-white mb-4">
                    {sec.title}
                  </h4>
                  <ul className="space-y-2">
                    {sec.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-base md:text-md leading-relaxed text-white/80 hover:text-white transition"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mobile: accordion */}
            <div className="md:hidden divide-y divide-white/20 rounded-lg mt-1">
              {SECTIONS.map((sec) => {
                const isOpen = open === sec.title;
                return (
                  <div key={sec.title}>
                    <button
                      type="button"
                      onClick={() => toggle(sec.title)}
                      className="w-full flex items-center justify-between py-4"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[13px] font-medium text-white">
                        {sec.title}
                      </span>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                        <Icon
                          icon="mdi:chevron-down"
                          width="16"
                          className={`transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-[max-height] duration-300 ${isOpen ? "max-h-80" : "max-h-0"
                        }`}
                    >
                      <ul className="pb-4 space-y-2">
                        {sec.links.map((l) => (
                          <li key={l.label}>
                            <Link
                              href={l.href}
                              className="block text-[13px] text-white/80 hover:text-white pl-1"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------- Tagline + Social row ------- */}
        <div className="py-8 border-b border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
              You are building India’s future,{" "}
              <br className="md:hidden" /> we are building yours.
            </h2>

            {/* Social icons row */}
            <div className="flex items-center gap-5 [&>a>svg]:w-8 [&>a>svg]:h-8">
              {[
                { href: "#", label: "YouTube", icon: "mdi:youtube", hover: "hover:text-red-400" },
                { href: "#", label: "LinkedIn", icon: "mdi:linkedin", hover: "hover:text-blue-400" },
                { href: "#", label: "Facebook", icon: "mdi:facebook", hover: "hover:text-blue-500" },
                { href: "#", label: "Instagram", icon: "mdi:instagram", hover: "hover:text-pink-400" },
                { href: "#", label: "Twitter / X", icon: "mdi:twitter", hover: "hover:text-sky-400" },
              ].map(({ href, label, icon, hover }) => (
                <Link key={label} href={href} aria-label={label}>
                  <Icon
                    icon={icon}
                    className={`social-icon text-white ${hover}`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>


        {/* ------- Payment Icons ------- */}
        <div className="py-6 flex flex-wrap items-center gap-4 justify-center md:justify-start">
          {[
            { src: "/images/footer/PaymentMethod/Amex.png", alt: "Amex" },
            { src: "/images/footer/PaymentMethod/GooglePay.png", alt: "GooglePay" },
            { src: "/images/footer/PaymentMethod/Maestro.png", alt: "Maestro" },
            { src: "/images/footer/PaymentMethod/PayPal.png", alt: "PayPal" },
            { src: "/images/footer/PaymentMethod/Stripe.png", alt: "Stripe" },
          ].map((icon) => (
            <div
              key={icon.alt}
              className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-lg p-2 shadow-md hover:scale-110 hover:shadow-lg transition-transform"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="h-8 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* ------- Bottom legal ------- */}
        <div className="py-6">
          <p className="text-[11px] text-white/70">
            ©2021–{new Date().getFullYear()} XIPHIAS. All rights reserved.
          </p>

          <p className="mt-3 text-[11px] leading-4 text-white/70 max-w-2xl">
            Investments in the securities market are subject to market risks and
            investors should read all the related documents carefully before
            investing. Terms and conditions of the website are applicable.{" "}
            <Link
              href="#"
              className="underline hover:text-white transition"
            >
              Privacy Policy
            </Link>{" "}
            of the website is applicable.
          </p>
        </div>
      </div>
    </footer>
  );
}
