"use client";

import * as React from "react";
import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, PhoneCall, BookOpen, X } from "lucide-react";
import ContactForm from "@/components/ContactForm"; // ✅ reuse your existing form
import {
  CONTACT_API_ENDPOINT,
  CONTACT_SUCCESS_REDIRECT,
} from "@/lib/contactConfig"

/**
 * BottomContactBar — floating, app-like quick navigation & connect bar
 * -------------------------------------------------------------------
 * • Always-on floating dock at the bottom on mobile (can optionally show on desktop)
 * • Actions: Home, Quick Connect (opens bottom sheet with ContactForm "quick"), Guide
 * • Uses the SAME backend endpoint as your main ContactForm (configured in contactConfig.ts)
 * • Safe-area padding for iOS, strong a11y, smooth Framer Motion animations
 *
 * How to use globally (App Router):
 * - Add <BottomContactBar /> inside your root layout (e.g., src/app/layout.tsx)
 *   so it appears on every page.
 */

type Props = {
  homeHref?: string;           // default: "/"
  guideHref?: string;          // default: "/guide"
  showOnDesktop?: boolean;     // default: false (mobile-first)
  apiEndpoint?: string;        // override if needed, otherwise uses CONTACT_API_ENDPOINT
  onSuccessRedirect?: string;  // optional redirect after quick submit
  className?: string;
};

const BottomContactBar: React.FC<Props> = ({
  homeHref = "/",
  guideHref = "/guide",
  showOnDesktop = false,
  apiEndpoint,
  onSuccessRedirect,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const sheetId = useId();

  // Single source for API wiring
  const endpoint = apiEndpoint ?? CONTACT_API_ENDPOINT;
  const successPath = onSuccessRedirect ?? CONTACT_SUCCESS_REDIRECT;

  // Responsive visibility
  const visibility = showOnDesktop ? "" : "lg:hidden";

  return (
    <>
      {/* Floating Dock */}
      <motion.nav
        initial={{ y: 72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={[
          "fixed inset-x-0 bottom-2 z-[60] px-3 pb-[calc(env(safe-area-inset-bottom,0)+0.25rem)]",
          visibility,
          className,
        ].join(" ")}
        aria-label="Quick navigation"
      >
        <div
          className={[
            "mx-auto max-w-md",
            "rounded-2xl bg-white/95 dark:bg-neutral-950/90 backdrop-blur",
            "ring-1 ring-neutral-200 dark:ring-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
          ].join(" ")}
        >
          <div className="grid grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-800">

              {/* Guide */}
              <Link
              href={guideHref}
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              aria-label="Open Guide"
            >
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              <span>Guide</span>
            </Link>

            {/* Home */}
            <Link
              href={homeHref}
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              aria-label="Go to Home"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              <span>Home</span>
            </Link>

            {/* Quick Connect (opens bottom sheet) */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition"
              aria-haspopup="dialog"
              aria-controls={sheetId}
              aria-expanded={open}
            >
              <PhoneCall className="h-5 w-5" aria-hidden="true" />
              <span>Quick connect</span>
            </button>

          </div>
        </div>
      </motion.nav>

      {/* Bottom Sheet with ContactForm (variant="quick") */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Close quick connect"
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              id={sheetId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${sheetId}-title`}
              className="fixed inset-x-0 bottom-0 z-[80] mx-auto w-full max-w-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            >
              <div className="m-3 rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800 p-4">
                {/* Header / Handle */}
                <div className="flex items-center justify-between">
                  <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <button
                    type="button"
                    className="p-2 -mr-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <h2 id={`${sheetId}-title`} className="sr-only">
                  Request a quick callback
                </h2>

                {/* ✅ Reuse the SAME form (no changes to its file) */}
                <ContactForm
                  variant="quick"
                  apiEndpoint={endpoint}                // single place to configure
                  onSuccessRedirect={successPath}      // (optional)
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomContactBar;
