const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Ensure directories exist
const qrDir = path.join(__dirname, 'QR');
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Production Vercel URL as default or pass custom URL as argument
const defaultUrl = 'https://alumni-checkin.vercel.app/';
let targetUrl = process.argv[2] || defaultUrl;

// Clean up trailing paths if checkin.html was specified
if (targetUrl.endsWith('/checkin.html') || targetUrl.endsWith('/checkin')) {
  targetUrl = targetUrl.replace(/\/checkin(\.html)?$/, '/');
}

const ultraHdPngPath = path.join(qrDir, 'checkin-qr-ultrahd.png');
const vectorSvgPath = path.join(qrDir, 'checkin-qr.svg');
const standardPngPath = path.join(qrDir, 'checkin-qr.png');
const posterHtmlPath = path.join(qrDir, 'checkin-qr-poster.html');

console.log(`\n======================================================`);
console.log(`🎯 Generating Ultra HD & Vector QR Assets`);
console.log(`🌐 Target URL: ${targetUrl}`);
console.log(`📁 Destination (PNG Ultra HD): ${ultraHdPngPath}`);
console.log(`📁 Destination (SVG Vector):   ${vectorSvgPath}`);
console.log(`======================================================\n`);

async function generate() {
  try {
    // 1. Generate Ultra HD (4096 x 4096) PNG with Level H Error Correction
    await QRCode.toFile(ultraHdPngPath, targetUrl, {
      width: 4096,
      margin: 3,
      color: {
        dark: '#0A192F', // Deep navy for optimal contrast and elegance
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });

    // 2. Generate Infinite-Resolution Scalable Vector Graphics (SVG)
    const svgContent = await QRCode.toString(targetUrl, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#0A192F',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    fs.writeFileSync(vectorSvgPath, svgContent, 'utf8');

    // 3. Create a luxurious Print-Ready Ultra HD Poster / Standee (HTML + Embedded Vector SVG)
    const posterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Abhinandan 2026 | Alumni Check-in &amp; Greeting Standee</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060d18;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      color: #FDFDFD;
    }
    .poster {
      background: linear-gradient(145deg, #0A192F 0%, #0e223d 100%);
      border: 2px solid rgba(218, 165, 32, 0.4);
      border-radius: 28px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 80px rgba(218, 165, 32, 0.12);
      width: 100%;
      max-width: 520px;
      padding: 48px 36px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .poster::before {
      content: "";
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(218, 165, 32, 0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(218, 165, 32, 0.12);
      border: 1px solid rgba(218, 165, 32, 0.35);
      color: #DFBA73;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 700;
      color: #FDFDFD;
      line-height: 1.25;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    h1 span {
      background: linear-gradient(135deg, #F1D78A 0%, #DFBA73 50%, #C5A059 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      color: #B0C4DE;
      font-size: 15px;
      line-height: 1.5;
      margin-bottom: 32px;
    }
    .qr-frame {
      background: #FFFFFF;
      padding: 20px;
      border-radius: 22px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
      display: inline-block;
      margin: 0 auto 28px;
      max-width: 300px;
      width: 100%;
    }
    .qr-frame svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .instructions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: rgba(14, 34, 61, 0.8);
      border: 1px solid rgba(176, 196, 222, 0.18);
      border-radius: 14px;
      padding: 12px 18px;
      margin-bottom: 24px;
    }
    .instructions span {
      font-size: 14px;
      font-weight: 600;
      color: #FDFDFD;
    }
    .instructions .icon {
      font-size: 18px;
    }
    .url-chip {
      color: #DFBA73;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      word-break: break-all;
      opacity: 0.9;
    }
    .actions {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .btn {
      background: #DFBA73;
      color: #0A192F;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 22px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover {
      background: #F1D78A;
      transform: translateY(-2px);
    }
    .btn-outline {
      background: transparent;
      color: #DFBA73;
      border: 1px solid rgba(218, 165, 32, 0.5);
    }
    .btn-outline:hover {
      background: rgba(218, 165, 32, 0.1);
    }
    @media print {
      body {
        background: transparent;
        padding: 0;
      }
      .actions { display: none !important; }
      .poster {
        box-shadow: none;
        max-width: 100%;
        border-radius: 0;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="badge">Abhinandan — Freshers Party 2026</div>
    <h1>Welcome Home, <span>Alumni</span></h1>
    <p class="subtitle">Scan the QR code below using your mobile camera to check in and collect your personalized welcome card.</p>

    <div class="qr-frame">
      ${svgContent}
    </div>

    <div class="instructions">
      <span class="icon">📷</span>
      <span>Point phone camera & tap the notification</span>
    </div>

    <div>
      <a href="${targetUrl}" target="_blank" class="url-chip">${targetUrl}</a>
    </div>
  </div>

  <div class="actions">
    <button class="btn" onclick="window.print()">🖨️ Print / Save PDF</button>
    <a href="checkin-qr-ultrahd.png" download="checkin-qr-ultrahd.png" class="btn btn-outline">⬇️ Download Ultra HD 4K PNG</a>
  </div>
</body>
</html>`;

    fs.writeFileSync(posterHtmlPath, posterHtml, 'utf8');

    // 4. Sync to public folder and legacy paths
    fs.copyFileSync(ultraHdPngPath, standardPngPath);
    fs.copyFileSync(ultraHdPngPath, path.join(publicDir, 'checkin-qr.png'));
    fs.copyFileSync(ultraHdPngPath, path.join(publicDir, 'checkin-qr-ultrahd.png'));
    fs.copyFileSync(vectorSvgPath, path.join(publicDir, 'checkin-qr.svg'));
    fs.copyFileSync(posterHtmlPath, path.join(publicDir, 'checkin-qr-poster.html'));


    console.log(`✅ Successfully generated Ultra HD assets:`);
    console.log(`   -> [PNG 4096x4096] ${ultraHdPngPath}`);
    console.log(`   -> [SVG Vector]    ${vectorSvgPath}`);
    console.log(`   -> [Poster HTML]   ${posterHtmlPath}`);
    console.log(`   -> [Public PNG]    ${path.join(publicDir, 'checkin-qr.png')}`);
    console.log(`   -> [Public SVG]    ${path.join(publicDir, 'checkin-qr.svg')}`);
    console.log(`   -> [Public Poster] ${path.join(publicDir, 'checkin-qr-poster.html')}\n`);

    // Terminal preview
    const termQr = await QRCode.toString(targetUrl, { type: 'terminal', small: true });
    console.log('Terminal Preview:');
    console.log(termQr);
    console.log(`\nUltra HD QR Code ready for print banners, badges, and mobile screens!\n`);
  } catch (err) {
    console.error('❌ Failed to generate QR codes:', err);
    process.exit(1);
  }
}

generate();


