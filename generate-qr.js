const path = require('path');
const QRCode = require('qrcode');

const targetUrl = process.argv[2] || 'http://localhost:3000';
const outputPath = path.join(__dirname, 'checkin-qr.png');

console.log(`\nGenerating Check-in QR code for URL: ${targetUrl}`);

QRCode.toFile(outputPath, targetUrl, {
  width: 800,
  margin: 2,
  color: {
    dark: '#0f172a',
    light: '#ffffff'
  },
  errorCorrectionLevel: 'H'
}, (err) => {
  if (err) {
    console.error('Failed to generate QR code image:', err);
    process.exit(1);
  }
  console.log(`Successfully generated QR code image at:\n  -> ${outputPath}`);
  console.log('You can print this image or display it at the event entrance.\n');

  // Also print to terminal for immediate verification
  QRCode.toString(targetUrl, { type: 'terminal', small: true }, (termErr, termQr) => {
    if (!termErr) {
      console.log('Terminal Preview:');
      console.log(termQr);
    }
  });
});
