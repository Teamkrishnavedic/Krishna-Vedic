import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop:
 * Automatically resets scroll position to the top (0, 0) on every route navigation.
 * Disables manual browser scroll restoration to ensure every page (Shop, Contact, Login, etc.)
 * starts from the top rather than retaining the bottom scroll position of the previous page.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable native browser scroll restoration so React Router starts pages at the top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // If navigating to an in-page anchor tag (e.g., #reviews), smoothly scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // 1. Instant reset before paint
    resetScroll();

    // 2. Immediate next animation frame
    const rafId = requestAnimationFrame(resetScroll);

    // 3. Fallback ticks to handle any async component mounting or framer-motion page transitions
    const t1 = setTimeout(resetScroll, 60);
    const t2 = setTimeout(resetScroll, 280);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search, hash]);

  return null;
}
