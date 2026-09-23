'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckInPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedName, setMatchedName] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const trimmedInput = identifier.trim();
    if (!trimmedInput) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: trimmedInput }),
      });

      const data = await res.json();

      if (res.ok && data.found) {
        setMatchedName(data.name);
      } else {
        setErrorMessage("We couldn't find your details. Please check with the registration desk.");
      }
    } catch (err) {
      console.error('Lookup failed:', err);
      setErrorMessage('Unable to connect to check-in server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setIdentifier('');
    setMatchedName(null);
    setErrorMessage('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Back to Home Link */}
      <div className="w-full max-w-sm mb-4 px-1">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 active:text-indigo-400 transition-colors py-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Event Home</span>
        </Link>
      </div>

      {/* Single Centered Card: max-w-sm mx-auto, padding p-6 */}
      <div className="w-full max-w-sm mx-auto bg-white/[0.97] dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-slate-800 text-slate-900 dark:text-white transition-all">
        
        {!matchedName ? (
          /* FORM VIEW */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                Freshers&apos; Day 2026
              </div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-slate-900 dark:text-white tracking-tight">
                Alumni Check-In
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your details below to verify your presence.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="identifierInput" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Registered Email or Phone
                </label>
                {/* Controlled Input: min h-12 (48px+), full width, rounded-lg, text-base */}
                <input 
                  type="text" 
                  id="identifierInput"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  autoFocus
                  autoComplete="email tel"
                  inputMode="text"
                  placeholder="Enter your email or phone number"
                  className="w-full min-h-[48px] px-4 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Red inline message below input */}
              {errorMessage && (
                <div 
                  className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs leading-relaxed flex items-start gap-2.5" 
                  role="alert">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Button: min h-12 (48px+), full width, rounded-lg, text-base, active: states */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-base shadow-md active:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75">
                {loading ? (
                  <div className="spinner w-5 h-5" aria-label="Loading" />
                ) : (
                  <span>Check In</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS VIEW (Swapped upon match) */
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              ✓ Verified Attendee
            </div>

            {/* Big Centered Success Confirmation */}
            <h2 className="text-2xl font-extrabold font-[family-name:var(--font-poppins)] text-slate-900 dark:text-white tracking-tight mb-2">
              Welcome, {matchedName}! 🎉
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 px-2">
              You are all set and checked in for today&apos;s event. Have an amazing time reconnecting with everyone!
            </p>

            {/* Check in another person button */}
            <button 
              type="button" 
              onClick={handleReset}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-700 active:bg-slate-200 dark:active:bg-slate-700 active:scale-[0.98] transition-all cursor-pointer">
              Check In Another Person
            </button>
          </div>
        )}

      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-slate-500 mt-6 tracking-wide">
        Alumni Relations • Freshers&apos; Day 2026
      </p>
    </div>
  );
}
