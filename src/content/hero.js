// Hero copy. Shape from DESIGN_SPEC section 8.1 (hero.js). Values from COPY.json hero.
// The component composes the role line as `${role} at ${company}, ${location}`.
// The resume href is a bare file name; it resolves against the page URL under the
// /portfolio/ base path, so no leading slash is stored here.
export default {
  eyebrow: 'LLM agents and backend services',
  name: 'Aditya Yadav',
  role: 'Forward Deployment Engineer',
  company: 'Cornerstone OnDemand',
  location: 'Hyderabad, India',
  statement:
    'I work on Skills Architect, the agent in Cornerstone Workforce AI that reasons over an enterprise\'s own data. Before this I shipped AI document processing at HCLTech and trained a fault localizer for a 400 km optical testbed.',
  ctas: [
    { label: 'See projects', href: '#projects', kind: 'primary' },
    { label: 'GitHub', href: 'https://github.com/Aditya-0156', kind: 'secondary', external: true },
    {
      label: 'Resume (PDF)',
      href: 'Aditya_Yadav_Resume.pdf',
      kind: 'secondary',
      external: true,
      demoteOnPhone: true,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/aditya-yadav-29340b273/',
      kind: 'link',
      external: true,
    },
    { label: 'Email', href: 'mailto:aditya21374@iiitd.ac.in', kind: 'link' },
  ],
}
