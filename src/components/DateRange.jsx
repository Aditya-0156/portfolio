import { rangeLong, toMono } from '../lib/formatDate.js';

/**
 * Two mono lines (JUN 2026 / TO PRESENT) or one inline line. Screen readers hear the long
 * form ("June 2026 to present"); the visible glyph-free form is aria-hidden.
 */
export default function DateRange({ start, end, inline = false, className = '', suffix = null }) {
  const long = rangeLong(start, end);
  const s = toMono(start);
  const e = end ? toMono(end) : null;
  return (
    <span className={`daterange t-mono tnum ${className}`.trim()}>
      <span className="visually-hidden">
        {long}
        {suffix ? `, ${suffix}` : ''}
      </span>
      {inline ? (
        <span aria-hidden="true">
          <time dateTime={start}>{s}</time> TO {e ? <time dateTime={end}>{e}</time> : 'PRESENT'}
          {suffix ? ` · ${suffix}` : ''}
        </span>
      ) : (
        <span aria-hidden="true">
          <span className="daterange__line">
            <time dateTime={start}>{s}</time>
          </span>
          <span className="daterange__line">TO {e ? <time dateTime={end}>{e}</time> : 'PRESENT'}</span>
        </span>
      )}
    </span>
  );
}
