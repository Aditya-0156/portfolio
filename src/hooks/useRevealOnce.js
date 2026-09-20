import { useEffect, useState } from 'react';

/**
 * True once the element has entered the viewport (IntersectionObserver, once).
 * Without IntersectionObserver the content is treated as revealed from the start.
 */
export function useRevealOnce(ref, { rootMargin = '0px 0px -15% 0px', threshold = 0 } = {}) {
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver !== 'function');
  useEffect(() => {
    const el = ref.current;
    if (!el || revealed || typeof IntersectionObserver !== 'function') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, revealed]);
  return revealed;
}
