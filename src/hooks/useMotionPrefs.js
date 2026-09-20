import { useEffect, useState } from 'react';

const QUERIES = {
  reduced: '(prefers-reduced-motion: reduce)',
  isPhone: '(max-width: 599px)',
  hasPointer: '(pointer: fine)',
};

function read() {
  if (typeof matchMedia !== 'function') return { reduced: false, isPhone: false, hasPointer: true };
  return {
    reduced: matchMedia(QUERIES.reduced).matches,
    isPhone: matchMedia(QUERIES.isPhone).matches,
    hasPointer: matchMedia(QUERIES.hasPointer).matches,
  };
}

/** Single source of truth for every motion gate: { reduced, isPhone, hasPointer }. */
export function useMotionPrefs() {
  const [prefs, setPrefs] = useState(read);
  useEffect(() => {
    const lists = Object.values(QUERIES).map((q) => matchMedia(q));
    const update = () => setPrefs(read());
    lists.forEach((l) => l.addEventListener('change', update));
    return () => lists.forEach((l) => l.removeEventListener('change', update));
  }, []);
  return prefs;
}
