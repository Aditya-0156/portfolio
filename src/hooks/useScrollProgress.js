import { useEffect } from 'react';

/**
 * Reports scroll progress 0..1 from the top of the page to the moment endRef's top edge meets
 * the nav's bottom edge (56 px). onProgress is called from a rAF-throttled scroll listener and
 * must not set React state. Pass enabled=false to never create the listener (reduced motion).
 */
export function useScrollProgress(endRef, onProgress, enabled = true) {
  useEffect(() => {
    const el = endRef.current;
    if (!el || !enabled) return undefined;
    let end = 1;
    let ticking = false;
    let last = -1;
    const measure = () => {
      end = Math.max(1, el.getBoundingClientRect().top + window.scrollY - 56);
    };
    const frame = () => {
      ticking = false;
      const p = Math.min(1, Math.max(0, window.scrollY / end));
      if (p !== last) {
        last = p;
        onProgress(p);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    measure();
    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
      frame();
    });
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [endRef, onProgress, enabled]);
}
