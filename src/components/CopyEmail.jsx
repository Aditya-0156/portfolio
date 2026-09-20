import { useEffect, useRef, useState } from 'react';

/** The h1-sized mailto address with a Copy button; Copied for 1.6 s, Select as the fallback. */
export default function CopyEmail({ email, copyLabel, copiedLabel, selectLabel }) {
  const [state, setState] = useState('idle');
  const addrRef = useRef(null);
  const [user, domain] = email.split('@');

  useEffect(() => {
    if (state !== 'copied') return undefined;
    const t = window.setTimeout(() => setState('idle'), 1600);
    return () => window.clearTimeout(t);
  }, [state]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState('copied');
    } catch {
      setState('select');
      try {
        const range = document.createRange();
        range.selectNodeContents(addrRef.current);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch {
        /* ignore */
      }
    }
  };

  const label = state === 'copied' ? copiedLabel : state === 'select' ? selectLabel : copyLabel;
  return (
    <div className="copy-email">
      <a ref={addrRef} className="copy-email__address t-h1" href={`mailto:${email}`} data-reveal="">
        {user}
        <wbr />@{domain}
      </a>
      <button type="button" className="btn btn--bordered" onClick={onCopy} data-reveal="">
        <span className="btn__label">{label}</span>
      </button>
      <span role="status" aria-live="polite" className="visually-hidden">
        {state === 'copied' ? copiedLabel : ''}
      </span>
    </div>
  );
}
