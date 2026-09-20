import { scrollToHash } from '../lib/motion.js';

/** Inline panel under the bar on phones. No overlay, no focus trap, no scroll lock. */
export default function MobileMenu({ id = 'site-menu', links, extraLinks, open, onClose, activeId }) {
  const onLink = (e, href) => {
    if (href[0] === '#') {
      e.preventDefault();
      scrollToHash(href);
    }
    onClose();
  };
  return (
    <nav id={id} className={`menu wrap${open ? ' is-open' : ''}`} hidden={!open} aria-label="Site sections">
      <ul>
        {links.map((l, i) => (
          <li key={l.href}>
            <a
              className="menu__link"
              href={l.href}
              aria-current={activeId === l.href.slice(1) ? 'true' : undefined}
              onClick={(e) => onLink(e, l.href)}
            >
              <span className="t-mono-label dim">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu__label t-h3">{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <ul className="menu__extra t-small">
        {extraLinks.map((l) => (
          <li key={l.href}>
            <a
              className="link"
              href={l.href}
              onClick={(e) => onLink(e, l.href)}
              {...(l.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
            >
              {l.label}
              {l.external && (
                <>
                  <span className="glyph glyph--external" aria-hidden="true">
                    {'↗'}
                  </span>
                  <span className="visually-hidden"> (opens in new tab)</span>
                </>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
