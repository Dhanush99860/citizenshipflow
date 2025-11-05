"use client";


import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookingFlowContext } from "./useBookingFlow";
import BookingModal from "./BookingModal";
import type { BookingPlan } from "./types";
import { getLocalTimezone } from "./utils/time";

type Props = { children: React.ReactNode };

export default function BookingFlowProvider({ children }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [initialPlan, setInitialPlan] = useState<BookingPlan | undefined>();

  const open = useCallback((args?: { plan?: BookingPlan }) => {
    setInitialPlan(args?.plan);
    setOpenModal(true);
  }, []);

  const close = useCallback(() => setOpenModal(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  /* --- auto-open if the URL has ?book=... or #book --- */
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const openedFromUrl = useRef(false);

  useEffect(() => {
    if (openedFromUrl.current) return;

    const param =
      sp?.get("book") ||
      (typeof window !== "undefined" &&
      window.location.hash.startsWith("#book")
        ? window.location.hash.replace("#", "").split("=")[1] ?? "1"
        : null);

    if (param != null) {
      const plan: BookingPlan = param === "paid" ? "paid" : "free";
      openedFromUrl.current = true;
      open({ plan });

      // Clean the URL (remove ?book=... / #book) without scrolling or reload
      const url = new URL(window.location.href);
      url.searchParams.delete("book");
      url.hash = "";
      router.replace(
        url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""),
        { scroll: false }
      );
    }
  }, [sp, open, router, pathname]);

  // Resolve the user's timezone once per mount
  const defaultTimezone = useMemo(() => getLocalTimezone(), []);

  return (
    <BookingFlowContext.Provider value={value}>
      {children}

      {openModal && (
        <BookingModal
          onCloseAction={close}
          initialPlan={initialPlan}
          defaultTimezone={defaultTimezone}
        />
      )}
    </BookingFlowContext.Provider>
  );
}

