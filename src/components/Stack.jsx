import Section from './Section.jsx';
import Mono from './Mono.jsx';
import './stack.css';

export default function Stack({ content }) {
  return (
    <Section id="stack" index="06" title={content.title}>
      <div className="stack__groups">
        {content.groups.map((g) => (
          <div key={g.label} className="stack__group">
            <Mono label dim className="stack__label" data-reveal="">
              {g.label}
            </Mono>
            <hr className="rule stack__rule" data-reveal="rule" aria-hidden="true" />
            <ul className="stack__items">
              {g.items.map((item) => {
                const name = typeof item === 'string' ? item : item.name;
                return (
                  <li key={name} className="t-body stack__item" data-reveal="">
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {content.note && (
        <p className="t-small dim stack__note" data-reveal="">
          {content.note}
        </p>
      )}
    </Section>
  );
}
