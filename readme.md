# 🎓 Alumni Check-In

A lightweight, mobile-first Node.js & Express check-in system for college events and alumni homecomings. Attendees scan a QR code at the entrance, view an animated event landing page, tap to the check-in form, and verify their attendance with instant visual confirmation.

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
The spreadsheet must contain these column headers in the first sheet:
| Name | Email | Phone |
| :--- | :--- | :--- |
| Priya Sharma | priya.sharma@example.com | 919876543210 |
| Aarav Patel | aarav.patel@example.com | 919812345678 |

> **Note on Data Normalization**: 
> - Emails are automatically lowercased and trimmed.
> - Phone numbers have non-digit characters (`+`, `-`, spaces, parentheses) stripped automatically.
> - Data is loaded once into memory on startup for lightning-fast lookups.
> - If `data/alumni.xlsx` doesn't exist, running `npm start` or `npm run seed-sample` will auto-generate starter test data.

### 3. Start the Server Locally
```bash
npm start
```
The server will start at: `http://localhost:3000`

---

## 📱 Generating the Check-In QR Poster

To generate a QR code image for printing or displaying at the event entrance (points to the landing page `index.html`):

```bash
# Generate QR code pointing to your deployed URL or Ngrok tunnel
node generate-qr.js https://your-domain.com
```
This produces `checkin-qr.png` (and `checkin-qr-ultrahd.png` for 4K printing) in the project root.

---

## 🌐 Deploying & Running Tonight

### Option A: Deploy to Vercel (Fastest & Recommended)
1. Push this repository to your GitHub account (private or public).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Import your `alumni-checkin` repository.
4. Framework Preset: **Other**.
5. Click **Deploy**. Vercel will build and deploy your app in under 15 seconds!

### Option B: Deploy to Render / Railway
- **Render**: Create a Web Service from your GitHub repo.
  - Build Command: `npm install`
  - Start Command: `npm start`
- **Railway**: Click **New Project** → **Deploy from GitHub repo**. Railway automatically detects `npm start`.

### Option C: Run Locally with Ngrok (For Tonight)
If you want to run directly from your laptop without cloud hosting:
1. Start the server:
   ```bash
   npm start
   ```
2. In a second terminal, open an ngrok tunnel:
   ```bash
   npx ngrok http 3000
   ```
3. Copy the public `https://xxxx.ngrok-free.app` URL and generate your entrance QR poster:
   ```bash
   node generate-qr.js https://xxxx.ngrok-free.app
   ```

---

## 🔍 API Endpoints

- `GET /api/health`
  Sanity check endpoint to verify the sheet is loaded before the event:
  ```json
  { "loaded": 7 }
  ```

- `POST /api/lookup`
  Body: `{ "identifier": "priya.sharma@example.com" }` or `{ "identifier": "9876543210" }`
  - Response (Match): `{ "found": true, "name": "Priya Sharma" }`
  - Response (No match): `{ "found": false }`

---

## 📂 Project Structure

```
alumni-checkin/
├── data/
│   └── alumni.xlsx          # Event spreadsheet (Name, Email, Phone)
├── public/
│   ├── index.html           # Animated landing page (Hero, Mid, CTA "Get You In 🚀")
│   └── checkin.html         # Mobile check-in card (~375px baseline)
├── create-sample-data.js    # Generates starter data/alumni.xlsx
├── generate-qr.js           # Generates checkin-qr.png from URL
├── package.json             # Express, xlsx, qrcode, cors
├── server.js                # Core API & SheetJS in-memory loader
├── vercel.json              # Vercel deployment configuration
└── README.md
```
