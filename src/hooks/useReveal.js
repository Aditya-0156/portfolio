import { useLayoutEffect } from 'react';
import {
  gsap,
  ScrollTrigger,
  hasJs,
  prefersReducedMotion,
} from '../lib/motion.js';

/**
 * Scroll reveals for every [data-reveal] descendant of ref:
 *   data-reveal            settles a few pixels as it enters, always fully readable
 *   data-reveal="mask"     settles the wrapper without clipping or hiding its text
 *   data-reveal="rule"     a hairline that draws from the left
 * Everything runs once. Under reduced motion, or without JavaScript, nothing is hidden.
 */
export function useReveal(ref, { y = 8, start = 'top 98%' } = {}) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !hasJs() || prefersReducedMotion()) return undefined;
    // Content already on screen (including restored scroll positions) needs no entrance.
    const all = Array.from(root.querySelectorAll('[data-reveal]')).filter(
      (el) => !el.closest('#work .entry') && el.getBoundingClientRect().top >= window.innerHeight,
    );
    if (!all.length) return undefined;
    const ctx = gsap.context(() => {
      const plain = all.filter(
        (el) => !el.dataset.reveal || el.dataset.reveal === 'mask',
      );
      const rules = all.filter((el) => el.dataset.reveal === 'rule');
      if (plain.length) gsap.set(plain, { y });
      if (rules.length)
        gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });
      if (plain.length)
        ScrollTrigger.batch(plain, {
          start,
          once: true,
          interval: 0.04,
          batchMax: 8,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              duration: 0.36,
              stagger: 0.015,
              ease: 'power2.out',
            }),
        });
      if (rules.length)
        ScrollTrigger.batch(rules, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              scaleX: 1,
              duration: 0.4,
              stagger: 0.025,
              ease: 'power2.out',
            }),
        });
    }, root);
    return () => ctx.revert();
  }, [ref, y, start]);
}
