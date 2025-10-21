"use client";

import { useState } from "react";

export default function QuickApplyForm({ defaultRole }: { defaultRole?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_BYTES = 5 * 1024 * 1024; // 5MB

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) {
      setFileError("Please attach your resume (PDF, DOC, or DOCX).");
      return;
    }
    const okType =
      /pdf|msword|officedocument/.test(f.type) || /\.(pdf|docx?|PDF|DOCX?)$/.test(f.name);
    if (!okType) {
      setFileError("Use PDF, DOC, or DOCX files only.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError("Max file size is 5MB.");
      return;
    }
    setFileError(null);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (fileError) {
      e.preventDefault();
      return;
    }
    setSubmitting(true); // allow browser to submit the form normally
  }

  return (
    <form
      action="/api/apply"
      method="post"
      encType="multipart/form-data"
      onSubmit={onSubmit}
      className="grid gap-4 text-black dark:text-white"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Full name</label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm placeholder-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/20 dark:bg-transparent dark:placeholder-white"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm placeholder-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/20 dark:bg-transparent dark:placeholder-white"
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className="block text-sm font-medium">Role (optional)</label>
          <input
            id="role"
            name="role"
            defaultValue={defaultRole}
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm placeholder-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/20 dark:bg-transparent dark:placeholder-white"
            placeholder="e.g., Corporate Immigration Specialist"
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn (optional)</label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm placeholder-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/20 dark:bg-transparent dark:placeholder-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium">Resume / CV</label>
        <input
          id="resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          aria-describedby="resume-help resume-error"
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700"
        />
        <p id="resume-help" className="mt-1 text-xs">
          Accepted: PDF, DOC, DOCX. Max 5MB.
        </p>
        {fileError && (
          <p id="resume-error" role="alert" className="mt-1 text-xs font-semibold">
            {fileError}
          </p>
        )}
      </div>

      {/* spam honeypot */}
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || !!fileError}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
        <p className="text-xs">We usually respond within 1–2 weeks.</p>
      </div>

      <p className="mt-1 text-[11px] opacity-80">
        By submitting, you agree that we may store and process your data for recruitment purposes in accordance with our privacy policy.
      </p>
    </form>
  );
}
