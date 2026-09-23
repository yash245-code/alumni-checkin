const fs = require('fs');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');

// Ensure QR directory exists
const qrDir = path.join(__dirname, 'QR');
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
}

// Automatically detect local Wi-Fi / LAN IP if no URL is provided
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.')) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const defaultUrl = `http://${getLocalIp()}:3000`;
let targetUrl = process.argv[2] || defaultUrl;

// Ensure target points to landing page (index.html or root), not directly to checkin.html
if (targetUrl.endsWith('/checkin.html') || targetUrl.endsWith('/checkin')) {
  targetUrl = targetUrl.replace(/\/checkin(\.html)?$/, '/');
}
const ultraHdFileName = 'checkin-qr-ultrahd.png';
const ultraHdPath = path.join(qrDir, ultraHdFileName);
const fullHdPath = path.join(qrDir, 'checkin-qr-fullhd.png');
const standardPath = path.join(qrDir, 'checkin-qr.png');

console.log(`\n======================================================`);
console.log(`🎯 Generating Ultra HD (4K) QR Code`);
console.log(`🌐 Target URL: ${targetUrl}`);
console.log(`📁 Destination: ${ultraHdPath}`);
console.log(`======================================================\n`);

// Generate Ultra HD (3840x3840) 4K QR Code with maximum error correction (Level H)
QRCode.toFile(ultraHdPath, targetUrl, {
  width: 3840,
  margin: 3,
  color: {
    dark: '#0f172a',
    light: '#ffffff'
  },
  errorCorrectionLevel: 'H'
}, (err) => {
  if (err) {
    console.error('❌ Failed to generate Ultra HD QR code:', err);
    process.exit(1);
  }

  // Also maintain copies in public/ and QR formats
  try {
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.copyFileSync(ultraHdPath, standardPath);
    fs.copyFileSync(ultraHdPath, fullHdPath);
    fs.copyFileSync(ultraHdPath, path.join(publicDir, 'checkin-qr.png'));
  } catch (copyErr) {
    // Ignore copy error
  }

  console.log(`✅ Successfully generated Ultra HD (3840x3840) QR code:`);
  console.log(`   -> ${ultraHdPath}`);
  console.log(`   -> ${path.join(__dirname, 'public', 'checkin-qr.png')}\n`);

  // Print ASCII preview to terminal
  QRCode.toString(targetUrl, { type: 'terminal', small: true }, (termErr, termQr) => {
    if (!termErr) {
      console.log('Terminal Preview:');
      console.log(termQr);
    }
    console.log(`\nReady for high-res printing or displaying on screens!\n`);
  });
});
