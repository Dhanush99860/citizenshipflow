// src/app/api/eligibility/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateSubmission } from "@/utils/validate";

export const runtime = "nodejs"; // ensure a Node runtime (for simple in-memory rate-limit)

/* ------------------------------- config ------------------------------- */

const ALLOWED_TRACKS = new Set(["residency", "citizenship", "corporate", "skilled"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{6,20}$/;

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 8;            // max submissions / IP / minute

// In-memory rate limit bucket (best effort; fine for MVP)
const rlBucket: Map<string, number[]> =
  (global as any).__eligibilityRL__ ?? new Map<string, number[]>();
(global as any).__eligibilityRL__ = rlBucket;

/* ------------------------------- helpers ------------------------------- */

function getClientIP(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  // @ts-ignore - Next has a non-standard header in dev
  return (req as any).ip || "0.0.0.0";
}

function normalizePhone(raw?: string) {
  if (!raw) return "";
  const only = raw.replace(/[^\d+]/g, "");
  return only.startsWith("+") ? only : only ? `+${only}` : "";
}

function sanitizeStr(v: unknown, max = 400) {
  if (typeof v !== "string") return "";
  return v.replace(/\s+/g, " ").trim().slice(0, max);
}

function rateLimitHit(ip: string) {
  const now = Date.now();
  const arr = rlBucket.get(ip) ?? [];
  const fresh = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  fresh.push(now);
  rlBucket.set(ip, fresh);
  return fresh.length > RATE_LIMIT_MAX;
}

/* -------------------------------- route -------------------------------- */

export async function POST(req: NextRequest) {
  try {
    // Require JSON
    const ctype = req.headers.get("content-type") || "";
    if (!ctype.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Unsupported content type" }, { status: 415 });
    }

    const ip = getClientIP(req);
    if (rateLimitHit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many submissions. Please try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();

    // First, run your existing validator (kept as source of truth)
    const { ok, error } = validateSubmission(body);
    if (!ok) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    // Extra server-side hardening (defense in depth)
    const name = sanitizeStr(body.name, 120);
    const email = sanitizeStr(body.email, 160).toLowerCase();
    const phone = normalizePhone(sanitizeStr(body.phone, 40));
    const track = String(body.track || "");
    const answers = body.answers ?? {};
    const honeypot = sanitizeStr(body.honeypot || body.website || ""); // optional hidden field

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please provide your full name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid email." }, { status: 400 });
    }
    if (phone && !PHONE_RE.test(phone)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid phone number." }, { status: 400 });
    }
    if (!ALLOWED_TRACKS.has(track)) {
      return NextResponse.json({ ok: false, error: "Invalid track." }, { status: 400 });
    }
    if (honeypot) {
      // likely bot
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Minimal normalized payload (ready for DB/CRM later)
    const payload = {
      name,
      email,
      phone,
      track,
      answers,
      meta: {
        ip,
        ua: req.headers.get("user-agent") || "",
        referer: req.headers.get("referer") || "",
        ts: new Date().toISOString(),
      },
    };

    // TODO:
    // 1) Persist `payload` to DB/CRM
    // 2) Send transactional email (thank-you + next steps)
    // 3) Optionally trigger PDF generation and email link

    // For now, structured log (one-liner in prod logs)
    console.log("[eligibility:submit]", JSON.stringify(payload));

    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (e: any) {
    console.error("[eligibility:submit:error]", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid request" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
