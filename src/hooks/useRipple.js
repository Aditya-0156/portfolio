import { useEffect, useRef } from 'react';

const PROPERTIES = [
  '--gravity-x',
  '--gravity-y',
  '--gravity-sx',
  '--gravity-sy',
  '--gravity-angle',
  '--gravity-heat',
];

function layoutBox(el) {
  let left = 0,
    top = 0;
  for (let node = el; node; node = node.offsetParent) {
    left += node.offsetLeft;
    top += node.offsetTop;
    if (node !== el) {
      left += node.clientLeft;
      top += node.clientTop;
    }
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

/** The shader and the document share a wave phase and origin. Cached layout positions
 * keep the field stable while CSS individual transforms compose with GSAP's reveals. */
export function useRipple(enabled, selector) {
  const api = useRef({ report: () => {} });
  useEffect(() => {
    if (!enabled || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined;
    const self = api.current;
    const all = [...document.querySelectorAll(selector)],
      visible = new Set(),
      touched = new Set(),
      boxes = new Map();
    let dirty = true,
      disposed = false;
    const reset = (el) => {
      el.removeAttribute('data-ripple');
      PROPERTIES.forEach((property) => el.style.removeProperty(property));
      touched.delete(el);
    };
    const clear = () => touched.forEach(reset);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) visible.add(target);
          else {
            visible.delete(target);
            reset(target);
          }
        });
      },
      { rootMargin: '15% 0px' },
    );
    all.forEach((el) => io.observe(el));
    const invalidate = () => {
      dirty = true;
    };
    const ro = new ResizeObserver(invalidate);
    ro.observe(document.documentElement);
    all.forEach((el) => ro.observe(el));
    window.addEventListener('resize', invalidate);
    document.fonts?.ready.then(() => {
      if (!disposed) invalidate();
    });
    self.report = ({
      active,
      x,
      y,
      amplitude = 0,
      wavelength = 120,
      phase = 0,
      energy = 1,
    }) => {
      if (!active || !Number.isFinite(x + y + amplitude)) {
        clear();
        return;
      }
      if (dirty) {
        all.forEach((el) => boxes.set(el, layoutBox(el)));
        dirty = false;
      }
      const power = Math.max(0, Math.min(1, energy));
      const frames = [...visible].map((el) => {
        const box = boxes.get(el);
        const dx = box.left - scrollX + box.width / 2 - x,
          dy = box.top - scrollY + box.height / 2 - y;
        const distance = Math.hypot(dx, dy) || 1;
        const falloff = 1 / (1 + distance / 680);
        const wave = Math.sin(distance / Math.max(1, wavelength) - phase);
        // Attraction provides an inward arc; the wave alternately stretches and releases it.
        const pull = -power * falloff * (innerWidth < 600 ? 11 : 21);
        const displacement = pull + amplitude * falloff * wave;
        const strain = 0.024 * power * falloff * wave;
        return {
          el,
          x: (dx / distance) * displacement,
          y: (dy / distance) * displacement,
          sx: 1 + strain,
          sy: 1 - strain,
          angle: Math.max(
            -1.05,
            Math.min(1.05, (dx / Math.max(180, distance)) * wave * power * 0.8),
          ),
          heat: Math.abs(wave) * power * falloff,
        };
      });
      frames.forEach((frame) => {
        const { el } = frame;
        el.setAttribute('data-ripple', '');
        const style = el.style;
        style.setProperty('--gravity-x', `${frame.x.toFixed(2)}px`);
        style.setProperty('--gravity-y', `${frame.y.toFixed(2)}px`);
        style.setProperty('--gravity-sx', frame.sx.toFixed(4));
        style.setProperty('--gravity-sy', frame.sy.toFixed(4));
        style.setProperty('--gravity-angle', `${frame.angle.toFixed(3)}deg`);
        style.setProperty('--gravity-heat', frame.heat.toFixed(3));
        touched.add(el);
      });
    };
    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', invalidate);
      clear();
      self.report = () => {};
    };
  }, [enabled, selector]);
  return api;
}
