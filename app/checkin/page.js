'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckInPage() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedName, setMatchedName] = useState(null);
  const [matchedDept, setMatchedDept] = useState('');
  const [matchedQuote, setMatchedQuote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState('');

  // Smooth scroll to top when successfully checked in
  useEffect(() => {
    if (matchedName) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [matchedName]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedIdentifier = identifier.trim();
    const trimmedDepartment = department.trim();

    if (!trimmedName || !trimmedIdentifier || !trimmedDepartment) {
      setErrorMessage('Please fill in all fields: Name, Registered Email/Phone, and Department.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: trimmedName,
          identifier: trimmedIdentifier,
          department: trimmedDepartment 
        }),
      });

      const data = await res.json();

      if (res.ok && data.found) {
        setMatchedName(data.name);
        setMatchedDept(data.department || trimmedDepartment);
        setMatchedQuote(data.quote || '');
      } else {
        setErrorMessage(
          data.message || 
          "Details do not match our alumni records. Please make sure your Name, Email/Phone, and Department match exactly."
        );
      }
    } catch (err) {
      console.error('Lookup failed:', err);
      setErrorMessage('Unable to connect to check-in server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setName('');
    setIdentifier('');
    setDepartment('');
    setMatchedName(null);
    setMatchedDept('');
    setMatchedQuote('');
    setErrorMessage('');
    setCardError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDownloadCard() {
    if (cardLoading) return;
    setCardError('');
    setCardLoading(true);

    try {
      const res = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          identifier: identifier.trim(),
          department: department.trim(),
          quote: matchedQuote,
        }),
      });

      if (!res.ok) {
        throw new Error('Card generation failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${matchedName || 'alumni'}-greeting-card.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error('Card download failed:', err);
      setCardError("Couldn't generate your card right now. Please try again.");
    } finally {
      setCardLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-[#FDFDFD] font-body flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#DAA520] selection:text-[#0A192F]">
      
      {/* Back to Home Link */}
      <div className={`w-full mb-4 px-1 transition-all duration-300 ${matchedName ? 'max-w-xl' : 'max-w-md'}`}>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-medium text-[#B0C4DE] hover:text-[#FDFDFD] active:opacity-75 transition-colors py-1.5 tracking-wide"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Event Home</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className={`w-full mx-auto bg-[#0E223D]/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(10,25,47,0.7)] border border-[#DAA520]/25 text-[#FDFDFD] transition-all duration-300 ${matchedName ? 'max-w-xl' : 'max-w-md'}`}>
        
        {!matchedName ? (
          /* FORM VIEW */
          <div>
            <div className="text-center mb-8 sm:mb-9">
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#DAA520]/15 border border-[#DAA520]/30 text-[#F1D78A] text-xs font-semibold uppercase tracking-widest mb-3.5">
                Abhinandan — Freshers Party 2026
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#FDFDFD] tracking-tight">
                Alumni Check-In &amp; Greeting
              </h1>
              <p className="text-xs sm:text-sm text-[#B0C4DE] mt-2 font-normal leading-relaxed opacity-90">
                Welcome back to campus! Enter your details below to check in and receive your personalized welcome card.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label 
                  htmlFor="nameInput" 
                  className="block text-xs font-semibold text-[#B0C4DE] uppercase tracking-wider mb-2.5">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="nameInput"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  autoFocus
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="w-full min-h-[50px] px-4 rounded-xl bg-[#0A192F] border border-[#B0C4DE]/25 text-[#FDFDFD] text-base placeholder-[#B0C4DE]/40 focus:outline-none focus:border-[#DAA520] transition-colors"
                />
              </div>

              <div>
                <label 
                  htmlFor="identifierInput" 
                  className="block text-xs font-semibold text-[#B0C4DE] uppercase tracking-wider mb-2.5">
                  Registered Email or Phone
                </label>
                <input 
                  type="text" 
                  id="identifierInput"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  autoComplete="email tel"
                  inputMode="text"
                  placeholder="Enter your email or phone number"
                  className="w-full min-h-[50px] px-4 rounded-xl bg-[#0A192F] border border-[#B0C4DE]/25 text-[#FDFDFD] text-base placeholder-[#B0C4DE]/40 focus:outline-none focus:border-[#DAA520] transition-colors"
                />
              </div>

              <div>
                <label 
                  htmlFor="departmentSelect" 
                  className="block text-xs font-semibold text-[#B0C4DE] uppercase tracking-wider mb-2.5">
                  Department
                </label>
                <div className="relative">
                  <select
                    id="departmentSelect"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                    className="w-full min-h-[50px] px-4 pr-10 rounded-xl bg-[#0A192F] border border-[#B0C4DE]/25 text-[#FDFDFD] text-base focus:outline-none focus:border-[#DAA520] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0A192F] text-slate-400">Select your department</option>
                    <option value="Dept of Computer Science" className="bg-[#0A192F] text-[#FDFDFD]">Dept of Computer Science</option>
                    <option value="Dept of Commerce and Management" className="bg-[#0A192F] text-[#FDFDFD]">Dept of Commerce and Management</option>
                    <option value="Dept of Hotel Management" className="bg-[#0A192F] text-[#FDFDFD]">Dept of Hotel Management</option>
                    <option value="Dept of Biotechnology" className="bg-[#0A192F] text-[#FDFDFD]">Dept of Biotechnology</option>
                    <option value="Dept of B.Ed" className="bg-[#0A192F] text-[#FDFDFD]">Dept of B.Ed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#DAA520]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div 
                  className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5" 
                  role="alert">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full min-h-[52px] px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#F1D78A] hover:from-[#B89249] hover:to-[#E5C370] text-[#0A192F] font-bold text-base sm:text-lg shadow-lg animate-gold-breathing active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="spinner w-5 h-5" aria-label="Loading" />
                  ) : (
                    <span>Check In</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* SUCCESS VIEW: CLEAN, WHOLESOME GREETING CARD */
          <div className="py-2">
            
            {/* 1. WELCOME MESSAGE HEADER */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Welcome Home, Alumni</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#FDFDFD] tracking-tight mb-2">
                Welcome, {matchedName}! 🎉
              </h2>

              <p className="text-xs sm:text-sm text-[#B0C4DE] leading-relaxed max-w-md mx-auto opacity-95">
                We are delighted to welcome you back for Abhinandan Freshers Party 2026. Here is your commemorative alumni greeting card:
              </p>
            </div>

            {/* 2. THE WHOLESOME ALUMNI GREETING CARD (Clean, spacious, uncrowded) */}
            <div className="relative w-full max-w-[430px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65),0_0_35px_rgba(218,165,32,0.18)] border border-[#DAA520]/45 bg-[#FBF8F2] text-[#0A192F] my-6 transition-all duration-300">
              
              {/* Card Background image artwork */}
              <div 
                className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-95 z-0"
                style={{ backgroundImage: "url('/card-bg.png')" }}
              />

              {/* Card Inner Content Container: Balanced, generous padding away from border notches */}
              <div className="relative z-10 px-7 sm:px-9 pt-14 sm:pt-16 pb-14 sm:pb-16 flex flex-col items-center text-center">
                
                {/* Header Titles */}
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#0A192F] tracking-wide">
                  Abhinandan 2026
                </h3>
                <div className="text-[10px] sm:text-[11px] font-semibold text-[#A37D19] uppercase tracking-[0.22em] mt-1 mb-3.5">
                  Freshers Party • Alumni Homecoming Greeting
                </div>

                {/* Ornamental Gold Divider */}
                <div className="w-full flex items-center justify-center gap-2 mb-4">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#DAA520]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#DAA520]" />
                  <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#DAA520]" />
                </div>

                {/* Attendee Name & Department */}
                <div className="text-xs sm:text-sm text-[#3A5A80] uppercase tracking-wider font-medium">
                  Welcome back home,
                </div>
                <h4 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0A192F] tracking-tight mt-1 leading-tight">
                  {matchedName}
                </h4>
                {matchedDept && (
                  <div className="text-xs sm:text-sm font-bold text-[#A37D19] uppercase tracking-[0.14em] mt-1">
                    {matchedDept}
                  </div>
                )}

                {/* Ornamental Gold Divider */}
                <div className="w-full flex items-center justify-center gap-2 my-4">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#DAA520]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#DAA520]" />
                  <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#DAA520]" />
                </div>

                {/* Inspirational Quote */}
                <div className="px-2 my-0.5">
                  <p className="font-serif italic text-base sm:text-[17px] text-[#0A192F] leading-relaxed">
                    &ldquo;{matchedQuote || "Once part of this campus, always part of its story."}&rdquo;
                  </p>
                </div>

                {/* Heartfelt Wholesome Homecoming Letter */}
                <div className="text-xs sm:text-[13px] text-[#16324F]/90 leading-relaxed px-1 my-2.5 font-normal">
                  <p>
                    Walking back into these corridors brings back the memories, the laughter, and the dreams where it all began. No matter how far your journey takes you, this campus will always be your home, and your footsteps will forever inspire the freshers celebrating Abhinandan today.
                  </p>
                </div>

                {/* Ornamental Gold Divider */}
                <div className="w-full flex items-center justify-center gap-2 my-4">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#DAA520]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#DAA520]" />
                  <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#DAA520]" />
                </div>

                {/* Date & College Sign-off */}
                <div className="text-xs font-semibold text-[#3A5A80] tracking-wide">
                  Sunday, October 25, 2026
                </div>
                <div className="font-serif italic text-xs sm:text-sm text-[#0A192F] mt-1 font-medium">
                  With warmth, pride & best wishes — Your College Family
                </div>

              </div>

            </div>

            {/* 3. ACTION BUTTONS & GUIDANCE */}
            <div className="space-y-3 pt-2 max-w-sm mx-auto">
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={cardLoading}
                className="w-full min-h-[52px] px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#F1D78A] hover:from-[#B89249] hover:to-[#E5C370] text-[#0A192F] font-bold text-sm sm:text-base shadow-lg animate-gold-breathing active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {cardLoading ? (
                  <div className="spinner w-5 h-5" aria-label="Loading" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                    </svg>
                    <span>Download Your Welcome Card (PDF)</span>
                  </>
                )}
              </button>
              
              {cardError && (
                <p className="text-xs text-rose-300 text-center">{cardError}</p>
              )}

              <button 
                type="button" 
                onClick={handleReset}
                className="w-full min-h-[48px] px-6 py-2.5 rounded-full bg-[#0A192F] text-[#FDFDFD] font-medium text-xs sm:text-sm border border-[#B0C4DE]/30 hover:border-[#DAA520]/50 active:scale-[0.97] transition-all duration-150 cursor-pointer"
              >
                Check In Another Person
              </button>
              
              <p className="text-[11px] text-[#B0C4DE] text-center opacity-80 pt-1">
                💡 Tip: You can save this card or download the high-resolution PDF as a keepsake.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Footer on checkin page */}
      <footer className="text-center text-xs text-[#B0C4DE] opacity-80 mt-8 tracking-wide font-body">
        <p>Alumni Relations • Abhinandan Freshers Party 2026</p>
        <p className="text-xs text-[#DAA520] mt-1.5 font-medium tracking-wide">
          Designed and Programmed by Yash
        </p>
      </footer>

    </div>
  );
}
