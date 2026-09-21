import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Mono from './Mono.jsx';
import { lightGate } from '../content/lightgate.js';
import './lightgate.css';

export default function LightGate({ open, onClose, returnFocusTo }) {
  const [step, setStep] = useState(0);
  const overlayRef = useRef(null);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  const close = useCallback(() => {
    setStep(0);
    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const trigger = returnFocusTo?.current || document.activeElement;
    // The dialog lives outside the app so it can keep focus while the app is inert.
    const background = [...document.body.children]
      .filter(
        (element) =>
          element instanceof HTMLElement && element !== overlayRef.current,
      )
      .map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => {
      element.inert = true;
    });
    document.documentElement.classList.add('light-gate-open');
    window.dispatchEvent(
      new CustomEvent('lightgate:change', { detail: { open: true } }),
    );
    firstRef.current?.focus({ preventScroll: true });

    return () => {
      background.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      document.documentElement.classList.remove('light-gate-open');
      window.dispatchEvent(
        new CustomEvent('lightgate:change', { detail: { open: false } }),
      );
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, returnFocusTo]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Two controls, so the trap is just a swap between them.
      const first = firstRef.current;
      const last = lastRef.current;
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  if (!open) return null;

  const s = lightGate.steps[step];
  const last = step === lightGate.steps.length - 1;

  const onYes = () => {
    if (last) window.location.assign(lightGate.searchUrl);
    else {
      setStep((n) => n + 1);
      firstRef.current?.focus({ preventScroll: true });
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="gate"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        close();
      }}
    >
      <div
        className="gate__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-body"
        data-surface
      >
        <div className="gate__head">
          <Mono label dim>
            {s.label}
          </Mono>
        </div>
        <hr className="rule" aria-hidden="true" />
        <div aria-live="polite" aria-atomic="true">
          <h2 id="gate-title" className="t-h3 gate__title">
            {s.title}
          </h2>
          <p id="gate-body" className="t-body gate__body">
            {s.body}
          </p>
        </div>
        <div className="gate__actions">
          <button
            ref={firstRef}
            type="button"
            className="btn btn--primary"
            onClick={close}
          >
            <span className="btn__label">{s.no}</span>
          </button>
          <button
            ref={lastRef}
            type="button"
            className="btn btn--bordered"
            onClick={onYes}
          >
            <span className="btn__label">{s.yes}</span>
            {last && (
              <span className="visually-hidden">
                {' '}
                ({lightGate.searchDescription})
              </span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
