'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [visibleCards, setVisibleCards] = useState({});
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  // Slow smooth scroll helper function
  const slowSmoothScrollTo = (targetSelector, duration = 1500) => {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // easeInOutCubic for a smooth, slow, cinematic glide
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  // Scroll trigger observer for the cards (alternating side entrance on mobile)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-card-index');
            if (index !== null) {
              setVisibleCards((prev) => ({ ...prev, [index]: true }));
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -40% 0px',
      }
    );

    const refs = [card1Ref.current, card2Ref.current, card3Ref.current];
    refs.forEach((elem) => {
      if (elem) observer.observe(elem);
    });

    return () => {
      refs.forEach((elem) => {
        if (elem) observer.unobserve(elem);
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A192F] text-[#FDFDFD] overflow-x-hidden selection:bg-[#DAA520] selection:text-[#0A192F] font-body">
      
      {/* ======================================================== */}
      {/* BACKGROUND: Watercolor Blue Graph on Deep Navy & InkWashes */}
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

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ======================================================== */}
        {/* 1. TOP BAR */}
        {/* ======================================================== */}
        <header className="w-full px-5 py-5 sm:py-6 max-w-5xl mx-auto flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0E223D]/85 border border-[#DAA520]/25 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-live-dot" />
            <span className="font-display font-medium text-xs sm:text-sm text-[#FDFDFD] tracking-wide">
              FD&apos;26 • Alumni Reunion
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center text-xs text-[#B0C4DE] font-medium px-3.5 py-1 rounded-full bg-[#0E223D]/65 border border-[#B0C4DE]/20">
            Oct 24, 2026
          </div>
        </header>

        {/* ======================================================== */}
        {/* 2. HERO SECTION */}
        {/* ======================================================== */}
        <section className="flex-1 min-h-[85vh] sm:min-h-[88vh] flex flex-col items-center justify-center px-5 sm:px-6 text-center max-w-3xl mx-auto pt-4 pb-12">
          
          {/* Floating Metric Badges */}
          <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center gap-2.5 sm:gap-4 mb-7 flex-wrap select-none">
            <div className="animate-float-a inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E223D]/90 border border-[#DAA520]/35 text-[#F1D78A] text-xs font-medium backdrop-blur-md shadow-[0_2px_12px_rgba(218,165,32,0.12)]">
              <span>🎓</span>
              <span>Batch of &apos;26</span>
            </div>
            <div className="animate-float-b inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E223D]/90 border border-[#B0C4DE]/30 text-[#B0C4DE] text-xs font-medium backdrop-blur-md shadow-[0_2px_12px_rgba(176,196,222,0.12)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-live-dot" />
              <span>Live Check-In</span>
            </div>
            <div className="animate-float-c inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E223D]/90 border border-[#DAA520]/35 text-[#F1D78A] text-xs font-medium backdrop-blur-md shadow-[0_2px_12px_rgba(218,165,32,0.12)]">
              <span>🎟️</span>
              <span>Alumni Honor Pass</span>
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="font-display font-extrabold text-[clamp(2.4rem,8vw,4rem)] text-[#FDFDFD] tracking-tight leading-[1.14] mb-4">
            Relive the Moments.{' '}
            <span className="block mt-1 sm:mt-2 text-[#FDFDFD]">
              Reconnect the Story.
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-[#EDF2F7] font-body text-base sm:text-lg max-w-lg mx-auto font-normal leading-relaxed mb-8 opacity-95">
            Freshers&apos; Day 2026 — Your official pass back to the halls, friendships, and memories where it all began.
          </p>

          {/* Primary CTA Button: Smoothly and slowly scrolls to #checkin-now */}
          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => slowSmoothScrollTo('#checkin-now', 1500)}
              className="group w-full min-h-[54px] px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#F1D78A] hover:from-[#B89249] hover:to-[#E5C370] text-[#0A192F] font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg animate-gold-breathing active:scale-95 transition-all duration-150 cursor-pointer select-none"
            >
              <span>Get Your Pass</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1 font-bold">
                →
              </span>
            </button>
            <span className="text-xs text-[#B0C4DE] font-normal">
              Takes less than 30 seconds
            </span>
          </div>

          {/* Animated Scroll Prompt Indicator */}
          <button
            type="button"
            onClick={() => slowSmoothScrollTo('#highlights', 1000)}
            aria-label="Scroll to highlights section"
            className="mt-12 sm:mt-16 text-[#B0C4DE] hover:text-[#FDFDFD] transition-colors p-2 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-widest text-[#B0C4DE] group-hover:text-[#FDFDFD] font-medium">
              Explore Event
            </span>
            <div className="w-5 h-8 rounded-full border border-[#B0C4DE]/30 flex items-start justify-center p-1 bg-[#0E223D]/50">
              <div className="w-1.5 h-2 rounded-full bg-[#DAA520] animate-subtle-bounce" />
            </div>
          </button>

        </section>

        {/* ======================================================== */}
        {/* 3. HIGHLIGHTS & MEMORIES (Steps Cards with Alternating Mobile Slide) */}
        {/* ======================================================== */}
        <section 
          id="highlights" 
          className="w-full max-w-3xl mx-auto px-5 sm:px-6 py-16 sm:py-24 border-t border-[#DAA520]/20 relative overflow-hidden md:overflow-visible"
        >
          
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#DAA520] block mb-2">
              Smooth Homecoming Experience
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#FDFDFD] tracking-tight">
              Your Fast Track to the Event
            </h2>
            <p className="text-[#EDF2F7] text-sm sm:text-base mt-2 max-w-md mx-auto opacity-90">
              Everything streamlined for instant verification and VIP campus entry.
            </p>
          </div>

          {/* 3 Steps Cards: Mobile Alternating Scroll Trigger (Right -> Left -> Right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: Skip the Line (Mobile: Slides in from the RIGHT) */}
            <div 
              ref={card1Ref}
              data-card-index="0"
              className={`rounded-2xl p-6 sm:p-7 bg-[#222222] border border-[#DAA520]/25 hover:border-[#DAA520]/50 shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out active:scale-[0.98] group flex flex-col justify-between ${
                visibleCards['0']
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : 'opacity-0 translate-x-24 md:translate-x-0 md:translate-y-10'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A192F] border border-[#DAA520]/35 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform duration-200 shadow-inner text-[#F1D78A]">
                  🎓
                </div>
                <div className="text-[11px] font-mono text-[#DAA520] font-semibold uppercase tracking-wider mb-1">
                  Step 01
                </div>
                <h3 className="font-display font-bold text-lg text-[#FDFDFD] mb-2">
                  Skip the Line
                </h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed opacity-90">
                  No paperwork or long queues at the gates. Enter your registered email or phone to confirm attendance in seconds.
                </p>
              </div>
            </div>

            {/* Card 2: Digital Access (Mobile: Slides in from the LEFT) */}
            <div 
              ref={card2Ref}
              data-card-index="1"
              className={`rounded-2xl p-6 sm:p-7 bg-[#222222] border border-[#DAA520]/25 hover:border-[#DAA520]/50 shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out active:scale-[0.98] group flex flex-col justify-between ${
                visibleCards['1']
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : 'opacity-0 -translate-x-24 md:translate-x-0 md:translate-y-10'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A192F] border border-[#DAA520]/35 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform duration-200 shadow-inner text-[#F1D78A]">
                  🎟️
                </div>
                <div className="text-[11px] font-mono text-[#DAA520] font-semibold uppercase tracking-wider mb-1">
                  Step 02
                </div>
                <h3 className="font-display font-bold text-lg text-[#FDFDFD] mb-2">
                  Digital Access Pass
                </h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed opacity-90">
                  Get your custom digital entry badge with instant visual confirmation to show event coordinators.
                </p>
              </div>
            </div>

            {/* Card 3: Alumni Lounge (Mobile: Slides in from the RIGHT) */}
            <div 
              ref={card3Ref}
              data-card-index="2"
              className={`rounded-2xl p-6 sm:p-7 bg-[#222222] border border-[#DAA520]/25 hover:border-[#DAA520]/50 shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out active:scale-[0.98] group flex flex-col justify-between ${
                visibleCards['2']
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : 'opacity-0 translate-x-24 md:translate-x-0 md:translate-y-10'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A192F] border border-[#DAA520]/35 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform duration-200 shadow-inner text-[#F1D78A]">
                  📸
                </div>
                <div className="text-[11px] font-mono text-[#DAA520] font-semibold uppercase tracking-wider mb-1">
                  Step 03
                </div>
                <h3 className="font-display font-bold text-lg text-[#FDFDFD] mb-2">
                  Alumni Lounge
                </h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed opacity-90">
                  Unlock access to the dedicated alumni reunion hub, memory wall photo booths, and priority auditorium seats.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* ======================================================== */}
        {/* 4. ACTION / LAUNCHPAD (Destination for "Get Your Pass" Smooth Scroll) */}
        {/* ======================================================== */}
        <section 
          id="checkin-now" 
          className="w-full max-w-2xl mx-auto px-5 sm:px-6 py-16 sm:py-20 text-center relative border-t border-[#DAA520]/20"
        >
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0E223D]/80 border border-[#DAA520]/30 text-[#F1D78A] text-xs font-medium mb-4 shadow-sm">
            <span>✨</span>
            <span>Welcome Home, Alumni</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#FDFDFD] tracking-tight mb-4">
            Ready to step back in?
          </h2>

          <p className="text-[#EDF2F7] text-sm sm:text-base max-w-md mx-auto mb-8 font-normal leading-relaxed opacity-95">
            Reunite with old professors, share stories with the freshers, and celebrate your enduring college legacy.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/checkin"
              className="group w-full max-w-xs min-h-[56px] px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#F1D78A] hover:from-[#B89249] hover:to-[#E5C370] text-[#0A192F] font-display font-bold text-lg flex items-center justify-center gap-2 shadow-xl animate-gold-breathing active:scale-95 transition-all duration-150 cursor-pointer select-none"
            >
              <span>Check In Now</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1 font-bold">
                →
              </span>
            </Link>

            <p className="text-xs text-[#B0C4DE] font-normal mt-1">
              Takes less than 30 seconds • Instant check-in
            </p>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 5. FOOTER */}
        {/* ======================================================== */}
        <footer className="w-full border-t border-[#DAA520]/15 py-8 px-5 text-center text-xs text-[#B0C4DE] mt-auto">
          <p className="font-medium text-[#B0C4DE]">
            Freshers&apos; Day 2026 • Alumni Relations Committee
          </p>
          <p className="text-[11px] text-[#8EAECF] mt-1">
            Honoring our graduates, reconnecting our community.
          </p>
        </footer>

      </div>

    </div>
  );
}
