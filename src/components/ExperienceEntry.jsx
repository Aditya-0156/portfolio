import DateRange from './DateRange.jsx';

/** Date column plus body: title, org line, optional summary, outcomes, meta lines, stack line. */
export default function ExperienceEntry({ start, end, current = false, title, org, location, summary, outcomes = [], stack = [], meta = [], children }) {
  return (
    <article className="entry split" data-current={current ? 'true' : 'false'}>
      <div className="entry__date">
        <DateRange start={start} end={end} className="entry__date--stacked" />
        <DateRange start={start} end={end} inline className="entry__date--inline" suffix={location ? location.toUpperCase() : null} />
      </div>
      <div className="entry__body">
        <h3 className="t-h3" data-reveal="">
          {title}
        </h3>
        <p className="entry__org t-small" data-reveal="">
          {org}
          {location && <span className="entry__loc"> {'·'} {location}</span>}
        </p>
        {summary && (
          <p className="entry__summary t-body prose" data-reveal="">
            {summary}
          </p>
        )}
        {outcomes.length > 0 && (
          <ul className="entry__outcomes outcomes t-body">
            {outcomes.map((o) => (
              <li key={o} data-reveal="">
                {o}
              </li>
            ))}
          </ul>
        )}
        {meta.map((m) => (
          <p key={m} className="entry__meta t-mono tnum" data-reveal="">
            {m}
          </p>
        ))}
        {stack.length > 0 && (
          <p className="entry__stack stack-line t-mono" data-reveal="">
            {stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        )}
        {children}
      </div>
    </article>
  );
}
