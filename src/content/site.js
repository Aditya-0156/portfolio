// Site-wide copy: document metadata, navigation and footer.
// Shape from DESIGN_SPEC section 8.1 (site.js). Values from COPY.json meta, nav and footer.
// Mono labels are stored in sentence case; CSS uppercases them.
export default {
  name: 'Aditya Yadav',
  navMark: 'Aditya Yadav',
  title: 'Aditya Yadav, Forward Deployment Engineer',
  description:
    "Forward Deployment Engineer at Cornerstone OnDemand in Hyderabad. I work on Skills Architect, the agent in Cornerstone Workforce AI that reasons over an enterprise's own data, and the Spring Boot services it runs on.",
  ogTitle: 'Aditya Yadav',
  ogDescription:
    'Forward Deployment Engineer at Cornerstone OnDemand. LLM agents, backend services, and applied machine learning. Projects, research, and publications.',
  nav: {
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Projects', href: '#projects' },
      { label: 'Research', href: '#research' },
      { label: 'Contact', href: '#contact' },
    ],
    github: { label: 'GitHub', href: 'https://github.com/Aditya-0156' },
    menuLabel: 'Menu',
    closeLabel: 'Close',
    skipLabel: 'Skip to content',
    // The toggle's label is the theme you will get, not the current one.
    themeLabels: { toLight: 'Light', toDark: 'Dark' },
  },
  footer: {
    spaceNote: 'I wanted to build a 3D portfolio. A journey through space sounded like a fun design challenge. Subtle, I know.',
    colophon: 'This site was designed and built with AI assistance using Claude Code.',
    copyright: '2026 Aditya Yadav',
    topLabel: 'Top',
  },
}
