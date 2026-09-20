const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parts(iso) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return null;
  return { year: m[1], month: parseInt(m[2], 10) - 1 };
}

/** '2026-06' -> 'JUN 2026' (mono, uppercase). */
export function toMono(iso) {
  const p = parts(iso);
  return p ? `${MONTHS_SHORT[p.month]} ${p.year}` : '';
}

/** '2026-06' -> 'June 2026' (for the visually hidden long form). */
export function toLong(iso) {
  const p = parts(iso);
  return p ? `${MONTHS_LONG[p.month]} ${p.year}` : '';
}

/** 'June 2026 to present' or 'August 2025 to May 2026'. */
export function rangeLong(start, end) {
  return `${toLong(start)} to ${end ? toLong(end) : 'present'}`;
}
