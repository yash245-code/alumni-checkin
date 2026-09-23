'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen w-full relative selection:bg-[var(--accent)] selection:text-[var(--text)]">
      
      {/* =================================================== */}
      {/* 1. HERO SECTION */}
      {/* =================================================== */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative">
        
        {/* Wordmark top-left: quiet, single weight, plain text, muted color */}
        <header className="absolute top-0 left-0 w-full px-6 py-6 sm:py-8 flex items-center justify-between pointer-events-none">
          <span className="text-xs sm:text-sm font-body tracking-wider text-[var(--muted)] select-none">
            FD&apos;26
          </span>
        </header>

        {/* Hero Center Content */}
        <div className="max-w-md w-full mx-auto flex flex-col items-center text-center pt-8 pb-4">
          
          {/* Headline: Space Grotesk, bold, sentence case, solid off-white */}
          <h1 className="font-display font-bold text-[clamp(2rem,8vw,3.5rem)] text-[var(--text)] tracking-tight leading-[1.1] text-center">
            Freshers&apos; Day is back.
          </h1>

          {/* Subline: Inter, muted gray, smaller, single line */}
          <p className="font-body text-sm sm:text-base text-[var(--muted)] text-center mt-3 mb-10 sm:mb-12 font-normal">
            October 24, 2026 · Alumni welcome
          </p>

          {/* CENTERPIECE: Animated radar/pulse visual */}
          <div 
            className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center my-2" 
            aria-hidden="true"
          >
            {/* Center subtle core dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-40 z-10" />

            {/* 4 Concentric stroked circles expanding outward */}
            <div className="radar-ring radar-ring-1" />
            <div className="radar-ring radar-ring-2" />
            <div className="radar-ring radar-ring-3" />
            <div className="radar-ring radar-ring-4" />
          </div>

          {/* Static downward-pointing indicator (quiet, no bounce) */}
          <a
            href="#cta"
            aria-label="Scroll to check in section"
            className="mt-10 sm:mt-12 text-[var(--muted)] opacity-60 hover:opacity-100 transition-opacity p-2 inline-flex items-center justify-center"
          >
            <svg 
              className="w-4 h-4 text-[var(--muted)]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>

        </div>
      </section>

      {/* =================================================== */}
      {/* 2. CTA SECTION */}
      {/* =================================================== */}
      <section 
        id="cta" 
        className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center relative border-t border-[var(--hairline)]"
      >
        <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center">
          
          {/* One short line of copy: Inter, muted gray */}
          <p className="font-body text-base sm:text-lg text-[var(--muted)] mb-6 text-center font-normal">
            One tap to check in.
          </p>

          {/* "Get You In" button: rectangular rounded-md, solid #4A4EFF, off-white text, active scale */}
          <button
            type="button"
            onClick={() => router.push('/checkin')}
            className="w-full max-w-xs min-h-[48px] px-6 py-3 rounded-md bg-[var(--accent)] text-[var(--text)] font-body font-medium text-base shadow-sm active:scale-[0.97] transition-transform duration-150 flex items-center justify-center cursor-pointer select-none"
          >
            Get You In
          </button>

          {/* Subtle footer credit */}
          <p className="text-[11px] text-[var(--muted)] opacity-40 mt-12 tracking-wide font-body">
            Alumni Relations • Freshers&apos; Day 2026
          </p>

        </div>
      </section>

    </div>
  );
}
