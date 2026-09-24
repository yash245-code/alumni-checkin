'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [visibleCards, setVisibleCards] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const animRef = useRef(null);

  // Smooth scroll: starts moving INSTANTLY on frame 1 without delay, then glides slowly & smoothly to target
  const smoothScrollTo = (targetSelector, duration = 1200) => {
    if (typeof window === 'undefined') return;
    const target = document.querySelector(targetSelector);
    if (!target) return;

    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }

    const startPosition = window.pageYOffset || window.scrollY || 0;
    const targetRect = target.getBoundingClientRect();
    const targetPosition = targetRect.top + startPosition - 20;
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 2) return;

    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic: starts moving immediately on frame 1 (zero dead-start lag), then cushions slowly to target
      const ease = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
      }
    }

    animRef.current = requestAnimationFrame(step);
  };

  // Track scroll position for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="relative min-h-screen bg-transparent text-[#FDFDFD] overflow-x-hidden selection:bg-[#DAA520] selection:text-[#0A192F] font-body flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ======================================================== */}
        {/* 1. TOP BAR */}
        {/* ======================================================== */}
        <header className="w-full px-5 py-5 sm:py-6 max-w-5xl mx-auto flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0E223D]/85 border border-[#DAA520]/25 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-live-dot" />
            <span className="font-display font-medium text-xs sm:text-sm text-[#FDFDFD] tracking-wide">
              Abhinandan &apos;26 • Alumni Greeting Point
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center text-xs text-[#B0C4DE] font-medium px-3.5 py-1 rounded-full bg-[#0E223D]/65 border border-[#B0C4DE]/20">
            Oct 25, 2026
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
              <span>Alumni Homecoming</span>
            </div>
            <div className="animate-float-b inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E223D]/90 border border-[#B0C4DE]/30 text-[#B0C4DE] text-xs font-medium backdrop-blur-md shadow-[0_2px_12px_rgba(176,196,222,0.12)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-live-dot" />
              <span>Live Check-In &amp; Greeting</span>
            </div>
            <div className="animate-float-c inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E223D]/90 border border-[#DAA520]/35 text-[#F1D78A] text-xs font-medium backdrop-blur-md shadow-[0_2px_12px_rgba(218,165,32,0.12)]">
              <span>✨</span>
              <span>Abhinandan 2026</span>
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
            Abhinandan Freshers Party 2026 — Official check-in and greeting point for our cherished alumni. Enter your details to collect your personalized welcome card.
          </p>

          {/* Primary CTA Button: Smoothly and cleanly scrolls to #checkin-now */}
          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => smoothScrollTo('#checkin-now', 1300)}
              className="group w-full min-h-[54px] px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#F1D78A] hover:from-[#B89249] hover:to-[#E5C370] text-[#0A192F] font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg animate-gold-breathing active:scale-95 transition-all duration-150 cursor-pointer select-none"
            >
              <span>Check In &amp; Get Card</span>
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
            onClick={() => smoothScrollTo('#highlights', 900)}
            aria-label="Scroll to highlights section"
            className="mt-12 sm:mt-16 text-[#B0C4DE] hover:text-[#FDFDFD] transition-colors p-2 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-widest text-[#B0C4DE] group-hover:text-[#FDFDFD] font-medium">
              Explore Steps
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
              Alumni Greeting Point
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#FDFDFD] tracking-tight">
              Your Fast Track to Abhinandan
            </h2>
            <p className="text-[#EDF2F7] text-sm sm:text-base mt-2 max-w-md mx-auto opacity-90">
              Welcome back to campus! Follow these 3 easy steps to complete your check-in and claim your welcome card.
            </p>
          </div>

          {/* 3 Steps Cards: Mobile Alternating Scroll Trigger (Right -> Left -> Right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: Enter your info (Mobile: Slides in from the RIGHT) */}
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
                  📝
                </div>
                <div className="text-[11px] font-mono text-[#DAA520] font-semibold uppercase tracking-wider mb-1">
                  Step 01
                </div>
                <h3 className="font-display font-bold text-lg text-[#FDFDFD] mb-2">
                  Enter your info
                </h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed opacity-90">
                  Enter your registered full name, email or phone, and department to quickly verify your attendance in seconds.
                </p>
              </div>
            </div>

            {/* Card 2: Get your welcome card (Mobile: Slides in from the LEFT) */}
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
                  💌
                </div>
                <div className="text-[11px] font-mono text-[#DAA520] font-semibold uppercase tracking-wider mb-1">
                  Step 02
                </div>
                <h3 className="font-display font-bold text-lg text-[#FDFDFD] mb-2">
                  Get your welcome card
                </h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed opacity-90">
                  Receive your custom commemorative digital welcome card featuring a personalized message and PDF download.
                </p>
              </div>
            </div>

            {/* Card 3: Enjoy to the fullest (Mobile: Slides in from the RIGHT) */}
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
                  🎉
                </div>
                <div className="text-[11px] font-mono text-[#DAA520] font-semibold uppercase tracking-wider mb-1">
                  Step 03
                </div>
                <h3 className="font-display font-bold text-lg text-[#FDFDFD] mb-2">
                  Enjoy to the fullest
                </h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed opacity-90">
                  Reconnect with beloved professors, share wisdom and laughter with freshers, and celebrate your enduring legacy at Abhinandan!
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
            Ready to join the celebration?
          </h2>

          <p className="text-[#EDF2F7] text-sm sm:text-base max-w-md mx-auto mb-8 font-normal leading-relaxed opacity-95">
            Reunite with old professors, share stories with the freshers, and celebrate your enduring college legacy at Abhinandan.
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
              Takes less than 30 seconds • Instant welcome card
            </p>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 5. FOOTER */}
        {/* ======================================================== */}
        <footer className="w-full border-t border-[#DAA520]/15 py-8 px-5 text-center text-xs text-[#B0C4DE] mt-auto">
          <p className="font-medium text-[#B0C4DE]">
            Abhinandan • Freshers Party 2026 • Alumni Relations Committee
          </p>
          <p className="text-[11px] text-[#8EAECF] mt-1">
            Official Alumni Check-In &amp; Greeting Point • Honoring our graduates
          </p>
          <p className="text-xs text-[#DAA520] mt-3 font-medium tracking-wide">
            Designed and Programmed by Yash
          </p>
        </footer>

      </div>

      {/* Floating Smooth Scroll Back-to-Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#0E223D]/90 hover:bg-[#0E223D] border border-[#DAA520]/40 text-[#DFBA73] hover:text-[#F1D78A] shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

    </div>
  );
}
