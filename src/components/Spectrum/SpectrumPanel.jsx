import { useCallback, useMemo, useRef, useState } from 'react';
import SpectrumCanvas from './SpectrumCanvas.jsx';
import Rule from '../Rule.jsx';
import { createSpectrum } from '../../lib/spectrumModel.js';
import './spectrum.css';

/**
 * The figure around the canvas: caption row (left caption, live hover readout, fault readout),
 * the canvas, and the axis row. The canvas itself is aria-hidden; everything a reader needs is
 * in the DOM, so the page is complete without JavaScript.
 */
export default function SpectrumPanel({
  canvasRef,
  mode = 'live',
  content,
  isPhone = false,
  className = '',
  figureRef,
  showRule = true,
}) {
  const model = useMemo(
    () => createSpectrum({ seed: content.seed, channels: content.channels, faultChannel: content.faultChannel }),
    [content.seed, content.channels, content.faultChannel],
  );
  const [hover, setHover] = useState(null);
  const lastRef = useRef(null);
  const onChannelHover = useCallback((ch) => {
    if (ch === lastRef.current) return;
    lastRef.current = ch;
    setHover(ch);
  }, []);

  const caption = mode === 'static' ? content.figureCaption : content.captionLeft;
  const captionShort = mode === 'static' ? content.figureCaptionShort : content.captionLeftShort;
  const band = hover != null ? model.bandOf(hover) : null;

  const ticks = isPhone
    ? [
        { at: 0, label: '01', cls: 'first' },
        { at: 0.5 - 0.0175, label: 'C', cls: 'band' },
        { at: 0.5 + 0.0175, label: 'L', cls: 'band' },
        { at: 1, label: '96', cls: 'last' },
      ]
    : [
        { at: 0, label: 'CH 01', cls: 'first' },
        { at: model.channelX(15), label: '16', cls: 'minor' },
        { at: model.channelX(31), label: '32', cls: 'minor' },
        { at: model.gapLeft, label: '48', cls: 'last' },
        { at: 0.5, label: 'C | L', cls: 'band' },
        { at: model.gapRight, label: '49', cls: 'first' },
        { at: model.channelX(63), label: '64', cls: 'minor' },
        { at: model.channelX(79), label: '80', cls: 'minor' },
        { at: 1, label: '96', cls: 'last' },
      ];

  return (
    <figure ref={figureRef} className={`spectrum spectrum--${mode} ${className}`.trim()} aria-label={content.ariaLabel}>
      {showRule && <Rule intro={mode === 'live'} draw={mode !== 'live'} className="spectrum__rule" />}
      <div className="spectrum__caption t-mono-label">
        <span className="spectrum__cap spectrum__cap--long">{caption}</span>
        <span className="spectrum__cap spectrum__cap--short">{captionShort}</span>
        <output className="spectrum__hover" aria-live="off">
          {hover != null ? `CH ${String(hover + 1).padStart(2, '0')} · ${band}` : ''}
        </output>
        <span className="spectrum__fault">
          <i className="mark" aria-hidden="true" /> CH {content.faultChannel}{' '}
          <span className="accent-word">{content.faultLabel}</span>
        </span>
      </div>
      <SpectrumCanvas ref={canvasRef} mode={mode} model={model} onChannelHover={mode === 'live' ? onChannelHover : undefined} isPhone={isPhone} />
      <figcaption className="spectrum__axis t-mono tnum">
        <span className="spectrum__ticks" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t.label + t.at} className={`spectrum__tick spectrum__tick--${t.cls}`} style={{ left: `${t.at * 100}%` }}>
              {t.label}
            </span>
          ))}
        </span>
        <span className="spectrum__ylabel">REL. POWER</span>
        <span className="visually-hidden">{content.ariaLabel}</span>
      </figcaption>
    </figure>
  );
}
