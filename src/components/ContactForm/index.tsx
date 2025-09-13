"use client";

import React, { useId, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import { FiMail, FiUser, FiPhone, FiMessageSquare } from "react-icons/fi";

/**
 * ContactForm — reusable, attractive, “primary”-themed contact/callback form
 * ----------------------------------------------------------------------------
 * • Variants: "full" (name/phone/email/message) or "quick" (name/phone)
 * • Strong primary color accents (uses your Tailwind `primary` color)
 * • Polished UX: floating labels, inline validation, character counter,
 *   responsive 2-column layout on md+, non-jumpy focus rings, toast feedback
 * • A11y: labeled fields, aria-invalid, aria-live, keyboard-friendly
 * • SEO: ContactPage JSON-LD
 */

type Props = {
  variant?: "full" | "quick";
  className?: string;
  heading?: string;
  subheading?: string;
  defaults?: Partial<Record<"name" | "phone" | "email" | "message", string>>;
  onSuccess?: () => void;
};

export default function ContactForm({
  variant = "full",
  className = "",
  heading,
  subheading,
  defaults,
  onSuccess,
}: Props) {
  const isFull = variant === "full";
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [msgLen, setMsgLen] = useState(defaults?.message?.length ?? 0);
  const formRef = useRef<HTMLFormElement | null>(null);

  // a11y ids
  const baseId = useId();
  const titleId = `${baseId}-title`;

  // helpers to read values
  const get = (name: string) =>
    (formRef.current?.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null)?.value || "";

  // simple validators
  const vName = (s: string) => s.trim().length >= 2;
  const vPhone = (s: string) => /^[0-9+()\-\s]{7,}$/.test(s.trim());
  const vEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(s.trim());
  const vMsg = (s: string) => (isFull ? s.trim().length >= 10 : true);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const name = get("name");
    const phone = get("phone");
    const email = get("email");
    const message = get("message");

    if (touched.name && !vName(name)) e.name = "Please enter at least 2 characters.";
    if (touched.phone && !vPhone(phone))
      e.phone = "Enter a valid phone number (digits, +, -, () allowed).";
    if (isFull && touched.email && !vEmail(email)) e.email = "Enter a valid email.";
    if (isFull && touched.message && !vMsg(message))
      e.message = "Please add at least 10 characters.";
    return e;
  }, [touched, isFull]);

  function markTouched(name: string) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;

    // Honeypot
    if ((f.elements.namedItem("company") as HTMLInputElement)?.value) return;

    const payload = Object.fromEntries(new FormData(f).entries());
    const n = String(payload.name || "");
    const p = String(payload.phone || "");
    const em = String(payload.email || "");
    const m = String(payload.message || "");

    if (!vName(n) || !vPhone(p) || (isFull && !vEmail(em)) || !vMsg(m)) {
      setTouched({ name: true, phone: true, email: true, message: true });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          variant,
          page: typeof window !== "undefined" ? window.location.pathname : "",
          referrer:
            typeof document !== "undefined" ? document.referrer || "" : "",
        }),
      });
      if (!res.ok) throw new Error("Failed to send message.");
      toast.success(
        isFull
          ? "Your message has been sent. We’ll be in touch soon."
          : "Callback request received. We’ll call you shortly."
      );
      onSuccess?.();
      f.reset();
      setTouched({});
      setMsgLen(0);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const title =
    heading ??
    (isFull
      ? "Book a FREE consultation"
      : "Request a quick callback");
  const desc =
    subheading ??
    (isFull
      ? "Tell us a bit about your case. An advisor will respond within 24 hours."
      : "Share your name and phone — we’ll call you back soon.");

  return (
    <section
      className={[
        "relative w-full max-w-xl mx-auto",
        "rounded-2xl bg-white dark:bg-neutral-950",
        "ring-1 ring-neutral-200 dark:ring-neutral-800 shadow-sm",
        "p-5 sm:p-6",
        className,
      ].join(" ")}
      aria-labelledby={titleId}
    >
      <CardBG />

      {/* header */}
      <header className="relative">
        <div className="inline-flex items-center gap-2 text-[12px] text-primary">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-semibold">Get in touch</span>
        </div>
        <h2
          id={titleId}
          className="mt-2 text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-50"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {desc}
        </p>
      </header>

      {/* form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="relative mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Honeypot */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <Field
          name="name"
          label="Full name"
          icon={<FiUser />}
          placeholder="Jane Doe"
          defaultValue={defaults?.name}
          onBlur={() => markTouched("name")}
          invalid={!!errors.name}
          help={errors.name}
          required
        />

        <Field
          name="phone"
          label="Phone number"
          icon={<FiPhone />}
          placeholder="+1 555 555 5555"
          defaultValue={defaults?.phone}
          onBlur={() => markTouched("phone")}
          invalid={!!errors.phone}
          help={errors.phone || "Digits, +, -, () are ok."}
          required
          inputMode="tel"
          pattern="[0-9+\-\(\)\s]{7,}"
        />

        {isFull && (
          <Field
            name="email"
            label="Email address"
            icon={<FiMail />}
            placeholder="you@example.com"
            defaultValue={defaults?.email}
            onBlur={() => markTouched("email")}
            invalid={!!errors.email}
            help={errors.email}
            required
            type="email"
            className="md:col-span-2"
          />
        )}

        {isFull && (
          <Textarea
            name="message"
            label="Your message"
            icon={<FiMessageSquare />}
            placeholder="Share a few details about your situation…"
            defaultValue={defaults?.message}
            onBlur={() => markTouched("message")}
            onInput={(n) => setMsgLen(n)}
            invalid={!!errors.message}
            help={errors.message || `${msgLen}/1000`}
            rows={5}
            required
            className="md:col-span-2"
          />
        )}

        {isFull && (
          <label className="md:col-span-2 flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-primary focus:ring-2 focus:ring-primary"
            />
            I agree to be contacted about my inquiry. We never sell your data.
          </label>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={[
              "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold",
              "bg-primary text-white hover:brightness-110",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "transition-all",
            ].join(" ")}
            aria-live="polite"
          >
            {loading ? <Loader /> : isFull ? "Send message" : "Request callback"}
          </button>
          <p className="mt-2 text-[12px] text-neutral-600 dark:text-neutral-400">
            We respond within one business day. By submitting, you accept our{" "}
            <a href="/privacy" className="underline text-primary">
              privacy policy
            </a>
            .
          </p>
        </div>
      </form>

      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact / Consultation",
            description:
              "Get in touch for an immigration consultation or request a callback.",
          }),
        }}
      />
    </section>
  );
}

/* ====================== Sub-components ====================== */

function Field({
  name,
  label,
  icon,
  placeholder,
  help,
  invalid,
  required,
  defaultValue,
  type = "text",
  className = "",
  inputMode,
  pattern,
  onBlur,
}: {
  name: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  help?: string;
  invalid?: boolean;
  required?: boolean;
  defaultValue?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  onBlur?: () => void;
}) {
  const id = useId();
  return (
    <div className={["relative", className].join(" ")}>
      <div className="relative">
        {icon ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        {/* floating label pattern */}
        <input
          id={id}
          name={name}
          type={type}
          placeholder=" "
          aria-invalid={invalid || undefined}
          required={required}
          defaultValue={defaultValue}
          inputMode={inputMode}
          pattern={pattern}
          onBlur={onBlur}
          className={[
            "peer w-full rounded-xl bg-white dark:bg-neutral-950",
            "ring-1 ring-neutral-300 dark:ring-neutral-700",
            "px-10 py-3 text-sm text-neutral-900 dark:text-neutral-50",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            invalid ? "ring-red-400 focus:ring-red-500" : "",
          ].join(" ")}
        />
        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute left-10 top-1/2 -translate-y-1/2",
            "bg-transparent px-1 text-sm text-neutral-500 dark:text-neutral-400",
            "transition-all",
            "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:text-primary",
            "peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[12px]",
          ].join(" ")}
        >
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      </div>
      {help ? (
        <p
          className={[
            "mt-1 text-[12px]",
            invalid ? "text-red-600 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400",
          ].join(" ")}
          role={invalid ? "alert" : undefined}
        >
          {help}
        </p>
      ) : null}
    </div>
  );
}

function Textarea({
  name,
  label,
  icon,
  placeholder,
  help,
  invalid,
  required,
  defaultValue,
  rows = 5,
  className = "",
  onBlur,
  onInput,
}: {
  name: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  help?: string;
  invalid?: boolean;
  required?: boolean;
  defaultValue?: string;
  rows?: number;
  className?: string;
  onBlur?: () => void;
  onInput?: (length: number) => void;
}) {
  const id = useId();
  return (
    <div className={["relative", className].join(" ")}>
      <div className="relative">
        {icon ? (
          <span
            className="pointer-events-none absolute left-3 top-3 text-neutral-400 dark:text-neutral-500"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <textarea
          id={id}
          name={name}
          placeholder=" "
          aria-invalid={invalid || undefined}
          required={required}
          defaultValue={defaultValue}
          rows={rows}
          onBlur={onBlur}
          onInput={(e) => onInput?.((e.target as HTMLTextAreaElement).value.length)}
          className={[
            "peer w-full rounded-xl bg-white dark:bg-neutral-950",
            "ring-1 ring-neutral-300 dark:ring-neutral-700",
            "px-10 py-3 text-sm text-neutral-900 dark:text-neutral-50",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            "resize-y",
            invalid ? "ring-red-400 focus:ring-red-500" : "",
          ].join(" ")}
        />
        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute left-10 top-3",
            "bg-transparent px-1 text-sm text-neutral-500 dark:text-neutral-400",
            "transition-all",
            "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:text-primary",
            "peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[12px]",
          ].join(" ")}
        >
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      </div>
      {help ? (
        <p
          className={[
            "mt-1 text-[12px]",
            invalid ? "text-red-600 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400",
          ].join(" ")}
          role={invalid ? "alert" : undefined}
        >
          {help}
        </p>
      ) : null}
    </div>
  );
}

/* subtle decorative background with primary tint */
function CardBG() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-10 -left-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.04] dark:opacity-[0.07]">
        <defs>
          <pattern id="grid-cf" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-cf)" className="text-primary" />
      </svg>
    </div>
  );
}
