// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json(); // { name, phone, email, message, variant, page, referrer }
    // TODO: send email / post to CRM / Slack, etc.
    // if something fails, return error with proper status
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
