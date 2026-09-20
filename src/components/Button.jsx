const GLYPHS = { down: '↓', external: '↗', up: '↑', none: '' };

/**
 * Button or link. variant: primary | bordered | text | quiet. glyph: down | external | up | none.
 * External links open in a new tab with rel="noreferrer noopener" and a hidden note.
 * demoteOnPhone turns a bordered button into a text link under 600 px (CSS).
 */
export default function Button({
  as,
  href,
  variant = 'primary',
  glyph = 'none',
  external = false,
  demoteOnPhone = false,
  block = false,
  onClick,
  children,
  ariaLabel,
  className = '',
  ...rest
}) {
  const Tag = as || (href ? 'a' : 'button');
  const g = external && glyph === 'none' ? 'external' : glyph;
  const cls = ['btn', `btn--${variant}`, demoteOnPhone && 'btn--demote', block && 'btn--block', className].filter(Boolean).join(' ');
  const extra = Tag === 'button' ? { type: 'button' } : {};
  const ext = external ? { target: '_blank', rel: 'noreferrer noopener' } : {};
  return (
    <Tag className={cls} href={href} onClick={onClick} aria-label={ariaLabel} {...extra} {...ext} {...rest}>
      <span className="btn__label">{children}</span>
      {g !== 'none' && (
        <span className={`glyph glyph--${g}`} aria-hidden="true">
          {GLYPHS[g]}
        </span>
      )}
      {external && <span className="visually-hidden"> (opens in new tab)</span>}
    </Tag>
  );
}
