import { useEffect, useRef, useState } from 'react';
import Rule from './Rule.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { scrollToHash } from '../lib/motion.js';

/**
 * Fixed 56 px bar: name mark, live section index, section links with aria-current, theme
 * toggle, GitHub, and the phone Menu button. `indexLabels` maps section ids to "02 / Now".
 */
export default function Nav({ content, indexLabels, extraLinks }) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(indexLabels[active] || indexLabels.top);
  const [swapping, setSwapping] = useState(false);
  const btnRef = useRef(null);

  // Live index: a 120 ms opacity dip, then the new label. Both state changes are scheduled so
  // the effect never sets state synchronously.
  useEffect(() => {
    const next = indexLabels[active] || indexLabels.top;
    if (next === shown) return undefined;
    const raf = requestAnimationFrame(() => setSwapping(true));
    const t = window.setTimeout(() => {
      setShown(next);
      setSwapping(false);
    }, 120);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [active, indexLabels, shown]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current && btnRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onAnchor = (e, href) => {
    e.preventDefault();
    scrollToHash(href);
  };

  return (
    <header className="nav">
      <div className="wrap nav__row">
        <a className="nav__mark intro intro--fade" href="#top" onClick={(e) => onAnchor(e, '#top')}>
          {content.navMark}
        </a>
        <span className={`nav__index t-mono tnum${swapping ? ' is-swapping' : ''}`} aria-hidden="true">
          {shown}
        </span>
        <nav className="nav__links" aria-label="Sections">
          {content.nav.links.map((l) => (
            <a
              key={l.href}
              className="nav__link t-small u-draw"
              href={l.href}
              aria-current={active === l.href.slice(1) ? 'true' : undefined}
              onClick={(e) => onAnchor(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__right">
          <ThemeToggle labels={content.nav.themeLabels} />
          <a className="nav__github link t-small" href={content.nav.github.href} target="_blank" rel="noreferrer noopener">
            {content.nav.github.label}
            <span className="glyph glyph--external" aria-hidden="true">
              {'↗'}
            </span>
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <button
            ref={btnRef}
            type="button"
            className="btn btn--quiet nav__menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="btn__label">{open ? content.nav.closeLabel : content.nav.menuLabel}</span>
          </button>
        </div>
      </div>
      <Rule intro draw={false} className="nav__rule" />
      <MobileMenu links={content.nav.links} extraLinks={extraLinks} open={open} onClose={() => setOpen(false)} activeId={active} />
    </header>
  );
}
