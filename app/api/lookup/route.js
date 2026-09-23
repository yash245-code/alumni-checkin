import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

// Module-level in-memory cache and last modified timestamp tracker
let alumniCache = null;
let lastMtime = 0;

function getFieldValue(item, keyNames) {
  if (!item || typeof item !== 'object') return '';
  for (const key of Object.keys(item)) {
    const cleanKey = key.trim().toLowerCase();
    for (const target of keyNames) {
      if (cleanKey === target.toLowerCase()) {
        return item[key];
      }
    }
  }
  return '';
}

function normalizeName(rawName) {
  if (!rawName) return '';
  return String(rawName).trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeEmail(rawEmail) {
  if (!rawEmail) return '';
  return String(rawEmail).trim().toLowerCase();
}

function normalizePhone(rawPhone) {
  if (rawPhone === undefined || rawPhone === null) return '';
  return String(rawPhone).replace(/\D/g, '').trim();
}

function normalizeDepartment(rawDept) {
  if (!rawDept) return '';
  return String(rawDept).trim().toLowerCase().replace(/\s+/g, ' ');
}

function getAlumniData() {
  const filePath = path.join(process.cwd(), 'data', 'alumni.xlsx');

  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Alumni data file not found at: ${filePath}`);
    return [];
  }

  try {
    const stats = fs.statSync(filePath);
    if (alumniCache && stats.mtimeMs === lastMtime) {
      return alumniCache;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRecords = xlsx.utils.sheet_to_json(sheet);

    alumniCache = rawRecords
      .map((item) => ({
        name: String(getFieldValue(item, ['Name', 'Full Name', 'Attendee Name', 'Alumni Name']) || '').trim(),
        email: normalizeEmail(getFieldValue(item, ['Email', 'Email Address', 'Mail'])),
        phone: normalizePhone(getFieldValue(item, ['Phone', 'Phone Number', 'Mobile', 'Contact'])),
        department: String(getFieldValue(item, ['Department', 'Dept', 'Department Name', 'Branch']) || '').trim(),
      }))
      .filter((record) => record.name && (record.email || record.phone));

    lastMtime = stats.mtimeMs;
    console.log(`✅ Loaded and cached ${alumniCache.length} records from data/alumni.xlsx`);
    return alumniCache;
  } catch (err) {
    console.error('❌ Failed to read data/alumni.xlsx:', err.message);
    return [];
  }
}

// POST: Strict multi-field verification (Name, Email/Phone, and Department must all match)
export async function POST(request) {
  try {
    const body = await request.json();
    const inputName = normalizeName(body?.name);
    const rawIdentifier = String(body?.identifier || body?.email || body?.phone || '').trim();
    const inputEmail = normalizeEmail(rawIdentifier);
    const inputPhone = normalizePhone(rawIdentifier);
    const inputDept = normalizeDepartment(body?.department);

    if (!inputName || (!inputEmail && !inputPhone) || !inputDept) {
      return Response.json(
        { 
          found: false, 
          message: 'All fields (Name, Registered Email/Phone, and Department) are required.' 
        }, 
        { status: 400 }
      );
    }

    const alumni = getAlumniData();

    // Verification requires ALL fields to match the exact same record in alumni.xlsx:
    // 1. Name must match
    // 2. Email or Phone must match
    // 3. Department must match
    const matched = alumni.find((person) => {
      // 1. Check Name
      const personName = normalizeName(person.name);
      if (personName !== inputName) {
        return false;
      }

      // 2. Check Email or Phone
      let contactMatches = false;
      if (person.email && inputEmail && person.email === inputEmail) {
        contactMatches = true;
      } else if (person.phone && inputPhone.length >= 7) {
        if (person.phone === inputPhone || person.phone.endsWith(inputPhone) || inputPhone.endsWith(person.phone)) {
          contactMatches = true;
        }
      }
      if (!contactMatches) {
        return false;
      }

      // 3. Check Department
      const personDept = normalizeDepartment(person.department);
      if (!personDept || personDept !== inputDept) {
        return false;
      }

      return true;
    });

    if (!matched) {
      return Response.json({
        found: false,
        message: 'Details could not be verified. Please ensure your Name, Email/Phone, and Department match the registered records exactly.'
      });
    }

    return Response.json({
      found: true,
      name: matched.name,
      department: matched.department,
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
