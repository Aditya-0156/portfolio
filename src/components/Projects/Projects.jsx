import Section from '../Section.jsx';
import Button from '../Button.jsx';
import Mono from '../Mono.jsx';
import SlotRow from './SlotRow.jsx';
import DecisionTrace from './DecisionTrace.jsx';
import FactGrid from './FactGrid.jsx';
import './projects.css';

function ArchitectureList({ steps }) {
  return (
    <ol className="arch">
      {steps.map((s, i) => (
        <li key={s.label} className="arch__step" data-reveal="">
          <Mono label dim className="arch__index">
            {String(i + 1).padStart(2, '0')}
          </Mono>
          <Mono label className="arch__label">
            {s.label}
          </Mono>
          <p className="arch__text t-body">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

function FlagshipProject({ project, id }) {
  return (
    <article className="flagship" data-surface aria-labelledby={id}>
      <div className="flagship__left">
        <div className="flagship__labels" data-reveal="">
          <Mono label dim>
            {project.label}
          </Mono>
          <Mono label dim>
            {project.year}
          </Mono>
        </div>
        <h3 id={id} className="t-h1 flagship__title" data-reveal="">
          {project.name}
        </h3>
        <p className="t-h3 flagship__tagline" data-reveal="">
          {project.tagline}
        </p>
        <p className="t-body prose flagship__summary" data-reveal="">
          {project.summary}
        </p>
        <ArchitectureList steps={project.how} />
        <div className="flagship__actions" data-reveal="">
          <Button href={project.url} variant="bordered" external>
            {project.repoLabel}
          </Button>
        </div>
        <p className="stack-line t-mono flagship__stack" data-reveal="">
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </p>
      </div>

      <div className="flagship__right">
        <SlotRow slots={project.slots} suffix={project.slotSuffix} />
        <hr className="rule" aria-hidden="true" />
        <DecisionTrace slotLabel={project.trace.slotLabel} caption={project.trace.caption} rows={project.trace.rows} />
        <hr className="rule" aria-hidden="true" />
        <FactGrid items={project.facts} />
      </div>
    </article>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="card">
      <a className="card__link" href={project.url} target="_blank" rel="noreferrer noopener" data-reveal="">
        <div className="card__labels">
          <Mono label dim>
            {project.year}
          </Mono>
          <Mono label dim className="card__stack">
            {project.stack.slice(0, 3).join(' · ')}
          </Mono>
        </div>
        <h3 className="t-h3 card__title">{project.name}</h3>
        <p className="t-small card__tagline">{project.tagline}</p>
        <p className="t-body card__summary">{project.summary}</p>
        <span className="card__cta t-mono-label">
          Repository
          <span className="glyph glyph--external" aria-hidden="true">
            {'↗'}
          </span>
          <span className="visually-hidden"> (opens in new tab)</span>
        </span>
      </a>
    </article>
  );
}

export default function Projects({ content }) {
  return (
    <Section id="projects" index="04" title={content.title} contentClassName="projects__content">
      {content.intro && (
        <p className="t-body prose projects__intro" data-reveal="">
          {content.intro}
        </p>
      )}
      <FlagshipProject project={content.flagship} id="flagship-title" />

      <div className="cards">
        {content.secondary.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>

      <div className="more">
        <Mono label dim className="more__label" data-reveal="">
          {content.moreLabel}
        </Mono>
        <ul className="more__list">
          {content.more.map((m) => (
            <li key={m.url} className="more__item" data-reveal="">
              <a className="more__link" href={m.url} target="_blank" rel="noreferrer noopener">
                <span className="more__name t-body">{m.name}</span>
                <span className="more__note t-small dim">{m.note}</span>
                <span className="glyph glyph--external more__glyph" aria-hidden="true">
                  {'↗'}
                </span>
                <span className="visually-hidden"> (opens in new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
