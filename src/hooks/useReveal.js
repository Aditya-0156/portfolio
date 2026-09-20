import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, hasJs, prefersReducedMotion } from '../lib/motion.js';

/**
 * Scroll reveals for every [data-reveal] descendant of ref:
 *   data-reveal            fades and rises 22 px as it enters (staggered with its neighbours)
 *   data-reveal="mask"     a .mask wrapper whose .mask__inner slides up from below the line
 *   data-reveal="rule"     a hairline that draws from the left
 * Everything runs once. Under reduced motion, or without JavaScript, nothing is hidden.
 */
export function useReveal(ref, { y = 22, start = 'top 88%' } = {}) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !hasJs() || prefersReducedMotion()) return undefined;
    const all = Array.from(root.querySelectorAll('[data-reveal]'));
    if (!all.length) return undefined;
    const ctx = gsap.context(() => {
      const plain = all.filter((el) => !el.dataset.reveal);
      const masks = all.filter((el) => el.dataset.reveal === 'mask').map((el) => el.querySelector('.mask__inner') || el);
      const rules = all.filter((el) => el.dataset.reveal === 'rule');
      if (plain.length) gsap.set(plain, { autoAlpha: 0, y });
      if (masks.length) gsap.set(masks, { yPercent: 110 });
      if (rules.length) gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });
      if (plain.length)
        ScrollTrigger.batch(plain, {
          start,
          once: true,
          batchMax: 8,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.07, ease: 'power3.out' }),
        });
      if (masks.length)
        ScrollTrigger.batch(masks, {
          start,
          once: true,
          onEnter: (batch) => gsap.to(batch, { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out' }),
        });
      if (rules.length)
        ScrollTrigger.batch(rules, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 0.7, stagger: 0.05, ease: 'power2.out' }),
        });
    }, root);
    return () => ctx.revert();
  }, [ref, y, start]);
}
