import Mono from '../Mono.jsx';

/** The four fixed decision slots. The depicted slot carries a small ink square. */
export default function SlotRow({ slots, suffix, label = 'Slots' }) {
  return (
    <div className="slots" data-reveal="">
      <Mono label dim className="slots__label">
        {label}
      </Mono>
      <ul className="slots__list">
        {slots.map((s) => (
          <li key={s.time} className={`slots__item t-mono tnum${s.depicted ? ' is-depicted' : ''}`}>
            {s.depicted && <i className="slots__mark" aria-hidden="true" />}
            <span>{s.time}</span>
            {s.label && <span className="slots__sub t-mono-label dim">{s.label}</span>}
          </li>
        ))}
        <li className="slots__item slots__suffix t-mono-label dim">{suffix}</li>
      </ul>
    </div>
  );
}
