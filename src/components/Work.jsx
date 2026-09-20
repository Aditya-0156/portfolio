import Section from './Section.jsx';
import ExperienceEntry from './ExperienceEntry.jsx';

export default function Work({ content }) {
  return (
    <Section id="work" index="03" title={content.title} arrival>
      {content.roles.map((r) => (
        <ExperienceEntry
          key={r.org + r.start}
          start={r.start}
          end={r.end}
          current={r.current}
          title={r.title}
          org={r.org}
          location={r.location}
          summary={r.summary}
          outcomes={r.outcomes}
          stack={r.stack}
        />
      ))}
    </Section>
  );
}
