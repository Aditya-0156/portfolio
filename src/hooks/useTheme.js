import { useCallback, useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

const readTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function apply(next) {
  document.documentElement.dataset.theme = next;
  // Canvases listen for this and redraw synchronously, so a View Transition snapshot is correct.
  window.dispatchEvent(new CustomEvent('theme:change', { detail: next }));
}

/**
 * { theme, toggle(event) }. The switch is a circle that grows from the toggle button through
 * the View Transitions API; browsers without it get a 300 ms colour transition. The site is dark
 * and stays dark: nothing here follows the operating system, and the light mode button opens an
 * argument rather than a theme.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    // No OS listener: the site is dark, and the toggle is a conversation rather than a switch.
    const onExternal = (e) => setTheme(e.detail === 'light' ? 'light' : 'dark');
    window.addEventListener('theme:change', onExternal);
    return () => window.removeEventListener('theme:change', onExternal);
  }, []);

  const toggle = useCallback((event) => {
    const root = document.documentElement;
    const next = readTheme() === 'light' ? 'dark' : 'light';
    const run = () => {
      apply(next);
      setTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* ignore */
      }
    };
    const reduced = prefersReducedMotion();
    if (typeof document.startViewTransition === 'function' && !reduced) {
      // Origin of the circle: the pointer, or the centre of the button for keyboard activation.
      let x = window.innerWidth - 40;
      let y = 28;
      const target = event && event.currentTarget;
      if (event && typeof event.clientX === 'number' && event.detail > 0) {
        x = event.clientX;
        y = event.clientY;
      } else if (target && typeof target.getBoundingClientRect === 'function') {
        const r = target.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const transition = document.startViewTransition(run);
      transition.ready
        .then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 560, easing: 'cubic-bezier(0.2, 0, 0, 1)', pseudoElement: '::view-transition-new(root)' },
          );
        })
        .catch(() => {
          /* the transition was skipped; the theme is already applied */
        });
    } else {
      root.classList.add('theme-transition');
      run();
      window.setTimeout(() => root.classList.remove('theme-transition'), 300);
    }
  }, []);

  return { theme, toggle };
}
