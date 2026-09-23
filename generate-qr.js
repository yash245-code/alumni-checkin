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
const targetUrl = process.argv[2] || defaultUrl;
const outputFileName = 'checkin-qr-fullhd.png';
const outputPath = path.join(qrDir, outputFileName);
const standardPath = path.join(qrDir, 'checkin-qr.png');

console.log(`\n======================================================`);
console.log(`🎯 Generating Full HD QR Code`);
console.log(`🌐 Target URL: ${targetUrl}`);
console.log(`📁 Destination: ${outputPath}`);
console.log(`======================================================\n`);

// Generate Full HD (1920x1920) QR Code with high error correction
QRCode.toFile(outputPath, targetUrl, {
  width: 1920,
  margin: 3,
  color: {
    dark: '#0f172a',
    light: '#ffffff'
  },
  errorCorrectionLevel: 'H'
}, (err) => {
  if (err) {
    console.error('❌ Failed to generate Full HD QR code:', err);
    process.exit(1);
  }

  // Also write standard checkin-qr.png in QR folder
  try {
    fs.copyFileSync(outputPath, standardPath);
  } catch (copyErr) {
    // Ignore copy error
  }

  console.log(`✅ Successfully generated Full HD (1920x1920) QR code:`);
  console.log(`   -> ${outputPath}`);
  console.log(`   -> ${standardPath}\n`);

  // Print ASCII preview to terminal
  QRCode.toString(targetUrl, { type: 'terminal', small: true }, (termErr, termQr) => {
    if (!termErr) {
      console.log('Terminal Preview:');
      console.log(termQr);
    }
    console.log(`\nReady for high-res printing or displaying on screens!\n`);
  });
});
