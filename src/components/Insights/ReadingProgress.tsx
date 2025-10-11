"use client";

import { useEffect, useRef, useState } from "react";

export default function ReadingProgress() {
  // animated (displayed) progress 0..100
  const [animPct, setAnimPct] = useState(0);
  // target progress (instant)
  const targetPctRef = useRef(0);
  // rAF handle
  const rafRef = useRef<number | null>(null);
  // message state
  const [toast, setToast] = useState<string | null>(null);
  const lastMilestoneRef = useRef<number>(0);

  // find the best reading root automatically
  function resolveRoot(): HTMLElement | null {
    return (
      document.getElementById("article-content") ||
      document.querySelector("main article") ||
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.documentElement
    );
  }

  // compute target progress based on the element
  const measure = () => {
    const el = resolveRoot();
    if (!el) {
      targetPctRef.current = 0;
      return;
    }

    const rect = el.getBoundingClientRect();
    const startY = window.scrollY + rect.top;
    const endY = startY + el.scrollHeight;

    // how much of the element can be scrolled through (avoid div by 0)
    const maxScrollable = Math.max(1, endY - window.innerHeight - 0 /* offsetTop */);
    const current = Math.min(Math.max(window.scrollY - startY, 0), maxScrollable);

    const pct = Math.round((current / maxScrollable) * 100);
    targetPctRef.current = pct;
  };

  // smooth animate toward target using lerp
  const tick = () => {
    const target = targetPctRef.current;
    const next = animPct + (target - animPct) * 0.18; // easing factor
    const clamped = Math.abs(next - target) < 0.2 ? target : next;

    setAnimPct(clamped);

    // show milestone toasts when crossing thresholds upward
    const milestones = [1, 25, 50, 75, 100];
    const last = lastMilestoneRef.current;
    for (let i = milestones.length - 1; i >= 0; i--) {
      const m = milestones[i];
      if (clamped >= m && last < m) {
        lastMilestoneRef.current = m;
        showToast(m);
        break;
      }
    }

    if (Math.abs(clamped - target) > 0.1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setAnimPct(target);
      rafRef.current = null;
    }
  };

  const showToast = (m: number) => {
    const msg =
      m === 1
        ? "Nice start 👏"
        : m === 25
        ? "Good momentum 💪"
        : m === 50
        ? "Halfway there 🔥"
        : m === 75
        ? "Almost done 🙌"
        : "Finished! 🎉";
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 1400);
  };

  useEffect(() => {
    // initial measurement
    measure();

    const onScroll = () => {
      // update target quickly and start animation loop if needed
      measure();
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    // first paint nudge
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no props — one-line import API

  // accessibility (live value)
  const aNow = Math.round(animPct);

  // placement
  const fixedPos = "fixed left-0 right-0 top-0"; // change to bottom-0 if you prefer

  return (
    <div className={`${fixedPos} z-50 pointer-events-none`} aria-hidden="true">
      {/* Track: set text color so the bar can use currentColor (bw only) */}
      <div
        className="
          mx-auto w-full
          h-[3px] md:h-[4px]
          text-black dark:text-white
          bg-transparent
          shadow-[0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.15)]
        "
      >
        {/* Bar: GPU-friendly transform for ultra-smooth motion */}
        <div
          className="
            h-full origin-left will-change-transform
            [transition:transform_120ms_linear]
            md:[transition:transform_100ms_linear]
            rounded-r
          "
          style={{
            transform: `translateZ(0) scaleX(${Math.max(0, Math.min(1, animPct / 100))})`,
            background: "currentColor",
          }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={aNow}
          aria-label="Reading progress"
        />
      </div>

      {/* Tiny end cap (subtle “spark” for motivation) */}
      <div
        className="absolute top-1 md:top-1.5 h-2 w-2 rounded-full bg-black dark:bg-white shadow-sm"
        style={{
          left: `calc(${animPct}% - 4px)`,
          opacity: animPct > 0 && animPct < 100 ? 1 : 0,
          transition: "left 120ms linear, opacity 200ms ease",
        }}
      />

      {/* Toast (brief motivational nudge) */}
      <div
        className={`
          absolute right-3 top-3 md:top-2
          px-3 py-1.5 rounded-full text-xs md:text-sm font-medium
          bg-black text-white dark:bg-white dark:text-black
          shadow-sm select-none
          transition
          ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
        style={{ pointerEvents: "none" }}
        aria-live="polite"
      >
        {toast || ""}
      </div>

      {/* Respect reduced motion: drop transitions */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .origin-left {
            transition: none !important;
          }
          .transition {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
