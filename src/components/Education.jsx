import Section from './Section.jsx';
import ExperienceEntry from './ExperienceEntry.jsx';

export default function Education({ content }) {
  return (
    <Section id="education" index="07" title={content.title}>
      <ExperienceEntry
        start={content.start}
        end={content.end}
        title={content.degree}
        org={content.school}
        location={content.location}
        meta={[`GPA ${content.gpa}`]}
      >
        {content.profiles && content.profiles.length > 0 && (
          <p className="edu__profiles t-small" data-reveal="">
            {content.profiles.map((p) => (
              <a key={p.href} className="link" href={p.href} target="_blank" rel="noreferrer noopener">
                {p.label}
                <span className="glyph glyph--external" aria-hidden="true">
                  {'↗'}
                </span>
                <span className="visually-hidden"> (opens in new tab)</span>
              </a>
            ))}
          </p>
        )}
      </ExperienceEntry>
    </Section>
  );
}
