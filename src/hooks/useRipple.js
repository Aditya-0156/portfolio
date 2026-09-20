import { useEffect, useRef } from 'react';

/**
 * The black hole merger reaching out of the canvas and into the page.
 *
 * A passing gravitational wave stretches space along one axis while squeezing the other, and
 * alternates. This applies exactly that to the blocks of the document: every marked block is
 * displaced and distorted by a travelling wave radiating from the merger, strongest near it and
 * falling off with distance, so the layout itself rings as the wave goes through.
 *
 * Blocks are chosen so they never collide with the reveal animations, which own their own
 * transforms on the text inside. Skipped entirely under reduced motion.
 */
export function useRipple(enabled, selector) {
  const api = useRef({ report: () => {} });

  useEffect(() => {
    if (!enabled) return undefined;
    const self = api.current;
    const nodes = new Set();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? nodes.add(e.target) : nodes.delete(e.target))),
      { rootMargin: '20% 0px' },
    );
    const all = Array.from(document.querySelectorAll(selector));
    all.forEach((el) => {
      el.setAttribute('data-ripple', '');
      io.observe(el);
    });

    let wasActive = false;
    const rects = [];

    self.report = ({ active, x, y, amplitude, wavelength, phase }) => {
      if (!active) {
        if (wasActive) {
          all.forEach((el) => { el.style.transform = ''; el.style.willChange = ''; });
          wasActive = false;
        }
        return;
      }
      const live = Array.from(nodes);
      if (!live.length) return;
      rects.length = 0;
      for (let i = 0; i < live.length; i++) rects.push(live[i].getBoundingClientRect());
      for (let i = 0; i < live.length; i++) {
        const el = live[i];
        const r = rects[i];
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const d = Math.hypot(dx, dy) || 1;
        // A travelling wave: it arrives later the further out you are, and weakens as it goes.
        const s = Math.sin(d / wavelength - phase);
        const falloff = 1 / (1 + d / 520);
        const a = amplitude * falloff;
        const push = a * s;
        // Plus polarisation: one axis stretches while the other squeezes, then they swap.
        const strain = 0.028 * falloff * s;
        if (!wasActive) el.style.willChange = 'transform';
        el.style.transform =
          `translate3d(${((dx / d) * push).toFixed(2)}px, ${((dy / d) * push).toFixed(2)}px, 0) ` +
          `scale(${(1 + strain).toFixed(4)}, ${(1 - strain).toFixed(4)})`;
      }
      wasActive = true;
    };

    return () => {
      io.disconnect();
      all.forEach((el) => {
        el.removeAttribute('data-ripple');
        el.style.transform = '';
        el.style.willChange = '';
      });
      self.report = () => {};
    };
  }, [enabled, selector]);

  return api;
}
