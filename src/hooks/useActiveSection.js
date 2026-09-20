import { createContext, useContext, useEffect, useState } from 'react';

export const ActiveSectionContext = createContext('top');

/** Read the id of the section currently in the middle of the viewport. */
export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

/**
 * Observe the given section ids and return the active one. A section is active while it
 * crosses the horizontal line at 50% of the viewport height. Used once, in App.
 */
export function useActiveSectionObserver(ids) {
  const [active, setActive] = useState(ids[0] || 'top');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver !== 'function') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
