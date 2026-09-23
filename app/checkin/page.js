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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-body flex flex-col items-center justify-center p-4 selection:bg-[var(--accent)] selection:text-[var(--text)]">
      
      {/* Back to Home Link */}
      <div className="w-full max-w-sm mb-4 px-1">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-normal text-[var(--muted)] hover:text-[var(--text)] active:opacity-75 transition-colors py-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Event Home</span>
        </Link>
      </div>

      {/* Single Centered Card: max-w-sm mx-auto, padding p-6 */}
      <div className="w-full max-w-sm mx-auto bg-[#101010] rounded-xl p-6 shadow-2xl border border-[var(--hairline)] text-[var(--text)] transition-all">
        
        {!matchedName ? (
          /* FORM VIEW */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block px-2.5 py-1 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium uppercase tracking-wider mb-3">
                Freshers&apos; Day 2026
              </div>
              <h1 className="text-2xl font-bold font-display text-[var(--text)] tracking-tight">
                Alumni Check-In
              </h1>
              <p className="text-xs text-[var(--muted)] mt-1.5 font-normal">
                Enter your details below to verify your presence.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="identifierInput" 
                  className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
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
                  className="w-full min-h-[48px] px-4 rounded-md bg-[#161616] border border-[var(--hairline)] text-[var(--text)] text-base placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Red inline message below input */}
              {errorMessage && (
                <div 
                  className="p-3 rounded-md bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs leading-relaxed flex items-start gap-2.5" 
                  role="alert">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Button: min h-12 (48px+), full width, rounded-md, text-base, active: states */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full min-h-[48px] px-6 py-3 rounded-md bg-[var(--accent)] text-[var(--text)] font-medium text-base shadow-sm active:scale-[0.97] transition-transform duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
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
          <div className="text-center py-4">
            {/* Success Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 text-xs font-medium uppercase tracking-wider mb-3">
              ✓ Verified Attendee
            </div>

            {/* Big Centered Success Confirmation */}
            <h2 className="text-2xl font-bold font-display text-[var(--text)] tracking-tight mb-2">
              Welcome, {matchedName}! 🎉
            </h2>

            <p className="text-xs text-[var(--muted)] leading-relaxed mb-6 px-2 font-normal">
              You are all set and checked in for today&apos;s event. Have an amazing time reconnecting with everyone!
            </p>

            {/* Check in another person button */}
            <button 
              type="button" 
              onClick={handleReset}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-md bg-[#181818] text-[var(--text)] font-medium text-sm border border-[var(--hairline)] active:scale-[0.97] transition-transform duration-150 cursor-pointer"
            >
              Check In Another Person
            </button>
          </div>
        )}

      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-[var(--muted)] opacity-50 mt-6 tracking-wide font-body">
        Alumni Relations • Freshers&apos; Day 2026
      </p>
    </div>
  );
}
