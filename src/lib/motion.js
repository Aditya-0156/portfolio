// Shared motion plumbing: GSAP with ScrollTrigger registered once, the Lenis instance,
// reduced-motion detection, and anchor scrolling that respects both.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });

export { gsap, ScrollTrigger };

export const EASE_OUT = 'power3.out';
export const EASE_INOUT = 'power2.inOut';

export function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasJs() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('js');
}

let lenisInstance = null;
export function setLenis(l) {
  lenisInstance = l;
}
export function getLenis() {
  return lenisInstance;
}

/** Scroll to an in-page anchor (href like "#work"), through Lenis when it is running. */
export function scrollToHash(href, { updateHash = true } = {}) {
  if (!href || href[0] !== '#') return false;
  const id = href.slice(1);
  const el = id === 'top' ? document.body : document.getElementById(id);
  if (!el) return false;
  const lenis = getLenis();
  const offset = -72;
  if (lenis) {
    lenis.scrollTo(id === 'top' ? 0 : el, { offset: id === 'top' ? 0 : offset, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else if (id === 'top') {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
  if (updateHash) {
    try {
      history.replaceState(null, '', id === 'top' ? location.pathname + location.search : href);
    } catch {
      /* ignore */
    }
  }
  // Move focus for keyboard and screen-reader users without fighting the smooth scroll.
  if (id !== 'top' && typeof el.focus === 'function') {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  return true;
}
