'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckInPage() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedName, setMatchedName] = useState(null);
  const [matchedDept, setMatchedDept] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#FDFDFD] font-body flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#DAA520] selection:text-[#0A192F] [word-spacing:0.16em]">
      
      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-5 px-1">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-medium text-[#B0C4DE] hover:text-[#FDFDFD] active:opacity-75 transition-colors py-1.5 [word-spacing:0.2em] tracking-wide"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Event Home</span>
        </Link>
      </div>

      {/* Spacious Centered Card: max-w-md with generous padding to prevent congestion */}
      <div className="w-full max-w-md mx-auto bg-[#0E223D] rounded-2xl p-7 sm:p-9 shadow-[0_16px_50px_rgba(10,25,47,0.7)] border border-[#DAA520]/25 text-[#FDFDFD] transition-all">
        
        {!matchedName ? (
          /* FORM VIEW */
          <div>
            {/* Header with increased word spacing */}
            <div className="text-center mb-8 sm:mb-9">
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#DAA520]/15 border border-[#DAA520]/30 text-[#F1D78A] text-xs font-semibold uppercase tracking-widest mb-3.5 [word-spacing:0.22em]">
                Freshers&apos; Day 2026
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#FDFDFD] tracking-tight [word-spacing:0.18em]">
                Alumni Check-In
              </h1>
              <p className="text-xs sm:text-sm text-[#B0C4DE] mt-2 font-normal leading-relaxed [word-spacing:0.18em] opacity-90">
                Enter your details below to verify your presence.
              </p>
            </div>

            {/* Form with expanded vertical spacing (space-y-6 sm:space-y-7) */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
              
              {/* 1. Name Column (Above Email) */}
              <div>
                <label 
                  htmlFor="nameInput" 
                  className="block text-xs font-semibold text-[#B0C4DE] uppercase tracking-wider mb-2.5 [word-spacing:0.2em]">
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
                  className="w-full min-h-[50px] px-4 rounded-xl bg-[#0A192F] border border-[#B0C4DE]/25 text-[#FDFDFD] text-base placeholder-[#B0C4DE]/40 focus:outline-none focus:border-[#DAA520] transition-colors [word-spacing:0.14em]"
                />
              </div>

              {/* 2. Registered Email or Phone */}
              <div>
                <label 
                  htmlFor="identifierInput" 
                  className="block text-xs font-semibold text-[#B0C4DE] uppercase tracking-wider mb-2.5 [word-spacing:0.2em]">
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
                  className="w-full min-h-[50px] px-4 rounded-xl bg-[#0A192F] border border-[#B0C4DE]/25 text-[#FDFDFD] text-base placeholder-[#B0C4DE]/40 focus:outline-none focus:border-[#DAA520] transition-colors [word-spacing:0.14em]"
                />
              </div>

              {/* 3. Department Dropdown (Below Email) */}
              <div>
                <label 
                  htmlFor="departmentSelect" 
                  className="block text-xs font-semibold text-[#B0C4DE] uppercase tracking-wider mb-2.5 [word-spacing:0.2em]">
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
                    className="w-full min-h-[50px] px-4 pr-10 rounded-xl bg-[#0A192F] border border-[#B0C4DE]/25 text-[#FDFDFD] text-base focus:outline-none focus:border-[#DAA520] transition-colors appearance-none cursor-pointer [word-spacing:0.14em]"
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

              {/* Error Message */}
              {errorMessage && (
                <div 
                  className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 [word-spacing:0.16em]" 
                  role="alert">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Button: with breathing gold glow and ample height */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full min-h-[52px] px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#F1D78A] hover:from-[#B89249] hover:to-[#E5C370] text-[#0A192F] font-bold text-base sm:text-lg shadow-lg animate-gold-breathing active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 [word-spacing:0.2em]"
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
          /* SUCCESS VIEW */
          <div className="text-center py-5">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 text-xs font-semibold uppercase tracking-wider mb-3.5 [word-spacing:0.2em]">
              ✓ Verified Attendee
            </div>

            {/* Big Centered Success Confirmation */}
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FDFDFD] tracking-tight mb-2 [word-spacing:0.18em]">
              Welcome, {matchedName}! 🎉
            </h2>

            {matchedDept && (
              <div className="inline-block px-3 py-1 rounded-md bg-[#DAA520]/15 border border-[#DAA520]/30 text-[#F1D78A] text-xs font-medium mb-3 [word-spacing:0.16em]">
                {matchedDept}
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#B0C4DE] leading-relaxed mb-7 px-2 font-normal [word-spacing:0.18em] opacity-90">
              You are all set and checked in for today&apos;s event. Have an amazing time reconnecting with everyone!
            </p>

            {/* Check in another person button */}
            <button 
              type="button" 
              onClick={handleReset}
              className="w-full min-h-[50px] px-6 py-3 rounded-full bg-[#0A192F] text-[#FDFDFD] font-medium text-sm sm:text-base border border-[#B0C4DE]/30 hover:border-[#DAA520]/50 active:scale-[0.97] transition-all duration-150 cursor-pointer [word-spacing:0.18em]"
            >
              Check In Another Person
            </button>
          </div>
        )}

      </div>

      {/* Footer with increased word spacing */}
      <p className="text-center text-xs text-[#B0C4DE] opacity-60 mt-8 tracking-wide font-body [word-spacing:0.22em]">
        Alumni Relations • Freshers&apos; Day 2026
      </p>
    </div>
  );
}
