"use client";

import * as React from "react";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneCall, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm/index"; // ✅ reuse your existing form

const BottomActionBar = () => {
  const [open, setOpen] = useState(false);
  const sheetId = useId();

  return (
    <>
      {/* Sticky Bottom Bar (Mobile/Tablet Only) */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden 
                   shadow-[0_-6px_24px_rgba(0,0,0,0.18)] 
                   pb-[env(safe-area-inset-bottom)] 
                   bg-primary dark:bg-gray-900 text-white"
      >
        <div className="mx-auto flex w-full max-w-5xl divide-x divide-white/20">
          {/* WhatsApp */}
          <a
            href="https://wa.me/6564387117?text=Hi, I’m interested in your services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 py-3 
                       text-sm font-medium 
                       hover:bg-green-600/80 transition"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>

          {/* Quick Callback (Sheet) */}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 py-3 
                       text-sm font-medium
                       hover:bg-sky-600/80 transition"
          >
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
            <span>Callback</span>
          </button>

          {/* Direct Call */}
          <a
            href="tel:+6564387117"
            className="flex flex-1 items-center justify-center gap-2 py-3 
                       text-sm font-medium uppercase 
                       hover:bg-white/20 transition"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span>+65 6438 7117</span>
          </a>
        </div>
      </motion.nav>

      {/* Modal Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              onClick={() => setOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${sheetId}-title`}
              className="fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            >
              <div className="mx-3 mb-3 rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-4">
                {/* Handle bar (draggable style) */}
                <div
                  onClick={() => setOpen(false)}
                  className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                  aria-hidden="true"
                />

                {/* ✅ Reuse ContactForm */}
                <ContactForm variant="quick" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomActionBar;
