import { useRef } from 'react';
import Rule from './Rule.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useReveal } from '../hooks/useReveal.js';
import { useSectionCamera } from '../hooks/useSectionCamera.js';

/**
 * An open reading column beside the voyage. The navigation identifies each chapter;
 * a screen-reader heading retains the document outline without a repeated visual rail.
 */
export default function Section({
  id,
  title,
  children,
  className = '',
  contentClassName = '',
  rule = false,
}) {
  const ref = useRef(null);
  const active = useActiveSection() === id;
  const titleId = `${id}-title`;
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
      <h2 id={titleId} className="visually-hidden">
        {title}
      </h2>
      {rule && <Rule />}
      <div className="wrap">
        <div className="section__grid">
          <div className={`section__content ${contentClassName}`.trim()}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
