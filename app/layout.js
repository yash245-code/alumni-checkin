import { Plus_Jakarta_Sans, Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Abhinandan 2026 — Alumni Check-In & Greeting Point",
  description: "Official Alumni Check-In and Greeting portal for Abhinandan Freshers Party 2026.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      data-scroll-behavior="smooth" 
      className={`${plusJakarta.variable} ${inter.variable} ${playfair.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="bg-[#0A192F] text-[#FDFDFD] font-body antialiased min-h-screen relative selection:bg-[#DAA520] selection:text-[#0A192F]">
        {/* ======================================================== */}
        {/* GLOBAL BACKGROUND: Watercolor Blue Graph on Deep Navy & InkWashes */}
        {/* ======================================================== */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Animated Coordinate Grid with Soft Watercolor Blue Lines & Dotted Intersections */}
          <div className="graph-grid-bg graph-vignette opacity-80" />

          {/* Diffuse Watercolor Blue & Champagne Gold Ink Washes */}
          <div className="absolute -top-32 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#B0C4DE]/14 blur-[95px] animate-flare-drift" />
          <div 
            className="absolute top-1/3 -right-24 w-72 sm:w-88 h-72 sm:h-88 rounded-full bg-[#B0C4DE]/12 blur-[95px] animate-flare-drift" 
            style={{ animationDelay: '4s' }}
          />
          <div className="absolute -bottom-24 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#DAA520]/10 blur-[110px]" />
        </div>

        {/* Global Page Content Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
