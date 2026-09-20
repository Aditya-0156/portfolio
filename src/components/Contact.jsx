import Section from './Section.jsx';
import CopyEmail from './CopyEmail.jsx';
import Mono from './Mono.jsx';
import './contact.css';

export default function Contact({ content, resumeHref }) {
  const links = [...content.links, { label: content.resume.label, href: resumeHref, external: true }];
  return (
    <Section id="contact" index="08" title={content.title}>
      <CopyEmail
        email={content.email}
        copyLabel={content.copyLabel}
        copiedLabel={content.copiedLabel}
        selectLabel={content.selectLabel}
      />
      <p className="t-body prose contact__statement" data-reveal="">
        {content.statement}
      </p>
      <hr className="rule contact__rule" data-reveal="rule" aria-hidden="true" />
      <ul className="contact__links">
        {links.map((l) => (
          <li key={l.href} data-reveal="">
            <a className="link t-small" href={l.href} target="_blank" rel="noreferrer noopener">
              {l.label}
              <span className="glyph glyph--external" aria-hidden="true">
                {'↗'}
              </span>
              <span className="visually-hidden"> (opens in new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <Mono label dim className="contact__note" data-reveal="">
        Based in Hyderabad, India
      </Mono>
    </Section>
  );
}
