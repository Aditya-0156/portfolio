import { useRef } from 'react';
import Rule from './Rule.jsx';
import Mono from './Mono.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useReveal } from '../hooks/useReveal.js';

/**
 * A ruled section with the sticky mono rail: index label, h2 title, up to three meta lines.
 * Children render in the content column (cols 4 to 12 at desktop). Every [data-reveal]
 * descendant is revealed on scroll by useReveal.
 */
export default function Section({ id, index, title, meta = [], children, className = '', contentClassName = '', rule = true }) {
  const ref = useRef(null);
  const active = useActiveSection() === id;
  const titleId = `${id}-title`;
  useReveal(ref);
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
          <div className={`section__content ${contentClassName}`.trim()}>{children}</div>
        </div>
      </div>
    </section>
  );
}
