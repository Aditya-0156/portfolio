import { useCallback, useEffect, useRef, useState } from 'react';
import Mono from './Mono.jsx';
import './lightgate.css';

// Three attempts, each with a real reason the sky is black. Say no at any point and it closes.
// Say yes three times and the argument is escalated to a higher authority.
const STEPS = [
  {
    label: 'Light mode request',
    title: 'Are you sure?',
    body: 'This site is a voyage through deep space. In light mode it would be a voyage through a well lit office.',
    no: 'Fair enough, stay dark',
    yes: 'I am sure',
  },
  {
    label: 'Light mode request, second attempt',
    title: 'Space is dark.',
    body: 'The cosmic microwave background sits at 2.7 kelvin. That is the temperature of the lights being off, everywhere, since the beginning.',
    no: 'Alright, stay dark',
    yes: 'Still sure',
  },
  {
    label: 'Light mode request, third attempt',
    title: 'Olbers had a paradox about this.',
    body: 'If the universe were infinite and eternal, every line of sight would end on a star and the whole sky would be white. It is not white. The darkness is the evidence.',
    no: 'Okay, you win',
    yes: 'I still want light mode',
  },
];

const VERDICT = 'https://www.google.com/search?q=is+space+light+or+dark';

/**
 * The light mode gate. The toggle stays where it is, but asking for light opens this instead of
 * switching the theme, and the argument escalates. It is a dialog inside the page, themed like
 * everything else, not a browser prompt.
 */
export default function LightGate({ open, onClose, returnFocusTo }) {
  const [step, setStep] = useState(0);
  const panelRef = useRef(null);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  const close = useCallback(() => {
    setStep(0);
    onClose();
    const btn = returnFocusTo && returnFocusTo.current;
    if (btn) btn.focus();
  }, [onClose, returnFocusTo]);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => firstRef.current && firstRef.current.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      // Two controls, so the trap is just a swap between them.
      const first = firstRef.current;
      const last = lastRef.current;
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  if (!open) return null;

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  const onYes = () => {
    if (last) window.location.href = VERDICT;
    else setStep((n) => n + 1);
  };

  return (
    <div className="gate" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div
        className="gate__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-body"
        ref={panelRef}
        data-surface
      >
        <div className="gate__head">
          <Mono label dim>{s.label}</Mono>
          <Mono label dim className="gate__count">{step + 1} / {STEPS.length}</Mono>
        </div>
        <hr className="rule" aria-hidden="true" />
        <h2 id="gate-title" className="t-h3 gate__title">{s.title}</h2>
        <p id="gate-body" className="t-body gate__body">{s.body}</p>
        <div className="gate__actions">
          <button ref={firstRef} type="button" className="btn btn--primary" onClick={close}>
            <span className="btn__label">{s.no}</span>
          </button>
          <button ref={lastRef} type="button" className="btn btn--bordered" onClick={onYes}>
            <span className="btn__label">{s.yes}</span>
            {last && (
              <>
                <span className="glyph glyph--external" aria-hidden="true">{'↗'}</span>
                <span className="visually-hidden"> (searches the web for whether space is light or dark)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
