"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Calendar, User, Briefcase, Globe, Play, Pause, ShieldCheck, Sparkles } from "lucide-react";

/**
 * ExpertBooking — Enhanced, responsive, and accessible.
 * - Polished visual design with subtle graphics that do not add extra deps.
 * - Accessible video controls (keyboard + reduced motion friendly).
 * - Dark mode tuned, motion-safe micro-interactions, and focus rings.
 * - Zero runtime assumptions that would break on Vercel.
 */
export default function ExpertBooking() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  // Respect reduced motion for auto-play
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const v = videoRef.current;
    if (!v) return;
    if (mq.matches) {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const features = [
    {
      icon: <CheckCircle className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          Direct call with <span className="font-semibold">MD / Senior Consultant</span>
        </>
      ),
    },
    {
      icon: <User className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          Personalized strategy built for <span className="font-semibold">your profile</span>
        </>
      ),
    },
    {
      icon: <Briefcase className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          In-depth review of <span className="font-semibold">opportunities & programs</span>
        </>
      ),
    },
    {
      icon: <Globe className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          Access to <span className="font-semibold">global expertise</span> & legal clarity
        </>
      ),
    },
  ];

  return (
    <section
      className="relative w-full py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
      aria-labelledby="booking-title"
    >
      {/* Decorative background mesh (pure CSS / inline data URI, no external reqs) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(#64748b 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0,14px 14px",
          }}
        />
      </div>

      <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Trusted Consultation — No obligation
            </div>

            <h2 id="booking-title" className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Schedule a Personal <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">Consultation</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto md:mx-0">
              Get one-on-one guidance with our <span className="font-semibold">Senior Expert</span>. Learn how our proven strategies can help you achieve your goals with confidence.
            </p>

            {/* Benefit strip */}
            <ul className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Tailored roadmap
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Quick scheduling
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Business-friendly
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Globe className="w-4 h-4 text-primary" /> Global coverage
              </li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 pt-2">
              What you’ll get on the call
            </h3>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition focus-within:ring-2 focus-within:ring-primary/40"
                >
                  <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 relative shadow-inner overflow-hidden">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent opacity-70" />
                    {item.icon}
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-[15px] sm:text-base leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/80"
                aria-label="Book your consultation"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Your Consultation</span>
              </Link>
              <a
                href="/insights"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-2xl bg-white/70 dark:bg-white/10 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700 hover:bg-white/90 dark:hover:bg-white/15 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
              >
                Learn more
              </a>
            </div>

            {/* Social proof badges (optional, pure SVG placeholders) */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Avg. response: &lt; 24h
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                10k+ consultations
              </span>
            </div>
          </div>

          {/* RIGHT CONTENT - VIDEO */}
          <div className="relative order-first md:order-none rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-auto md:h-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            {/* Subtle border gloss */}
            <div aria-hidden className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-tr from-white/40 via-white/10 to-transparent" />

            {/* Video */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/personal/video/poster.jpg"
            >
              <source src="/images/personal/video/sample.mp4" type="video/mp4" />
              Your browser does not support video.
            </video>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              {/* Mini info pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 text-white text-xs backdrop-blur">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Preview: Expert introduction
              </div>

              <button
                onClick={toggleVideo}
                className="ml-auto inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 shadow-lg backdrop-blur hover:scale-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70"
                aria-pressed={!isPlaying}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
              </button>
            </div>

            {/* Corner badge */}
            <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-200 shadow">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Verified Expert
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
