import { useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import LightGate from './LightGate.jsx';

/**
 * The toggle is still here and still says which theme it would give you. Asking for light opens
 * the gate instead of switching, because this site is a voyage through deep space and the gate
 * would like a word about that first.
 */
export default function ThemeToggle({ labels }) {
  const { theme, toggle } = useTheme();
  const [gateOpen, setGateOpen] = useState(false);
  const btnRef = useRef(null);
  const next = theme === 'light' ? 'dark' : 'light';

  const onClick = (event) => {
    if (next === 'light') setGateOpen(true);
    else toggle(event);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="btn btn--quiet"
        aria-pressed={theme === 'light'}
        aria-haspopup={next === 'light' ? 'dialog' : undefined}
        aria-label={next === 'light' ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={onClick}
      >
        <span className="btn__label">{next === 'light' ? labels.toLight : labels.toDark}</span>
      </button>
      <LightGate open={gateOpen} onClose={() => setGateOpen(false)} returnFocusTo={btnRef} />
    </>
  );
}
