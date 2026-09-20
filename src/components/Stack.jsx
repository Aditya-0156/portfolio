import Section from './Section.jsx';
import Mono from './Mono.jsx';
import './stack.css';

function Group({ group }) {
  const inline = group.layout === 'inline';
  return (
    <div className={`stack__group${inline ? ' stack__group--inline' : ''}`}>
      <Mono label dim className="stack__label" data-reveal="">
        {group.label}
      </Mono>
      <hr className="rule stack__rule" data-reveal="rule" aria-hidden="true" />
      <ul className={inline ? 'stack__items stack__items--inline' : 'stack__items'}>
        {group.items.map((item) => {
          const name = typeof item === 'string' ? item : item.name;
          return (
            <li key={name} className={inline ? 't-mono stack__item' : 't-body stack__item'} data-reveal="">
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Stack({ content }) {
  const columns = content.groups.filter((g) => g.layout !== 'inline');
  const rows = content.groups.filter((g) => g.layout === 'inline');
  return (
    <Section id="stack" index="06" title={content.title}>
      <div className="stack__columns">
        {columns.map((g) => (
          <Group key={g.label} group={g} />
        ))}
      </div>
      {rows.map((g) => (
        <Group key={g.label} group={g} />
      ))}
      {content.note && (
        <p className="t-small dim stack__note" data-reveal="">
          {content.note}
        </p>
      )}
    </Section>
  );
}
