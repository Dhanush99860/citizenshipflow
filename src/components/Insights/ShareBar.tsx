// FILE: src/components/Insights/ShareBar.tsx
"use client";

import { useCallback, useState } from "react";

type ShareBarProps = { title: string; url: string };

export default function ShareBar({ title, url }: ShareBarProps) {
  const [status, setStatus] = useState<string>("");

  const share = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setStatus("Shared!");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("Link copied to clipboard");
      }
      setTimeout(() => setStatus(""), 1500);
    } catch {
      // user canceled — no-op
    }
  }, [title, url]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const items = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={share}
        className="px-3 py-1.5 rounded-full bg-primary-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
        aria-label="Share this page"
      >
        Share
      </button>

      <div className="flex items-center gap-2 text-sm">
        {items.map((it) => (
          <a
            key={it.name}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 rounded"
            aria-label={`Share on ${it.name}`}
          >
            {it.name}
          </a>
        ))}
      </div>

      {/* Announce feedback to screen readers without alerts */}
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
