import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Freshers' Day 2026 — Alumni Check-In",
  description: "Official Alumni Check-In portal for Freshers' Day 2026.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
