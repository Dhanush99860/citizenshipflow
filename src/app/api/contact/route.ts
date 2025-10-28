// Always run in Node (required if/when you later enable Nodemailer)
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";

// ✅ This route never throws to the frontend (always 200).
// ✅ If Email/WhatsApp envs are missing, it SKIPS those sends.
// ✅ Uses non-literal dynamic import for "nodemailer" so TS won't require it.

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  try {
    const body = await req.json().catch(() => ({} as any));

    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const variant = String(body?.variant ?? "contact");
    const page = String(body?.page ?? "");
    const referrer = String(body?.referrer ?? "");
    const consent = String(body?.consent ?? "");

    // Basic guard (still returns 200, just skips)
    if (!name || !phone) {
      return NextResponse.json(
        {
          ok: true,
          warning: "missing required fields (name/phone) – accepted and skipped",
          email: "skipped",
          whatsapp: "skipped",
        },
        { status: 200 }
      );
    }

    // ---------- EMAIL (optional) ----------
    let emailStatus: "sent" | "skipped" | "failed" = "skipped";
    const hasEmailCfg =
      !!process.env.SMTP_HOST &&
      !!process.env.EMAIL_FROM &&
      !!process.env.EMAIL_TO;

    if (hasEmailCfg) {
      try {
        // ⬇️ Non-literal dynamic import avoids TS2307 when nodemailer isn't installed
        const pkgName: string = "nodemailer";
        const nodemailerMod: any = await import(pkgName);
        const nodemailer = nodemailerMod.default ?? nodemailerMod;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT || 587) === 465, // implicit TLS on 465
          auth: process.env.SMTP_USER
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
        });

        const subject = `New enquiry (${variant}) — ${name}`;
        const html = `
          <h2>New enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
          ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message)}</p>` : ""}
          <hr/>
          <p><strong>Consent:</strong> ${consent ? "Yes" : "No"}</p>
          ${page ? `<p><strong>Page:</strong> ${escapeHtml(page)}</p>` : ""}
          ${referrer ? `<p><strong>Referrer:</strong> ${escapeHtml(referrer)}</p>` : ""}
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM!,
          to: process.env.EMAIL_TO!,
          subject,
          html,
        });

        emailStatus = "sent";
      } catch {
        // nodemailer not installed or SMTP error → keep UI happy
        emailStatus = "failed";
      }
    }

    // ---------- WHATSAPP (optional, Meta Cloud API) ----------
    let whatsappStatus: "sent" | "skipped" | "failed" = "skipped";
    const hasWaCfg =
      !!process.env.META_WABA_TOKEN &&
      !!process.env.META_WABA_PHONE_NUMBER_ID &&
      !!process.env.WHATSAPP_TO;

    if (hasWaCfg) {
      try {
        const url = `https://graph.facebook.com/v20.0/${process.env.META_WABA_PHONE_NUMBER_ID}/messages`;

        const bodyJson = {
          messaging_product: "whatsapp",
          to: normalizePhone(process.env.WHATSAPP_TO!),
          type: "text",
          text: {
            body:
              `New enquiry (${variant})\n` +
              `Name: ${name}\n` +
              `Phone: ${phone}${email ? `\nEmail: ${email}` : ""}${
                message ? `\nMessage: ${message}` : ""
              }` +
              (page ? `\nPage: ${page}` : "") +
              (referrer ? `\nRef: ${referrer}` : ""),
          },
        };

        const r = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.META_WABA_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyJson),
        });

        whatsappStatus = r.ok ? "sent" : "failed";
      } catch {
        whatsappStatus = "failed";
      }
    }

    return NextResponse.json(
      { ok: true, email: emailStatus, whatsapp: whatsappStatus, tookMs: Date.now() - t0 },
      { status: 200 }
    );
  } catch {
    // Final safety net: never fail the client
    return NextResponse.json({ ok: true, email: "skipped", whatsapp: "skipped" }, { status: 200 });
  }
}

/* --------- helpers --------- */
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizePhone(s: string) {
  // WhatsApp Cloud API expects MSISDN digits only
  return s.replace(/[^\d]/g, "");
}
