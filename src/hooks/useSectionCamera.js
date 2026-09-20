import { useLayoutEffect } from 'react';
import { gsap, hasJs, prefersReducedMotion } from '../lib/motion.js';

/**
 * The scroll camera. A section's content arrives slightly small, holds at full size for the whole
 * time it is the thing you are reading, then pulls back as it leaves. The hold is
 * deliberate: text is only ever scaled while it is on its way in or out, never while it is being
 * read, and never faded, so contrast holds at every point of the scroll. Applied to the content
 * column rather than the section so the sticky rail keeps working.
 */
export function useSectionCamera(ref) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !hasJs() || prefersReducedMotion()) return undefined;
    const target = el.querySelector('.section__content');
    if (!target) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      });
      // Scale only. An opacity dip would drop the mono metadata below AA contrast while a
      // section is on its way in or out, so the depth comes from the field behind it instead.
      tl.fromTo(
        target,
        { scale: 0.945, transformOrigin: '50% 50%' },
        { scale: 1, duration: 0.26, ease: 'power2.out' },
      )
        .to(target, { scale: 1, duration: 0.5 })
        .to(target, { scale: 0.972, duration: 0.24, ease: 'power2.in' });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}
