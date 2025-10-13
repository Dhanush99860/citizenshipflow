import { NextRequest, NextResponse } from "next/server";
import { scoreAssessment } from "@/lib/eligibility/scoring";
import type { Track, AnswerMap } from "@/lib/eligibility/types";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/** ---------- Config (customize or set via env) ---------- */
const COMPANY_NAME =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "XIPHIAS Immigration";
const REPORT_TITLE = "Eligibility Report";

/** Optional: base64 PNG logo data URL (e.g. 'data:image/png;base64,iVBORw0…') */
const PDF_LOGO_BASE64 = process.env.PDF_LOGO_BASE64 || "";

/** Footer line: address • email • phone • website (in that order) */
const FOOTER_ADDRESS =
  process.env.NEXT_PUBLIC_PDF_ADDRESS ||
  "Aurbis Prime No. 1, Koramangala, Bengaluru, India 560034";
const FOOTER_EMAIL = process.env.NEXT_PUBLIC_PDF_EMAIL || "immigration@xiphias.in";
const FOOTER_PHONE = process.env.NEXT_PUBLIC_PDF_PHONE || "+91 90194 00500";
const FOOTER_WEBSITE =
  process.env.NEXT_PUBLIC_PDF_WEBSITE || "www.xiphiasimmigration.com";

/** Palette (letterhead-style with a small gold accent line; adjust as needed) */
const COLOR_TEXT = rgb(0, 0, 0);
const COLOR_MUTED = rgb(0.28, 0.28, 0.32);
const COLOR_ACCENT = rgb(0.85, 0.69, 0.15); // gold line
const COLOR_HEADER_BG = rgb(0.95, 0.97, 1); // very light blue
const COLOR_CARD_BORDER = rgb(0.75, 0.75, 0.78);

/** Layout */
const PAGE_SIZE: [number, number] = [595.28, 841.89]; // A4
const MARGIN_X = 56; // left/right
const HEADER_HEIGHT = 76;
const FOOTER_HEIGHT = 64; // includes divider + footer text
const LINE = 14; // content line height
const TITLE_SIZE = 16;
const H1_SIZE = 20;
const H2_SIZE = 12;
const TEXT_SIZE = 10;

/** ---------- Utilities ---------- */

function titleCase(k: string) {
  return k
    .replace(/[_\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toStr(v: unknown): string {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v == null) return "-";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Split text to fit width using font metrics */
function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  size: number
): string[] {
  const words = String(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Optional logo embeddder */
async function embedLogo(pdf: PDFDocument) {
  if (!PDF_LOGO_BASE64 || !PDF_LOGO_BASE64.includes("base64")) return null;
  const base64 = PDF_LOGO_BASE64.split(",").pop()!;
  const bytes = Buffer.from(base64, "base64");
  try {
    return await pdf.embedPng(bytes);
  } catch {
    return null;
  }
}

/** Draw page header, returns the starting y for content */
function drawHeader(
  page: any,
  fonts: { regular: any; bold: any },
  logo: any | null
) {
  const { height, width } = page.getSize();
  // header background band (very subtle)
  page.drawRectangle({
    x: 0,
    y: height - HEADER_HEIGHT,
    width,
    height: HEADER_HEIGHT,
    color: COLOR_HEADER_BG,
  });

  // optional logo (small, centered)
  if (logo) {
    const logoW = 56;
    const logoH = (logoW / logo.width) * logo.height;
    page.drawImage(logo, {
      x: MARGIN_X,
      y: height - HEADER_HEIGHT + (HEADER_HEIGHT - logoH) / 2,
      width: logoW,
      height: logoH,
    });
  }

  // Company + report title
  page.drawText(COMPANY_NAME, {
    x: MARGIN_X + (logo ? 64 : 0) + 4,
    y: height - 28,
    size: 11,
    font: fonts.regular,
    color: COLOR_MUTED,
  });

  page.drawText(REPORT_TITLE, {
    x: MARGIN_X + (logo ? 64 : 0) + 4,
    y: height - 44,
    size: H1_SIZE,
    font: fonts.bold,
    color: COLOR_TEXT,
  });

  // thin gold line
  page.drawRectangle({
    x: MARGIN_X,
    y: height - HEADER_HEIGHT - 1,
    width: width - MARGIN_X * 2,
    height: 1,
    color: COLOR_ACCENT,
  });

  return height - HEADER_HEIGHT - 18; // starting y for content
}

function drawFooter(
  page: any,
  fonts: { regular: any },
  pageNum: number,
  total: number
) {
  const { width } = page.getSize();
  const y = FOOTER_HEIGHT - 32;

  // divider
  page.drawRectangle({
    x: MARGIN_X,
    y: FOOTER_HEIGHT - 10,
    width: width - MARGIN_X * 2,
    height: 0.8,
    color: rgb(0.92, 0.92, 0.94),
  });

  // left-aligned footer info (spaced bullets)
  const footerStr = `${FOOTER_ADDRESS}  ·  ${FOOTER_EMAIL}  ·  ${FOOTER_PHONE}  ·  ${FOOTER_WEBSITE}`;
  page.drawText(footerStr, {
    x: MARGIN_X,
    y,
    size: 8.5,
    font: fonts.regular,
    color: COLOR_MUTED,
  });

  // right-aligned page number
  const pn = `Page ${pageNum} of ${total}`;
  const pnWidth = fonts.regular.widthOfTextAtSize(pn, 8.5);
  page.drawText(pn, {
    x: MARGIN_X + (width - MARGIN_X * 2) - pnWidth,
    y,
    size: 8.5,
    font: fonts.regular,
    color: COLOR_MUTED,
  });
}

function newPage(pdf: PDFDocument) {
  return pdf.addPage(PAGE_SIZE);
}

/** ---------- Main handler ---------- */
export async function POST(req: NextRequest) {
  const { name, track, answers } = (await req.json()) as {
    name: string;
    track: Track;
    answers: AnswerMap;
  };

  if (!name || !track || !answers) {
    return NextResponse.json(
      { ok: false, error: "Missing fields" },
      { status: 400 }
    );
  }

  const result = scoreAssessment(track, answers);

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await embedLogo(pdf);

  let page = newPage(pdf);
  let y = drawHeader(page, { regular, bold }, logo);
  const usableWidth = PAGE_SIZE[0] - MARGIN_X * 2;
  const colWidth = (usableWidth - 24) / 2; // for two-column blocks

  const ensureSpace = (needed: number) => {
    if (y - needed < FOOTER_HEIGHT + 24) {
      page = newPage(pdf);
      y = drawHeader(page, { regular, bold }, logo);
    }
  };

  const drawLabel = (label: string) => {
    page.drawText(label, {
      x: MARGIN_X,
      y,
      size: H2_SIZE,
      font: bold,
      color: COLOR_TEXT,
    });
    y -= LINE;
  };

  const drawTextBlock = (text: string, size = TEXT_SIZE) => {
    const lines = wrapText(text, usableWidth, regular, size);
    for (const ln of lines) {
      page.drawText(ln, { x: MARGIN_X, y, size, font: regular, color: COLOR_TEXT });
      y -= LINE;
    }
  };

  // Meta (Name/Track/Generated)
  ensureSpace(LINE * 4);
  page.drawText(`Name: ${name || "-"}`, {
    x: MARGIN_X,
    y,
    size: TEXT_SIZE,
    font: regular,
    color: COLOR_TEXT,
  });
  y -= LINE;
  page.drawText(`Track: ${track}`, {
    x: MARGIN_X,
    y,
    size: TEXT_SIZE,
    font: regular,
    color: COLOR_TEXT,
  });
  y -= LINE;
  page.drawText(`Generated: ${new Date().toLocaleString()}`, {
    x: MARGIN_X,
    y,
    size: TEXT_SIZE,
    font: regular,
    color: COLOR_TEXT,
  });
  y -= LINE;

  // Summary
  ensureSpace(LINE * 4);
  drawLabel("Summary");
  drawTextBlock(`${result.tier} — ${result.summary}`);

  // Suggested Programs (card)
  if (result.programs?.length) {
    ensureSpace(90);
    const cardX = MARGIN_X;
    const cardY = y - 70;
    const cardW = usableWidth;
    const cardH = 70;

    // border
    page.drawRectangle({
      x: cardX,
      y: cardY,
      width: cardW,
      height: cardH,
      borderColor: COLOR_CARD_BORDER,
      borderWidth: 1,
      color: rgb(1, 1, 1), // white fill
    });

    // program title
    const p0 = result.programs[0];
    page.drawText(p0?.name ?? "Suggested Program", {
      x: cardX + 10,
      y: cardY + cardH - 22,
      size: H2_SIZE,
      font: bold,
      color: COLOR_TEXT,
    });

    // reason
    const lines = wrapText(
      p0?.why ?? "Based on your profile",
      cardW - 20,
      regular,
      TEXT_SIZE
    );
    let yy = cardY + cardH - 22 - LINE;
    for (const ln of lines) {
      page.drawText(ln, {
        x: cardX + 10,
        y: yy,
        size: TEXT_SIZE,
        font: regular,
        color: COLOR_MUTED,
      });
      yy -= LINE;
    }

    y = cardY - 10;
  }

  // Your Inputs (two columns)
  ensureSpace(LINE * 6);
  drawLabel("Your Inputs");

  // Split keys half/half into two columns
  const entries = Object.entries(answers);
  const half = Math.ceil(entries.length / 2);
  const left = entries.slice(0, half);
  const right = entries.slice(half);

  const drawColumn = (items: [string, unknown][], x: number) => {
    let yCol = y;
    for (const [k, v] of items) {
      page.drawText(`${titleCase(k)}:`, {
        x,
        y: yCol,
        size: TEXT_SIZE,
        font: bold,
        color: COLOR_TEXT,
      });
      const val = toStr(v);
      const valLines = wrapText(val, colWidth - 80, regular, TEXT_SIZE); // keep label room
      let yy = yCol;
      for (const ln of valLines) {
        page.drawText(ln, {
          x: x + 80,
          y: yy,
          size: TEXT_SIZE,
          font: regular,
          color: COLOR_TEXT,
        });
        yy -= LINE;
      }
      yCol = yy - 4;
    }
    return yCol;
  };

  const yLeftEnd = drawColumn(left, MARGIN_X);
  const yRightEnd = drawColumn(right, MARGIN_X + colWidth + 24);
  y = Math.min(yLeftEnd, yRightEnd) - 8;

  // After all content is laid out, draw the footer with page numbers
  const pages = pdf.getPages();
  for (let i = 0; i < pages.length; i++) {
    drawFooter(pages[i], { regular }, i + 1, pages.length);
  }

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Eligibility_${track}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
