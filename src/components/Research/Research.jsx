import { useRef } from 'react';
import Section from '../Section.jsx';
import Mono from '../Mono.jsx';
import { useRevealOnce } from '../../hooks/useRevealOnce.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import './research.css';

function Figure({ value, from, unit, label, decimals = 0, active }) {
  const n = useCountUp(typeof value === 'number' ? value : 0, { from: from ?? 0, active, decimals, duration: 900 });
  const shownFrom = useCountUp(from ?? 0, { from: 0, active, duration: 700 });
  const fmt = (x) => (decimals ? x.toFixed(decimals) : Math.round(x).toString());
  return (
    <div className="readout">
      <span className="readout__value t-readout">
        {from != null && <span className="readout__from">{fmt(shownFrom)} {'→'} </span>}
        {fmt(n)}
        {unit && <span className="unit">{unit}</span>}
      </span>
      <Mono label dim className="readout__label">
        {label}
      </Mono>
    </div>
  );
}

function Publication({ venue, title, authors, award }) {
  return (
    <article className="pub">
      <div className="pub__venue">
        <Mono label dim data-reveal="">
          {venue}
        </Mono>
        {award && (
          <Mono label className="pub__award" data-reveal="">
            <i className="pub__mark" aria-hidden="true" /> Best paper
          </Mono>
        )}
      </div>
      <div className="pub__body">
        <h4 className="t-h3 pub__title" data-reveal="">
          {title}
        </h4>
        <p className="t-small pub__authors" data-reveal="">
          {authors}
        </p>
        {award && (
          <p className="t-small pub__awardline" data-reveal="">
            {award}
          </p>
        )}
      </div>
    </article>
  );
}

export default function Research({ content }) {
  const stripRef = useRef(null);
  const active = useRevealOnce(stripRef, { threshold: 0.4, rootMargin: '0px' });

  return (
    <Section id="research" index="05" title={content.title}>
      <div ref={stripRef} className="readouts" data-reveal="">
        {content.readouts.map((r) => (
          <Figure key={r.label} {...r} active={active} />
        ))}
      </div>

      <hr className="rule research__rule" data-reveal="rule" aria-hidden="true" />

      <h3 className="t-h3 research__title" data-reveal="">
        {content.story.title}
      </h3>
      {content.story.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className="t-body prose research__p" data-reveal="">
          {p}
        </p>
      ))}

      <div className="pubs">
        <Mono label dim className="pubs__label" data-reveal="">
          {content.publicationsLabel}
        </Mono>
        {content.publications.map((p) => (
          <Publication key={p.title} {...p} />
        ))}
      </div>
    </Section>
  );
}
