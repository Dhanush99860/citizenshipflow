"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  Globe,
  ShieldCheck,
  Sparkles,
  Award,
  Play,
  Pause,
} from "lucide-react";

/**
 * AboutSection (updated)
 * - If a VIDEO is provided → always render in LANDSCAPE (16:9), native controls enabled.
 * - If NO video → render IMAGE in PORTRAIT (4:5) on ALL breakpoints.
 * - Keeps rounded card, gloss overlay, and verified badge.
 * - Respects reduced motion (no autoplay).
 */

export default function AboutSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 👉 Set your sources
  const imageSrc = "/images/avtar/varun-singh-md-xiphias.jpg"; // portrait image
  const videoSrc = ""; // e.g. "/images/personal/video/sample.mp4" (leave empty to force image)

  const hasVideo = Boolean(videoSrc); // video takes priority when present

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Respect reduced motion (don’t autoplay)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!videoRef.current) return;
    if (mq.matches) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const highlights = [
    {
      icon: <Award className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          Over <span className="font-semibold">15&nbsp;years of leadership</span>
        </>
      ),
    },
    {
      icon: <User className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          Certified <span className="font-semibold">IMC professional</span>
        </>
      ),
    },
    {
      icon: <Globe className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          <span className="font-semibold">10,000+ clients</span> empowered
        </>
      ),
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary relative z-10" />,
      text: (
        <>
          Multiple <span className="font-semibold">industry awards</span>
        </>
      ),
    },
  ];

  return (
    <section
      className="relative w-full py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
      aria-labelledby="about-title"
    >
      {/* Decorative background mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
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
              Certified IMC – Trusted Advisor
            </div>

            <h2
              id="about-title"
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Meet{" "}
              <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                Varun&nbsp;Singh
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto md:mx-0">
              A visionary leader and certified investment migration consultant,
              Varun founded XIPHIAS in 2009 and has since dedicated his career
              to helping entrepreneurs, investors and families worldwide become
              global citizens. His mission: turn your dreams of international
              opportunity into reality.
            </p>

            <ul className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Mission-driven
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <User className="w-4 h-4 text-primary" /> Client-focused
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Globe className="w-4 h-4 text-primary" /> Global perspective
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Ethical practice
              </li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 pt-2">
              Credentials & Impact
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition"
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

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/80"
                aria-label="Reserve your consultation"
              >
                <Calendar className="w-5 h-5" />
                <span>Reserve Your Consultation</span>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-2xl bg-white/70 dark:bg-white/10 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700 hover:bg-white/90 dark:hover:bg-white/15 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
              >
                Explore his insights
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Trusted by 10k+ clients
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                15+ years of excellence
              </span>
            </div>
          </div>

          {/* RIGHT CONTENT — Media
              - Image: always portrait (4:5) -> no crop surprises
              - Video: always landscape (16:9) with native controls
          */}
          <div
            className={`relative order-first md:order-none rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 ${
              hasVideo ? "aspect-[16/9]" : "aspect-[4/5]"
            }`}
          >
            {/* Subtle gloss */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-tr from-white/40 via-white/10 to-transparent"
            />

            {/* Media */}
            {hasVideo ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                poster={imageSrc || undefined}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support video.
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="Varun Singh portrait"
                className="absolute inset-0 w-full h-full object-cover object-[50%_20%]"
              />
            )}

            {/* Play/Pause helper (optional; native controls already shown for video) */}
            {hasVideo && (
              <button
                onClick={toggleVideo}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 shadow-lg backdrop-blur hover:scale-[1.02] transition"
                aria-pressed={isPlaying}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
              </button>
            )}

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
