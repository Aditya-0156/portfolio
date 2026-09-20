// Hero copy. The hero says what Aditya works on and cares about, not what he shipped at any one
// employer: the specifics of each role live in work.js and the specifics of each project in
// projects.js. The component composes the role line as `${role} at ${company}, ${location}`.
// The resume href is a bare file name; it resolves against the /portfolio/ base path.
export default {
  eyebrow: 'Applied machine learning',
  name: 'Aditya Yadav',
  role: 'Forward Deployment Engineer',
  company: 'Cornerstone OnDemand',
  location: 'Hyderabad, India',
  statement:
    'I work on machine learning and language models, and on the part people skip: making them hold up inside real software. The model is rarely the hard part. The system around it is.',
  cue: 'Scroll',
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
