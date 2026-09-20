import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

const easeOut = (u) => 1 - Math.pow(1 - u, 3);

/**
 * Counts from `from` to `value` over `duration` ms once `active` turns true, and returns the
 * current number. Under reduced motion the final value is returned without animating.
 */
export function useCountUp(value, { from = 0, duration = 900, active = true, decimals = 0 } = {}) {
  const [n, setN] = useState(() => (prefersReducedMotion() || typeof value !== 'number' ? value : from));
  useEffect(() => {
    if (!active) return undefined;
    if (prefersReducedMotion() || typeof value !== 'number') {
      let raf = requestAnimationFrame(() => setN(value));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const t0 = performance.now();
    const factor = Math.pow(10, decimals);
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / duration);
      const v = from + (value - from) * easeOut(u);
      setN(Math.round(v * factor) / factor);
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, from, duration, active, decimals]);
  return n;
}
