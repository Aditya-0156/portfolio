import { useEffect, useRef } from 'react';

/**
 * The supernova reaching out of the canvas and into the page.
 *
 * A star forges the heavy elements in the shell it throws off, and this does the same thing to
 * the document: as the blast front sweeps outward it paints the text it has already passed,
 * hottest at the centre and cooling toward the front, and leaves the type ahead of it untouched.
 * The wavefront is a radial gradient clipped to the glyphs, so the colour genuinely crosses a
 * word mid-letter rather than switching a whole block at once.
 *
 * The component drives it by calling the returned `report` every frame with the blast centre in
 * viewport pixels and the front radius. Only elements currently on screen are touched, rects are
 * read in one pass before any write, and the whole thing is skipped under reduced motion.
 */
export function useNova(enabled, selector) {
  const api = useRef({ report: () => {} });

  useEffect(() => {
    if (!enabled) return undefined;
    const self = api.current;
    const nodes = new Set();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? nodes.add(e.target) : nodes.delete(e.target))),
      { rootMargin: '10% 0px' },
    );
    const all = Array.from(document.querySelectorAll(selector));
    all.forEach((el) => {
      el.setAttribute('data-forge', '');
      io.observe(el);
    });

    let wasActive = false;
    const rects = [];

    self.report = ({ active, x, y, radius }) => {
      if (!active) {
        if (wasActive) {
          all.forEach((el) => el.classList.remove('is-forging'));
          wasActive = false;
        }
        return;
      }
      const live = Array.from(nodes);
      if (!live.length) return;
      // Read every rect before writing anything, so the loop costs one layout rather than many.
      rects.length = 0;
      for (let i = 0; i < live.length; i++) rects.push(live[i].getBoundingClientRect());
      for (let i = 0; i < live.length; i++) {
        const el = live[i];
        const r = rects[i];
        const s = el.style;
        s.setProperty('--forge-x', `${(x - r.left).toFixed(1)}px`);
        s.setProperty('--forge-y', `${(y - r.top).toFixed(1)}px`);
        s.setProperty('--forge-r', `${radius.toFixed(1)}px`);
        if (!wasActive) el.classList.add('is-forging');
      }
      wasActive = true;
    };

    return () => {
      io.disconnect();
      all.forEach((el) => {
        el.removeAttribute('data-forge');
        el.classList.remove('is-forging');
        el.style.removeProperty('--forge-x');
        el.style.removeProperty('--forge-y');
        el.style.removeProperty('--forge-r');
      });
      self.report = () => {};
    };
  }, [enabled, selector]);

  return api;
}
