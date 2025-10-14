// src/app/api/eligibility/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateSubmission } from "@/utils/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never cache this route

/* ------------------------------- config ------------------------------- */

const ALLOWED_TRACKS = new Set(["residency", "citizenship", "corporate", "skilled"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{6,20}$/;

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 8;            // max submissions / IP / minute
const MAX_JSON_KB = 64;              // basic body-size guard

// In-memory rate limit bucket (best effort; fine for MVP; single-node only)
const rlBucket: Map<string, number[]> =
  (global as any).__eligibilityRL__ ?? new Map<string, number[]>();
(global as any).__eligibilityRL__ = rlBucket;

/* ------------------------------- helpers ------------------------------- */

function getClientIP(req: NextRequest) {
  // common proxies / platforms
  const hdr =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip");
  if (hdr) return hdr.split(",")[0].trim();
  // @ts-ignore next dev
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

function safeAnswers(input: unknown) {
  // Shallow, size-limited copy of the answers map
  if (!input || typeof input !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof k !== "string") continue;
    const key = k.replace(/[^\w.-]/g, "").slice(0, 64);
    if (!key) continue;

    if (typeof v === "string") out[key] = v.slice(0, 1000);
    else if (typeof v === "number" || typeof v === "boolean" || v === null) out[key] = v;
    else out[key] = String(v).slice(0, 200);
  }
  return out;
}

function rateLimitHit(ip: string) {
  const now = Date.now();
  const arr = rlBucket.get(ip) ?? [];
  const fresh = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  fresh.push(now);
  rlBucket.set(ip, fresh);
  return fresh.length > RATE_LIMIT_MAX;
}

function tooBig(req: NextRequest) {
  const len = req.headers.get("content-length");
  if (!len) return false;
  return Number(len) > MAX_JSON_KB * 1024;
}

/* -------------------------------- CORS -------------------------------- */

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}

/* -------------------------------- route -------------------------------- */

export async function POST(req: NextRequest) {
  try {
    if (tooBig(req)) {
      return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    }

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

    // Keep your existing validator as source of truth
    const { ok, error } = validateSubmission(body);
    if (!ok) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    // Extra server-side hardening (defense in depth)
    const name = sanitizeStr(body.name, 120);
    const email = sanitizeStr(body.email, 160).toLowerCase();
    const phone = normalizePhone(sanitizeStr(body.phone, 40));
    const track = String(body.track || "");
    const answers = safeAnswers(body.answers);
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
      // likely bot — pretend OK
      return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
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

    // Structured log (redact email a bit)
    const redact = (e: string) => e.replace(/(.).+(@.+)/, (_m, a, b) => a + "***" + b);
    console.log("[eligibility:submit]", {
      ...payload,
      email: redact(email),
      meta: { ...payload.meta, ip: ip.replace(/\d+$/g, "x") },
    });

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (e: any) {
    console.error("[eligibility:submit:error]", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid request" },
      { status: 400, headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } }
    );
  }
}
