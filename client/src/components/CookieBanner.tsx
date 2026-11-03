import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'kv_cookie_consent_v1';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Small delay to make the entrance smooth after page load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in restricted sandboxes
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ type: 'all', timestamp: new Date().toISOString() }));
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ type: 'essential', timestamp: new Date().toISOString() }));
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-surface-container-lowest border border-outline-variant/60 shadow-xl rounded-xl p-5 text-on-surface backdrop-blur-md bg-opacity-95">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-sm">
            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Cookie className="w-4 h-4" />
            </span>
            <span>Cookie Notice &amp; DPDP Act Transparency</span>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 -mr-1 -mt-1 rounded-full cursor-pointer"
            aria-label="Dismiss cookie notice with essential cookies only"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
          We use strictly essential session cookies to remember items in your cart and preserve your secure 256-bit SSL login. In compliance with India&apos;s <strong>DPDP Act, 2023</strong>, we do <em>not</em> sell your browsing data or deploy third-party advertising trackers.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto flex-1 bg-primary hover:bg-secondary text-on-primary text-xs font-semibold py-2.5 px-4 rounded-md transition-colors cursor-pointer text-center"
          >
            Accept All
          </button>
          <button
            onClick={handleEssentialOnly}
            className="w-full sm:w-auto border border-outline-variant/80 hover:bg-surface-container text-on-surface text-xs font-medium py-2.5 px-3 rounded-md transition-colors cursor-pointer text-center"
          >
            Essential Only
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-outline">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-secondary" />
            <span>256-bit SSL Encrypted</span>
          </span>
          <Link
            to="/privacy"
            onClick={() => setIsVisible(false)}
            className="text-secondary hover:underline font-medium"
          >
            Read Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}

