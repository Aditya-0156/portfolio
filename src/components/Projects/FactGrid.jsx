import Mono from '../Mono.jsx';

/** Two by two facts: mono label over a value. */
export default function FactGrid({ items }) {
  return (
    <dl className="facts">
      {items.map((f) => (
        <div key={f.label} className="facts__cell" data-reveal="">
          <dt>
            <Mono label dim>
              {f.label}
            </Mono>
          </dt>
          <dd className="facts__value t-small">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
