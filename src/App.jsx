import { useMemo } from 'react';
import SkipLink from './components/SkipLink.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Now from './components/Now.jsx';
import Work from './components/Work.jsx';
import Projects from './components/Projects/Projects.jsx';
import Research from './components/Research/Research.jsx';
import Stack from './components/Stack.jsx';
import Education from './components/Education.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { ActiveSectionContext, useActiveSectionObserver } from './hooks/useActiveSection.js';
import { useMotionPrefs } from './hooks/useMotionPrefs.js';
import { useLenis } from './hooks/useLenis.js';

import site from './content/site.js';
import hero from './content/hero.js';
import now from './content/now.js';
import work from './content/work.js';
import projects from './content/projects.js';
import research from './content/research.js';
import stack from './content/stack.js';
import education from './content/education.js';
import contact from './content/contact.js';
import spectrum from './content/spectrum.js';

const SECTION_IDS = ['top', 'now', 'work', 'projects', 'research', 'stack', 'education', 'contact'];
const INDEX_LABELS = {
  top: '01 / INDEX',
  now: '02 / NOW',
  work: '03 / WORK',
  projects: '04 / PROJECTS',
  research: '05 / RESEARCH',
  stack: '06 / STACK',
  education: '07 / EDUCATION',
  contact: '08 / CONTACT',
};

export default function App() {
  const { reduced } = useMotionPrefs();
  useLenis(!reduced);
  const active = useActiveSectionObserver(SECTION_IDS);
  const resumeHref = `${import.meta.env.BASE_URL}${contact.resume.file}`;

  const extraLinks = useMemo(
    () => [
      { label: site.nav.github.label, href: site.nav.github.href, external: true },
      { label: 'LinkedIn', href: contact.links[0].href, external: true },
      { label: 'Email', href: `mailto:${contact.email}` },
      { label: contact.resume.label, href: resumeHref, external: true },
    ],
    [resumeHref],
  );

  return (
    <ActiveSectionContext.Provider value={active}>
      <SkipLink targetId="content" label={site.nav.skipLabel} />
      <Nav content={site} indexLabels={INDEX_LABELS} extraLinks={extraLinks} />
      <main id="content">
        <Hero content={hero} spectrum={spectrum} resumeHref={resumeHref} />
        <Now content={now} />
        <Work content={work} />
        <Projects content={projects} />
        <Research content={research} spectrum={spectrum} />
        <Stack content={stack} />
        <Education content={education} />
        <Contact content={contact} resumeHref={resumeHref} />
      </main>
      <Footer content={site} />
    </ActiveSectionContext.Provider>
  );
}
