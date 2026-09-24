import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getRandomQuote } from '@/lib/card-quotes';

const ASSETS_DIR = path.join(process.cwd(), 'assets');

// Card canvas matches the generated background artwork (2:3 portrait), in PDF points.
// We render at the same pixel ratio as the PNG (1240x1860) scaled down to points.
const CARD_W = 620;
const CARD_H = 930;

const NAVY_DARK = rgb(0x16 / 255, 0x32 / 255, 0x4f / 255);
const NAVY_MID = rgb(0x3a / 255, 0x5a / 255, 0x80 / 255);
const GOLD = rgb(0xc9 / 255, 0xa2 / 255, 0x27 / 255);

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

function drawDivider(page, y, color) {
  const cx = CARD_W / 2;
  page.drawLine({ start: { x: cx - 100, y }, end: { x: cx - 16, y }, thickness: 1, color });
  page.drawLine({ start: { x: cx + 16, y }, end: { x: cx + 100, y }, thickness: 1, color });
  page.drawEllipse({ x: cx, y, xScale: 3, yScale: 3, color });
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

  // manual letter-spacing for small-caps style labels
  let cursor = x;
  for (const ch of text) {
    page.drawText(ch, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(ch, size) + letterSpacing;
  }
}

/**
 * Generates a one-page welcome-card PDF for a verified alumnus.
 * @param {{ name: string, department: string }} params
 * @returns {Promise<Uint8Array>} PDF bytes
 */
export async function generateAlumniCard({ name, department }) {
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

  // Background artwork (flip Y origin: pdf-lib's page origin is bottom-left)
  page.drawImage(bgImage, { x: 0, y: 0, width: CARD_W, height: CARD_H });

  // --- Content, spread evenly down the card interior; y counted from the BOTTOM ---
  const quote = getRandomQuote();

  drawCentered(page, 'ALUMNI HOMECOMING', {
    font: capsFont,
    size: 15,
    y: 798,
    color: GOLD,
    letterSpacing: 3,
  });

  drawCentered(page, 'Welcome back,', {
    font: capsFont,
    size: 22,
    y: 745,
    color: NAVY_MID,
  });

  // Name — shrink to fit if it's long, so it never overruns the frame.
  let nameSize = 42;
  while (serifFont.widthOfTextAtSize(name, nameSize) > CARD_W - 140 && nameSize > 24) {
    nameSize -= 2;
  }
  drawCentered(page, name, {
    font: serifFont,
    size: nameSize,
    y: 675,
    color: NAVY_DARK,
  });

  if (department) {
    drawCentered(page, department.toUpperCase(), {
      font: capsFont,
      size: 16,
      y: 625,
      color: GOLD,
      letterSpacing: 2,
    });
  }

  drawDivider(page, 560, GOLD);

  // Quote block, wrapped and centered
  const quoteLines = wrapText(quote, italicFont, 19, CARD_W - 200);
  const quoteStartY = 480;
  quoteLines.forEach((line, i) => {
    const isFirst = i === 0;
    const isLast = i === quoteLines.length - 1;
    const text = `${isFirst ? '“' : ''}${line}${isLast ? '”' : ''}`;
    drawCentered(page, text, {
      font: italicFont,
      size: 19,
      y: quoteStartY - i * 28,
      color: NAVY_MID,
    });
  });

  drawDivider(page, quoteStartY - quoteLines.length * 28 - 30, GOLD);

  const eventDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const footerY = quoteStartY - quoteLines.length * 28 - 80;
  drawCentered(page, 'VERIFIED ATTENDEE  ·  FRESHERS’ DAY 2026', {
    font: capsFont,
    size: 13,
    y: footerY,
    color: GOLD,
    letterSpacing: 1.5,
  });
  drawCentered(page, eventDate, {
    font: capsFont,
    size: 13,
    y: footerY - 30,
    color: NAVY_MID,
    letterSpacing: 1,
  });

  return pdfDoc.save();
}
