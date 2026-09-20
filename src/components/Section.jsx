import { useRef } from 'react';
import Rule from './Rule.jsx';
import Mono from './Mono.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useReveal } from '../hooks/useReveal.js';
import { useSectionCamera } from '../hooks/useSectionCamera.js';
import { voyage } from '../content/voyage.js';

/**
 * A ruled section with the sticky mono rail: index label, h2 title, up to three meta lines.
 * Children render in the content column (cols 4 to 12 at desktop). Every [data-reveal]
 * descendant is revealed on scroll by useReveal.
 */
export default function Section({
  id,
  index,
  title,
  meta = [],
  children,
  className = '',
  contentClassName = '',
  rule = true,
  arrival = false,
}) {
  const ref = useRef(null);
  const active = useActiveSection() === id;
  const titleId = `${id}-title`;
  const station = arrival
    ? voyage.chapters.find((chapter) => chapter.id === id)
    : null;
  useReveal(ref);
  useSectionCamera(ref);
  return (
    <section
      id={id}
      ref={ref}
      className={`section ${className}`.trim()}
      aria-labelledby={titleId}
      data-active={active ? 'true' : 'false'}
      tabIndex={-1}
    >
      {rule && <Rule />}
      {station && (
        <div className="section__arrival wrap" aria-hidden="true">
          <span className="arrival__index t-mono-label">
            {index} / {station.name}
          </span>
          <p className="arrival__line">{station.arrival}</p>
          <span className="arrival__cue t-mono-label">
            {voyage.hint}
            <span>↓</span>
          </span>
        </div>
      )}
      <div className="wrap">
        <div className="grid section__grid">
          <header className="section__rail">
            <Mono label className="section__index" data-reveal="">
              {index} / {title}
            </Mono>
            <h2 id={titleId} className="t-h2 section__title">
              <span className="mask mask--block" data-reveal="mask">
                <span className="mask__inner">{title}</span>
              </span>
            </h2>
            {meta.length > 0 && (
              <ul className="section__meta t-mono tnum">
                {meta.map((m) => (
                  <li key={m} data-reveal="">
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </header>
          <div className={`section__content ${contentClassName}`.trim()}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
