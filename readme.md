# 🎓 Alumni Check-In Prototype

A lightweight, mobile-first Node.js & Express check-in system for event kiosks and attendee self-checkin. Attendees scan a QR code at the entrance, enter their email or phone number on their phones, receive instant personalized visual confirmation, and get an automated WhatsApp welcome message sent via `whatsapp-web.js`.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare the Alumni Spreadsheet
Place your event alumni spreadsheet at:
```
data/alumni.xlsx
```
The spreadsheet must contain these exact column headers in the first sheet:
| Name | Email | Phone |
| :--- | :--- | :--- |
| Priya Sharma | priya.sharma@example.com | 919876543210 |
| Aarav Patel | aarav.patel@example.com | 919812345678 |

> **Note on Phone Format**: Provide digits only in international format with country code (e.g. `919999999999`, no `+`, `-`, or spaces). The system automatically strips non-digit characters and normalizes numbers upon loading.

*(If `data/alumni.xlsx` doesn't exist yet, run `npm run seed-sample` or start the server — a starter spreadsheet with test data will be generated automatically).*

### 3. Start the Server
```bash
npm start
```

### 4. Scan WhatsApp QR Code on First Run
When the server starts for the first time, a QR code will be printed directly in your terminal:
1. Open **WhatsApp** on your phone.
2. Tap **Settings** (iOS) or **Three Dots** (Android) ➔ **Linked Devices** ➔ **Link a Device**.
3. Scan the terminal QR code.
4. Your login session will be securely persisted in `.wwebjs_auth/`. You will not need to scan again on restarts.

---

## 📱 Generating the Check-In QR Poster

To generate a high-resolution QR code image for printing or displaying at the event registration desk / entrance:

```bash
# Generate QR code pointing to your deployed URL or Ngrok tunnel
node generate-qr.js https://your-deployed-domain.com
```
This produces `checkin-qr.png` in the project root.

---

## 🌐 Running for Tonight's Event

### Option A: Local Tunnel via Ngrok (Recommended for Tonight)
Running locally on your laptop with an ngrok tunnel is the fastest and most reliable setup for tonight because it keeps your WhatsApp session active without dealing with cloud browser dependencies:

1. Start the check-in server:
   ```bash
   npm start
   ```
2. In a separate terminal, start an ngrok tunnel on port 3000:
   ```bash
   npx ngrok http 3000
   ```
3. Copy the public `https://xxxx.ngrok-free.app` URL provided by ngrok.
4. Generate the entrance QR poster with that URL:
   ```bash
   node generate-qr.js https://xxxx.ngrok-free.app
   ```
5. Print `checkin-qr.png` or display it on a tablet/monitor at the registration counter!

---

### Option B: Deploying to Railway / Render

#### Railway:
1. Push this repository to GitHub.
2. In Railway, click **New Project** ➔ **Deploy from GitHub repo**.
3. Railway automatically detects `npm start`.
4. Check the **Deploy Logs** on Railway to see the WhatsApp QR code printed in the build/run logs, and scan it with WhatsApp.

#### Render:
1. Create a **New Web Service** connected to your repository.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add environment variable `PORT=3000`.
5. View the service **Logs** in the Render dashboard to scan the WhatsApp QR code.
*(Note: Because cloud hosts have ephemeral file systems unless persistent disks are mounted, `.wwebjs_auth` requires a persistent volume or re-scanning if the dyno restarts).*

---

## 🔍 API & Health Check

- `GET /api/health`
  Sanity check endpoint before the event starts. Returns:
  ```json
  {
    "status": "ok",
    "loaded": 5,
    "whatsappReady": true
  }
  ```

- `POST /api/lookup`
  Body: `{ "identifier": "priya.sharma@example.com" }` or `{ "identifier": "9876543210" }`
  Response (Match):
  ```json
  {
    "found": true,
    "name": "Priya Sharma"
  }
  ```
  Response (No match):
  ```json
  {
    "found": false
  }
  ```

---

## 📂 Project Structure

```
alumni-checkin/
├── data/
│   └── alumni.xlsx          # Event spreadsheet (Name, Email, Phone)
├── public/
│   └── index.html           # Mobile-first checkin interface (~375px baseline)
├── .gitignore               # Excludes node_modules, .wwebjs_auth, cache
├── create-sample-data.js    # Generates sample data/alumni.xlsx
├── generate-qr.js           # Generates checkin-qr.png from URL
├── package.json             # Express, whatsapp-web.js, xlsx, qrcode, cors
├── server.js                # Core API, SheetJS loader, WhatsApp client
└── README.md
```
