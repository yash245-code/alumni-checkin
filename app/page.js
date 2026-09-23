'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    });
  }, []);

  return (
    <>
      <Script 
        src="https://unpkg.com/aos@2.3.1/dist/aos.js" 
        strategy="afterInteractive" 
      />

      <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-indigo-500 selection:text-white">
        {/* Soft drifting ambient background blobs */}
        <div 
          className="blob animate-drift -top-24 -left-28 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-br from-indigo-600 to-purple-600" 
          aria-hidden="true" 
        />
        <div 
          className="blob animate-drift top-1/2 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-br from-pink-600 to-purple-700 [animation-delay:-5s]" 
          aria-hidden="true" 
        />
        <div 
          className="blob animate-drift -bottom-24 left-8 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-br from-blue-600 to-indigo-700 [animation-delay:-9s]" 
          aria-hidden="true" 
        />

        {/* Content Container (Mobile-first, optimized for ~375px) */}
        <main className="relative z-10 max-w-md mx-auto px-6 py-6 flex flex-col justify-between min-h-screen">
          
          {/* ============================================== */}
          {/* SECTION 1: HERO */}
          {/* ============================================== */}
          <section className="min-h-[85vh] flex flex-col justify-center items-center text-center pt-8 pb-10">
            {/* Event pill tag */}
            <div 
              data-aos="fade-down"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Official Event Access</span>
            </div>

            {/* Large Bold Heading with Gradient Text */}
            <h1 
              data-aos="zoom-out-up" 
              data-aos-delay="100"
              className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 font-[family-name:var(--font-poppins)]">
              Alumni <br/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Check-In
              </span>
            </h1>

            {/* Tagline */}
            <p 
              data-aos="fade-up" 
              data-aos-delay="200"
              className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xs mx-auto mb-10 font-normal">
              Freshers&apos; Day 2026 — Welcome Back, Alumni! 🎉
            </p>

            {/* Scroll Indicator Chevron */}
            <a 
              href="#mid" 
              data-aos="fade-up" 
              data-aos-delay="300"
              aria-label="Scroll to highlights"
              className="animate-bounce-chevron inline-flex flex-col items-center gap-1.5 text-slate-400 text-xs font-medium active:scale-95 transition-transform mt-2 py-2">
              <span className="tracking-wide">Explore</span>
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </section>

          {/* ============================================== */}
          {/* SECTION 2: MID / BUILD-UP */}
          {/* ============================================== */}
          <section id="mid" className="py-12 flex flex-col justify-center">
            {/* Build-up Line */}
            <div data-aos="fade-up" className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2 font-[family-name:var(--font-poppins)]">
                Your Legacy Continues
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                Reconnecting batches, celebrating milestones, and inspiring the new generation today.
              </p>
            </div>

            {/* 3 Staggered Icon + Text Pairs */}
            <div className="space-y-4">
              {/* Feature 1 */}
              <div 
                data-aos="fade-up" 
                data-aos-delay="100"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-100 font-[family-name:var(--font-poppins)]">Batch Reunion</h3>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">Meet professors, old friends, and walk familiar halls.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div 
                data-aos="fade-up" 
                data-aos-delay="200"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                  🤝
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-100 font-[family-name:var(--font-poppins)]">Mentor &amp; Connect</h3>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">Share wisdom with the freshers joining our college.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div 
                data-aos="fade-up" 
                data-aos-delay="300"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-100 font-[family-name:var(--font-poppins)]">Instant Check-In</h3>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">Just verify your phone or email for instant entry.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================== */}
          {/* SECTION 3: CTA */}
          {/* ============================================== */}
          <section className="py-14 text-center flex flex-col items-center justify-center">
            <div data-aos="zoom-in" className="w-full">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight font-[family-name:var(--font-poppins)]">
                Ready?
              </h2>
              <p className="text-slate-400 text-sm mb-7">
                Let’s confirm your presence in 3 seconds.
              </p>

              {/* Tap target ≥48px height, rounded-full, gradient, glow, active state */}
              <button 
                id="getYouInBtn"
                onClick={() => router.push('/checkin')}
                className="animate-pulse-glow w-full max-w-xs min-h-[54px] px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg tracking-wide shadow-xl active:scale-95 transition-transform duration-150 inline-flex items-center justify-center gap-3 cursor-pointer">
                <span>Get You In</span>
                <span className="text-xl">🚀</span>
              </button>

              <p className="text-[11px] text-slate-500 mt-4 tracking-wide uppercase font-medium">
                Fast • Mobile-First • Instant Verification
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-4 text-xs text-slate-600 border-t border-white/5">
            College Alumni Relations • Freshers&apos; Day 2026
          </footer>

        </main>
      </div>
    </>
  );
}
