import Rule from './Rule.jsx';
import { scrollToHash } from '../lib/motion.js';

export default function Footer({ content }) {
  return (
    <footer className="footer-wrap">
      <Rule />
      <div className="wrap footer">
        <p className="footer__space-note t-body">{content.footer.spaceNote}</p>
        <div className="footer__row">
          <div className="footer__group t-mono-label">
            <span>{content.name}</span>
          </div>
          <div className="footer__group t-mono">
            <span className="dim">{content.footer.colophon}</span>
          </div>
          <div className="footer__group footer__group--end t-mono-label">
            <span className="dim">{'©'} {content.footer.copyright}</span>
            <a
              className="footer__link"
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash('#top');
              }}
            >
              {content.footer.topLabel}
              <span className="glyph glyph--up" aria-hidden="true">
                {'↑'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
