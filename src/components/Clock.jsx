import { useEffect, useMemo, useState } from 'react';

/** HH:MM in a time zone, ticking on the minute. Owns its timer so nothing else re-renders. */
export default function Clock({ timeZone = 'Asia/Kolkata', suffix = 'IST', city = 'Hyderabad', offset = '+05:30', className = '' }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let interval = 0;
    const align = window.setTimeout(
      () => {
        setNow(new Date());
        interval = window.setInterval(() => setNow(new Date()), 60000);
      },
      60000 - (Date.now() % 60000) + 40,
    );
    return () => {
      window.clearTimeout(align);
      window.clearInterval(interval);
    };
  }, []);
  const fmt = useMemo(
    () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }),
    [timeZone],
  );
  const iso = useMemo(
    () => new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZone }),
    [timeZone],
  );
  const hhmm = fmt.format(now);
  const dateTime = `${iso.format(now).replace(' ', 'T')}${offset}`;
  return (
    <time className={`t-mono tnum dim ${className}`.trim()} dateTime={dateTime} aria-label={`Current time in ${city}, ${hhmm} India Standard Time`}>
      {hhmm} {suffix}
    </time>
  );
}
