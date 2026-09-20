import Section from './Section.jsx';

export default function Now({ content }) {
  return (
    <Section id="now" index={content.index} title={content.title} meta={content.meta}>
      {content.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className="t-lead prose now__p" data-reveal="">
          {p}
        </p>
      ))}
      <p className="stack-line t-mono now__stack" data-reveal="">
        {content.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>
    </Section>
  );
}
