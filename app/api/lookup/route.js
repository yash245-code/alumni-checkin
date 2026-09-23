import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

// Module-level in-memory cache for warm serverless invocations
let alumniCache = null;

function normalizePhone(rawPhone) {
  if (rawPhone === undefined || rawPhone === null) return '';
  return String(rawPhone).replace(/\D/g, '').trim();
}

function normalizeEmail(rawEmail) {
  if (!rawEmail) return '';
  return String(rawEmail).trim().toLowerCase();
}

function getAlumniData() {
  if (alumniCache) {
    return alumniCache;
  }

  const filePath = path.join(process.cwd(), 'data', 'alumni.xlsx');

  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Alumni data file not found at: ${filePath}`);
    return [];
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRecords = xlsx.utils.sheet_to_json(sheet);

    alumniCache = rawRecords
      .map((item) => ({
        name: String(item.Name || item.name || '').trim(),
        email: normalizeEmail(item.Email || item.email),
        phone: normalizePhone(item.Phone || item.phone),
      }))
      .filter((record) => record.name && (record.email || record.phone));

    console.log(`✅ Loaded and cached ${alumniCache.length} records from data/alumni.xlsx`);
    return alumniCache;
  } catch (err) {
    console.error('❌ Failed to read data/alumni.xlsx:', err.message);
    return [];
  }
}

// POST: Lookup attendee by email or phone
export async function POST(request) {
  try {
    const body = await request.json();
    const rawInput = String(body?.identifier || '').trim();

    if (!rawInput) {
      return Response.json({ error: 'Identifier is required' }, { status: 400 });
    }

    const alumni = getAlumniData();
    const normalizedInputEmail = normalizeEmail(rawInput);
    const normalizedInputPhone = normalizePhone(rawInput);

    const matched = alumni.find((person) => {
      // Check email match
      if (person.email && person.email === normalizedInputEmail) {
        return true;
      }
      // Check phone match (digits only, flexible on country code)
      if (person.phone && normalizedInputPhone.length >= 7) {
        if (person.phone === normalizedInputPhone) return true;
        if (person.phone.endsWith(normalizedInputPhone) || normalizedInputPhone.endsWith(person.phone)) {
          return true;
        }
      }
      return false;
    });

    if (!matched) {
      return Response.json({ found: false });
    }

    return Response.json({
      found: true,
      name: matched.name,
    });
  } catch (err) {
    console.error('API lookup error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Sanity check / health endpoint
export async function GET() {
  const alumni = getAlumniData();
  return Response.json({
    status: 'ok',
    loaded: alumni.length,
  });
}
