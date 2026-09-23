const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------
// 1. DATA LOADING & NORMALIZATION
// ----------------------------------------------------
const dataFilePath = path.join(__dirname, 'data', 'alumni.xlsx');

function normalizePhone(rawPhone) {
  if (rawPhone === undefined || rawPhone === null) return '';
  // Force to string, strip spaces, dashes, +, parentheses
  return String(rawPhone).replace(/\D/g, '').trim();
}

function normalizeEmail(rawEmail) {
  if (!rawEmail) return '';
  return String(rawEmail).trim().toLowerCase();
}

let alumni = [];

function loadAlumniData() {
  if (!fs.existsSync(dataFilePath)) {
    console.warn(`[WARN] ${dataFilePath} not found!`);
    console.warn('Creating a sample data file now so the server can run...');
    try {
      require('./create-sample-data.js');
    } catch (e) {
      console.error('Failed to auto-create sample data:', e.message);
    }
  }

  try {
    const workbook = xlsx.readFile(dataFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRecords = xlsx.utils.sheet_to_json(sheet);

    alumni = rawRecords.map((item) => ({
      name: String(item.Name || item.name || '').trim(),
      email: normalizeEmail(item.Email || item.email),
      phone: normalizePhone(item.Phone || item.phone)
    })).filter((record) => record.name && (record.email || record.phone));

    console.log(`\n=========================================`);
    console.log(`✅ Loaded ${alumni.length} alumni records from data/alumni.xlsx`);
    console.log(`=========================================\n`);
  } catch (err) {
    console.error('❌ Failed to read alumni spreadsheet:', err.message);
    alumni = [];
  }
}

// Load once into memory at startup
loadAlumniData();

// Optional: auto-reload on Excel file modification without server restart
try {
  fs.watchFile(dataFilePath, { interval: 2000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      console.log('🔄 Detected modification in data/alumni.xlsx, reloading records...');
      loadAlumniData();
    }
  });
} catch (watchErr) {
  // Ignore watch error if filesystem doesn't support it
}

// ----------------------------------------------------
// 2. REST API ENDPOINTS
// ----------------------------------------------------

// Health check endpoint - returns { loaded: alumni.length }
app.get('/api/health', (req, res) => {
  res.json({
    loaded: alumni.length
  });
});

// Manual reload endpoint
app.get('/api/reload', (req, res) => {
  loadAlumniData();
  res.json({
    status: 'reloaded',
    loaded: alumni.length
  });
});

// Lookup endpoint
app.post('/api/lookup', (req, res) => {
  const { identifier } = req.body || {};
  const rawInput = String(identifier || '').trim();

  if (!rawInput) {
    return res.status(400).json({ error: 'Identifier is required' });
  }

  const normalizedInputEmail = normalizeEmail(rawInput);
  const normalizedInputPhone = normalizePhone(rawInput);

  // Search in-memory alumni array for Email OR Phone match
  const matched = alumni.find((person) => {
    // Check Email match
    if (person.email && person.email === normalizedInputEmail) {
      return true;
    }
    // Check Phone match
    if (person.phone && normalizedInputPhone.length >= 7) {
      if (person.phone === normalizedInputPhone) return true;
      // Handle cases where user input or sheet has country code differences
      if (person.phone.endsWith(normalizedInputPhone) || normalizedInputPhone.endsWith(person.phone)) {
        return true;
      }
    }
    return false;
  });

  if (!matched) {
    return res.json({ found: false });
  }

  // Found: Respond immediately with attendee name
  res.json({
    found: true,
    name: matched.name
  });
});

// Fallback routing: default to index.html for root, checkin.html for /checkin
app.get('/checkin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server if run directly or not on serverless
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Alumni Check-In server running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
