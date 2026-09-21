import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis } from '../lib/motion.js';

/**
 * Smooth scrolling for the whole page. Lenis drives native scroll (window.scrollY stays
 * truthful), GSAP's ticker drives Lenis, and ScrollTrigger updates on every Lenis scroll.
 * Not created under reduced motion.
 */
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      // The dialog owns its native scrolling while the page remains stopped.
      prevent: (node) => node.classList.contains('gate'),
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const gateChange = ({ detail }) => {
      if (detail.open) lenis.stop();
      else lenis.start();
    };
    const onKey = (event) => {
      if (
        lenis.isStopped ||
        lenis.isScrolling !== 'smooth' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        ![
          'ArrowDown',
          'ArrowUp',
          'PageDown',
          'PageUp',
          'Home',
          'End',
          ' ',
        ].includes(event.key) ||
        event.target.closest?.(
          'input, textarea, select, button, [contenteditable="true"]',
        )
      )
        return;
      // End wheel inertia before the browser handles keyboard scrolling itself.
      lenis.scrollTo(window.scrollY, { immediate: true });
    };
    if (document.documentElement.classList.contains('light-gate-open'))
      lenis.stop();
    window.addEventListener('lightgate:change', gateChange);
    window.addEventListener('keydown', onKey);
    let disposed = false;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      disposed = true;
      window.removeEventListener('load', refresh);
      window.removeEventListener('lightgate:change', gateChange);
      window.removeEventListener('keydown', onKey);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}
