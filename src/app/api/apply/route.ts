// app/api/apply/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node for formdata parsing

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "");
  const role = String(form.get("role") || "");
  const linkedin = String(form.get("linkedin") || "");
  // const resume = form.get("resume") as File | null; // handle as needed
  // TODO: send to ATS / email / storage

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, received: { name, email, role, linkedin } });
}