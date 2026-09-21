import { useLayoutEffect, useRef } from 'react';

const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** Each work entry forms once. Its entrance is independent of scroll direction and
 * camera interpolation, so a moving shock front can never pull readable text back. */
export function useNova(enabled, textSelector, surfaceSelector = '') {
  const api = useRef({ report: () => {} });
  const completed = useRef(new WeakSet());

  useLayoutEffect(() => {
    if (!enabled || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined;
    const self = api.current;
    const seen = completed.current;
    const textNodes = [...document.querySelectorAll(textSelector)];
    const surfaces = [...document.querySelectorAll(surfaceSelector)];
    const visibleText = new Set();
    const visibleSurfaces = new Set();
    const animations = new Map();
    const timers = new Map();
    let source = null;

    const resetText = (el) => {
      el.removeAttribute('data-forge');
      el.classList.remove('is-forging');
      el.style.removeProperty('--forge-heat');
      el.style.removeProperty('--forge-cooling');
    };
    const settle = (el) => {
      clearTimeout(timers.get(el));
      timers.delete(el);
      animations.get(el)?.cancel();
      animations.delete(el);
      el.removeAttribute('data-nova-pending');
      el.removeAttribute('data-nova-surface');
      el.style.removeProperty('--nova-heat');
      seen.add(el);
    };
    const enter = (el) => {
      if (seen.has(el) || animations.has(el)) return;
      clearTimeout(timers.get(el));
      timers.delete(el);
      const rect = el.getBoundingClientRect();
      const x = (source?.x ?? innerWidth * 0.8) - (rect.left + rect.width / 2);
      const y = (source?.y ?? innerHeight * 0.4) - (rect.top + rect.height / 2);
      const distance = Math.hypot(x, y) || 1;
      const travel = innerWidth < 600 ? 32 : 52;
      el.setAttribute('data-nova-surface', '');
      el.style.setProperty('--nova-heat', String(source?.energy ?? 0.5));
      // A fixed launch vector and a single monotonic easing: no preparation/retraction phase.
      const animation = el.animate([
        { opacity: 0, translate: `${x / distance * travel}px ${y / distance * travel}px`, scale: '0.975' },
        { opacity: 1, translate: '0px 0px', scale: '1' },
      ], { duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' });
      animations.set(el, animation);
      animation.onfinish = () => settle(el);
    };
    surfaces.forEach((el) => {
      // Never hide text already visible on a restored scroll position or deep link.
      if (seen.has(el) || el.getBoundingClientRect().top < innerHeight) seen.add(el);
      else el.setAttribute('data-nova-pending', '');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (surfaces.includes(target)) {
          if (isIntersecting) {
            visibleSurfaces.add(target);
            if (!seen.has(target) && !animations.has(target)) {
              // Allow the scene to catch up after an anchor jump; content still enters
              // if rendering is unavailable or the camera has already passed the nova.
              timers.set(target, setTimeout(() => enter(target), 220));
            }
          } else {
            visibleSurfaces.delete(target);
            clearTimeout(timers.get(target));
            timers.delete(target);
            if (animations.has(target)) settle(target);
          }
        } else if (isIntersecting) visibleText.add(target);
        else {
          visibleText.delete(target);
          resetText(target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -4% 0px' });
    [...textNodes, ...surfaces].forEach((el) => io.observe(el));
    const focus = (event) => {
      const entry = event.target.closest(surfaceSelector);
      if (entry) settle(entry);
    };
    document.addEventListener('focusin', focus);
    const gate = (event) => {
      if (event.detail?.open) animations.forEach((_, el) => settle(el));
    };
    window.addEventListener('lightgate:change', gate);

    self.report = ({ active, x = 0, y = 0, radius = 0, progress = 0.5, energy = 1 }) => {
      if (!active || !Number.isFinite(x + y + radius)) {
        source = null;
        textNodes.forEach(resetText);
        return;
      }
      source = { x, y, energy };
      const cooling = 1 - smooth((progress - 0.7) / 0.3);
      const width = innerWidth < 600 ? 100 : 170;
      visibleText.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
        const heat = Math.exp(-Math.pow((radius - distance) / width, 2)) * clamp(energy) * cooling;
        el.setAttribute('data-forge', '');
        el.classList.add('is-forging');
        el.style.setProperty('--forge-heat', heat.toFixed(3));
        el.style.setProperty('--forge-cooling', (clamp(energy) * cooling).toFixed(3));
      });
      visibleSurfaces.forEach(enter);
    };
    return () => {
      io.disconnect();
      document.removeEventListener('focusin', focus);
      window.removeEventListener('lightgate:change', gate);
      timers.forEach(clearTimeout);
      surfaces.forEach((el) => {
        if (animations.has(el)) settle(el);
        el.removeAttribute('data-nova-pending');
      });
      textNodes.forEach(resetText);
      self.report = () => {};
    };
  }, [enabled, textSelector, surfaceSelector]);
  return api;
}
