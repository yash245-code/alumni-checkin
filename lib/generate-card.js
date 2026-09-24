import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getRandomQuote } from '@/lib/card-quotes';

const ASSETS_DIR = path.join(process.cwd(), 'assets');

// Card canvas matches the background artwork (2:3 portrait), in PDF points.
const CARD_W = 620;
const CARD_H = 930;

const NAVY_DARK = rgb(0x0a / 255, 0x19 / 255, 0x2f / 255);
const NAVY_MID = rgb(0x16 / 255, 0x32 / 255, 0x4f / 255);
const NAVY_MUTED = rgb(0x3a / 255, 0x5a / 255, 0x80 / 255);
const GOLD_RICH = rgb(0xa3 / 255, 0x7d / 255, 0x19 / 255);
const GOLD_HAIRLINE = rgb(0xd4 / 255, 0xb2 / 255, 0x55 / 255);

function wrapText(text, font, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(trial, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = trial;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawDivider(page, y, color, span = 110) {
  const cx = CARD_W / 2;
  page.drawLine({ start: { x: cx - span, y }, end: { x: cx - 14, y }, thickness: 0.75, color });
  page.drawLine({ start: { x: cx + 14, y }, end: { x: cx + span, y }, thickness: 0.75, color });
  
  // Ornamental diamond center
  page.drawRectangle({
    x: cx - 3,
    y: y - 3,
    width: 6,
    height: 6,
    rotate: { type: 'degrees', angle: 45 },
    color,
  });
}

function drawCentered(page, text, { font, size, y, color, letterSpacing = 0 }) {
  const width = letterSpacing
    ? font.widthOfTextAtSize(text, size) + letterSpacing * (text.length - 1)
    : font.widthOfTextAtSize(text, size);
  const x = (CARD_W - width) / 2;

  if (!letterSpacing) {
    page.drawText(text, { x, y, size, font, color });
    return;
  }

  let cursor = x;
  for (const ch of text) {
    page.drawText(ch, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(ch, size) + letterSpacing;
  }
}

/**
 * Generates an elegant, spacious, wholesome alumni greeting card PDF.
 * @param {{ name: string, department: string, quote?: string }} params
 * @returns {Promise<Uint8Array>} PDF bytes
 */
export async function generateAlumniCard({ name, department, quote: customQuote }) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [serifBytes, italicBytes, capsBytes, bgBytes] = await Promise.all([
    fs.promises.readFile(path.join(ASSETS_DIR, 'fonts', 'PlayfairDisplay-Regular.ttf')),
    fs.promises.readFile(path.join(ASSETS_DIR, 'fonts', 'PlayfairDisplay-Italic.ttf')),
    fs.promises.readFile(path.join(ASSETS_DIR, 'fonts', 'Cormorant-Regular.ttf')),
    fs.promises.readFile(path.join(ASSETS_DIR, 'card', 'card-bg.png')),
  ]);

  const serifFont = await pdfDoc.embedFont(serifBytes);
  const italicFont = await pdfDoc.embedFont(italicBytes);
  const capsFont = await pdfDoc.embedFont(capsBytes);
  const bgImage = await pdfDoc.embedPng(bgBytes);

  const page = pdfDoc.addPage([CARD_W, CARD_H]);

  // Background artwork
  page.drawImage(bgImage, { x: 0, y: 0, width: CARD_W, height: CARD_H });

  const quote = customQuote || getRandomQuote();

  // ==========================================================
  // 1. TOP HEADER SECTION (Clean, spacious, uncrowded)
  // ==========================================================
  drawCentered(page, 'Abhinandan 2026', {
    font: serifFont,
    size: 26,
    y: 772,
    color: NAVY_DARK,
    letterSpacing: 1.5,
  });

  drawCentered(page, 'FRESHERS PARTY • ALUMNI HOMECOMING GREETING', {
    font: capsFont,
    size: 11,
    y: 746,
    color: GOLD_RICH,
    letterSpacing: 2.2,
  });

  drawDivider(page, 720, GOLD_HAIRLINE, 120);

  // ==========================================================
  // 2. ATTENDEE GREETING & NAME
  // ==========================================================
  drawCentered(page, 'Welcome back home,', {
    font: capsFont,
    size: 18,
    y: 672,
    color: NAVY_MUTED,
    letterSpacing: 1,
  });

  // Name — shrink to fit if long
  let nameSize = 38;
  while (serifFont.widthOfTextAtSize(name, nameSize) > CARD_W - 140 && nameSize > 24) {
    nameSize -= 2;
  }
  drawCentered(page, name, {
    font: serifFont,
    size: nameSize,
    y: 624,
    color: NAVY_DARK,
  });

  if (department) {
    drawCentered(page, department.toUpperCase(), {
      font: capsFont,
      size: 14,
      y: 588,
      color: GOLD_RICH,
      letterSpacing: 2,
    });
  }

  drawDivider(page, 554, GOLD_HAIRLINE, 120);

  // ==========================================================
  // 3. INSPIRATIONAL QUOTE BLOCK
  // ==========================================================
  const quoteLines = wrapText(`“${quote}”`, italicFont, 18, CARD_W - 170);
  const quoteStartY = 502;
  quoteLines.forEach((line, i) => {
    drawCentered(page, line, {
      font: italicFont,
      size: 18,
      y: quoteStartY - i * 26,
      color: NAVY_DARK,
    });
  });

  const quoteBottomY = quoteStartY - (quoteLines.length - 1) * 26;

  // ==========================================================
  // 4. HEARTFELT HOMECOMING MESSAGE (Flowing, warm, spacious)
  // ==========================================================
  const messageText =
    'Walking back into these corridors brings back the memories, the laughter, and the dreams where it all began. ' +
    'No matter how far your journey takes you, this campus will always be your home, and your footsteps will forever inspire the freshers celebrating Abhinandan today.';

  const messageLines = wrapText(messageText, serifFont, 13.5, CARD_W - 170);
  let currentY = quoteBottomY - 46;

  messageLines.forEach((line) => {
    drawCentered(page, line, {
      font: serifFont,
      size: 13.5,
      y: currentY,
      color: NAVY_MID,
    });
    currentY -= 22;
  });

  drawDivider(page, currentY - 20, GOLD_HAIRLINE, 120);

  // ==========================================================
  // 5. DATE & SIGN-OFF (Peaceful, balanced bottom spacing)
  // ==========================================================
  drawCentered(page, 'Sunday, October 25, 2026', {
    font: capsFont,
    size: 12.5,
    y: currentY - 50,
    color: NAVY_MUTED,
    letterSpacing: 1.5,
  });

  drawCentered(page, 'With warmth, pride & best wishes — Your College Family', {
    font: italicFont,
    size: 13,
    y: currentY - 74,
    color: NAVY_DARK,
  });

  return pdfDoc.save();
}
