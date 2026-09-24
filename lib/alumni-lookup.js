import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

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

export function normalizeName(rawName) {
  if (!rawName) return '';
  return String(rawName).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function normalizeEmail(rawEmail) {
  if (!rawEmail) return '';
  return String(rawEmail).trim().toLowerCase();
}

export function normalizePhone(rawPhone) {
  if (rawPhone === undefined || rawPhone === null) return '';
  return String(rawPhone).replace(/\D/g, '').trim();
}

export function normalizeDepartment(rawDept) {
  if (!rawDept) return '';
  return String(rawDept).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getAlumniData() {
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

/**
 * Strict multi-field match: Name, Email/Phone, and Department must all match
 * the same record. Returns the matched record ({ name, email, phone, department })
 * or null.
 */
export function findAlumniMatch({ name, identifier, department }) {
  const inputName = normalizeName(name);
  const rawIdentifier = String(identifier || '').trim();
  const inputEmail = normalizeEmail(rawIdentifier);
  const inputPhone = normalizePhone(rawIdentifier);
  const inputDept = normalizeDepartment(department);

  if (!inputName || (!inputEmail && !inputPhone) || !inputDept) {
    return null;
  }

  const alumni = getAlumniData();

  return (
    alumni.find((person) => {
      const personName = normalizeName(person.name);
      if (personName !== inputName) return false;

      let contactMatches = false;
      if (person.email && inputEmail && person.email === inputEmail) {
        contactMatches = true;
      } else if (person.phone && inputPhone.length >= 7) {
        if (person.phone === inputPhone || person.phone.endsWith(inputPhone) || inputPhone.endsWith(person.phone)) {
          contactMatches = true;
        }
      }
      if (!contactMatches) return false;

      const personDept = normalizeDepartment(person.department);
      if (!personDept || personDept !== inputDept) return false;

      return true;
    }) || null
  );
}
