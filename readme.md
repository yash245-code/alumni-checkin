# 🎓 Alumni Check-In (Next.js App Router)

A clean, mobile-first Next.js (App Router) check-in application built for college events, reunions, and homecomings. Optimized for instant zero-configuration deployment on **Vercel**.

Attendees scan an entrance QR code, land on a smooth animated event page, navigate to the check-in form, and verify their attendance with instant visual confirmation.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Alumni Spreadsheet
Place your event spreadsheet at:
```
data/alumni.xlsx
```
The spreadsheet must contain these column headers in the first sheet:
| Name | Email | Phone |
| :--- | :--- | :--- |
| Priya Sharma | priya.sharma@example.com | 919876543210 |
| Aarav Patel | aarav.patel@example.com | 919812345678 |

> **Note on Data Handling**:
> - `data/alumni.xlsx` is bundled as a static asset with your project.
> - The API route (`app/api/lookup/route.js`) loads and normalizes emails and phone numbers.
> - Records are cached in memory during warm serverless invocations for maximum speed.
> - If `data/alumni.xlsx` is not yet present, run `npm run seed-sample` to generate a starter template.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploying to Vercel

Next.js App Router deploys directly on Vercel without any extra configuration files.

### Deploy via GitHub (Recommended)
1. Commit your changes and push to your GitHub repository:
   ```bash
   git add -A
   git commit -m "feat: migrate to Next.js App Router"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Import your `alumni-checkin` repository.
4. Click **Deploy**. Vercel will build and launch your site in seconds!

### Deploy via Vercel CLI
```bash
npx vercel
```

---

## 📱 Generating the Entrance QR Code

Once your Vercel deployment URL is live (e.g., `https://alumni-checkin.vercel.app`):

```bash
node generate-qr.js https://alumni-checkin.vercel.app
```

- This encodes your deployed URL's root path (the landing page, not `/checkin` directly).
- Outputs `public/checkin-qr.png` (accessible directly at `/checkin-qr.png`) and `checkin-qr.png` in the project root.
- Also generates a 4K Ultra HD print-ready version (`QR/checkin-qr-ultrahd.png`).

---

## 🔍 API Endpoints

- **`GET /api/lookup`**
  Sanity check / health endpoint to verify the spreadsheet is loaded:
  ```json
  { "status": "ok", "loaded": 7 }
  ```

- **`POST /api/lookup`**
  Body: `{ "identifier": "priya.sharma@example.com" }` or `{ "identifier": "9876543210" }`
  - Match: `{ "found": true, "name": "Priya Sharma" }`
  - No match: `{ "found": false }`

---

## 📂 Project Structure

```
alumni-checkin/
├── app/
│   ├── layout.js            # Root layout with Poppins/Inter fonts & mobile viewport
│   ├── page.js              # Animated landing page ('use client')
│   ├── globals.css          # Tailwind CSS & keyframe animations (drift, pulse)
│   ├── checkin/
│   │   └── page.js          # Mobile check-in form ('use client')
│   └── api/
│       └── lookup/
│           └── route.js     # Serverless POST lookup & GET health check
├── data/
│   └── alumni.xlsx          # Bundled alumni records (Name, Email, Phone)
├── public/
│   └── checkin-qr.png       # Generated QR poster
├── generate-qr.js           # Standalone QR generator script
├── create-sample-data.js    # Starter sample data generator
├── package.json             # Next.js, xlsx, aos, qrcode
├── next.config.js           # Next.js configuration
├── .gitignore               # Ignores .next, node_modules (tracks data/alumni.xlsx)
└── README.md
```
