"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress({
  targetId = "article-content",
}: {
  targetId?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const el = document.getElementById(targetId);
      if (!el) {
        setProgress(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const height = el.scrollHeight;
      const scrolled = Math.min(Math.max(window.scrollY - top, 0), height);
      const pct = Math.round((scrolled / Math.max(height, 1)) * 100);
      setProgress(pct);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-0 h-1 bg-transparent z-40"
    >
      <div
        className="h-full bg-black dark:bg-white transition-[width]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
