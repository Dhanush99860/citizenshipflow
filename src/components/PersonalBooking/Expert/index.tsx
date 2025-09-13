"use client";

import { useState } from "react";
import { CheckCircle, Calendar, User, Briefcase, Globe } from "lucide-react";

export default function ExpertBooking() {
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = () => {
    const video = document.getElementById("expert-video") as HTMLVideoElement;
    if (video) {
      if (isPlaying) video.pause();
      else video.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative w-full py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Glossy background overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gloss-paper.png')] opacity-10 dark:opacity-20"></div>

      <div className="relative max-w-7xl w-full mx-auto py-20 px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
            Schedule a Personal{" "}
            <span className="bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text text-transparent">Consultation</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg">
            Get one-on-one guidance with our{" "}
            <span className="font-semibold">Senior Expert</span>. Learn how our proven
            strategies can help you achieve your goals with confidence.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            What you’ll get on the call:
          </h3>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-white relative z-10" />
                ),
                text: <>Direct call with <span className="font-semibold">MD / Senior Consultant</span></>,
              },
              {
                icon: (
                  <User className="w-5 h-5 text-blue-600 dark:text-white relative z-10" />
                ),
                text: <>Personalized strategy built for <span className="font-semibold">your profile</span></>,
              },
              {
                icon: (
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-white relative z-10" />
                ),
                text: <>In-depth review of <span className="font-semibold">opportunities & programs</span></>,
              },
              {
                icon: (
                  <Globe className="w-5 h-5 text-blue-600 dark:text-white relative z-10" />
                ),
                text: <>Access to <span className="font-semibold">global expertise</span> & legal clarity</>,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition"
              >
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-700 border-2 border-blue-100 dark:border-slate-600 relative shadow-inner overflow-hidden transition duration-300 hover:ring-2 hover:ring-primary/60">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent opacity-70" />
                  {item.icon}
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-[15px] sm:text-base leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg hover:bg-primary dark:hover:bg-blue-500 transition">
            <Calendar className="w-5 h-5" /> Book Your Consultation
          </button>
        </div>

        {/* RIGHT CONTENT - VIDEO */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-auto md:h-full border-[6px] border-blue-50">

          {/* Glossy Border Effect */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none border-[6px] border-blue-100 bg-gradient-to-tr from-white/40 via-white/10 to-transparent backdrop-blur-2xl" />

          <video
            id="expert-video"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/default-article.jpg.JPG"
          >
            <source src="/images/personal/video/sample.mp4" type="video/mp4" />
            Your browser does not support video.
          </video>

          {/* Play/Pause Button */}
          <button
            onClick={toggleVideo}
            className="absolute bottom-5 right-5 bg-white/90 dark:bg-slate-800/90 rounded-full p-3 shadow-lg backdrop-blur hover:scale-105 transition"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-5.197-3.027A1 1 0 008 9.027v5.946a1 1 0 001.555.832l5.197-3.027a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
