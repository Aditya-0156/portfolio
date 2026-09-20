import { useTheme } from '../hooks/useTheme.js';

/** A plain button whose label is the theme you will get. */
export default function ThemeToggle({ labels }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      type="button"
      className="btn btn--quiet"
      aria-pressed={theme === 'light'}
      aria-label={`Switch to ${next} theme`}
      onClick={toggle}
    >
      <span className="btn__label">{next === 'light' ? labels.toLight : labels.toDark}</span>
    </button>
  );
}
