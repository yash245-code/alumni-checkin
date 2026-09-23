const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');

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

// ----------------------------------------------------
// 2. WHATSAPP CLIENT SETUP
// ----------------------------------------------------
let isWhatsAppReady = false;

const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

whatsappClient.on('qr', (qr) => {
  console.log('\n======================================================');
  console.log('📲 SCAN THIS QR CODE WITH WHATSAPP TO LOG IN:');
  console.log('======================================================\n');
  qrcodeTerminal.generate(qr, { small: true });
  console.log('\n(Your session will be saved in .wwebjs_auth for future restarts)\n');
});

whatsappClient.on('ready', () => {
  isWhatsAppReady = true;
  console.log('✨ WhatsApp client is authenticated and ready to send messages!');
});

whatsappClient.on('authenticated', () => {
  console.log('🔐 WhatsApp authenticated successfully.');
});

whatsappClient.on('auth_failure', (msg) => {
  console.error('❌ WhatsApp authentication failure:', msg);
});

whatsappClient.on('disconnected', (reason) => {
  isWhatsAppReady = false;
  console.warn('⚠️ WhatsApp client disconnected:', reason);
});

// Launch WhatsApp client asynchronously
whatsappClient.initialize().catch((err) => {
  console.error('⚠️ WhatsApp client initialization error:', err.message);
  console.warn('Backend API will continue serving requests.');
});

async function sendWhatsAppWelcome(phone, name) {
  if (!phone) {
    console.warn(`[WHATSAPP] Skipping message for ${name}: No phone number on record.`);
    return;
  }

  const chatId = `${phone}@c.us`;
  const message = `🎉 Welcome back, ${name}! Great to have you at the Freshers event today. Enjoy!`;

  if (!isWhatsAppReady) {
    console.warn(`[WHATSAPP] Cannot send message to ${name} (${chatId}): WhatsApp client not logged in yet. Scan the terminal QR code to connect.`);
    return;
  }

  try {
    await whatsappClient.sendMessage(chatId, message);
    console.log(`[WHATSAPP] Sent welcome message to ${name} (${chatId})`);
  } catch (err) {
    // Log failures, never crash the server
    console.error(`[WHATSAPP] Error sending to ${name} (${chatId}):`, err.message);
  }
}

// ----------------------------------------------------
// 3. REST API ENDPOINTS
// ----------------------------------------------------

// Health sanity-check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    loaded: alumni.length,
    whatsappReady: isWhatsAppReady
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
    // Check Phone match (allow matching if phone input has at least 7 digits)
    if (person.phone && normalizedInputPhone.length >= 7) {
      if (person.phone === normalizedInputPhone) return true;
      // Handle cases where user input may omit country code (e.g. 9876543210 vs 919876543210)
      if (person.phone.endsWith(normalizedInputPhone) || normalizedInputPhone.endsWith(person.phone)) {
        return true;
      }
    }
    return false;
  });

  if (!matched) {
    return res.json({ found: false });
  }

  // Found: Respond immediately to user
  res.json({
    found: true,
    name: matched.name
  });

  // Asynchronously dispatch WhatsApp welcome message without blocking HTTP response
  setImmediate(() => {
    sendWhatsAppWelcome(matched.phone, matched.name);
  });
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Alumni Check-In server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});
