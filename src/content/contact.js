// Contact. Shape from DESIGN_SPEC section 8.1 (contact.js). Values from COPY.json contact.
// The resume href is composed at render time from the Vite base URL plus `resume.file`;
// only the file name is stored here. Email is a mailto link with copy to clipboard; there is
// no contact form.
export default {
  title: 'Contact',
  meta: ['Hyderabad, India'],
  statement:
    'Email is the best way to reach me. I am based in Hyderabad and open to conversations about agents, backend systems and applied machine learning.',
  email: 'aditya21374@iiitd.ac.in',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  selectLabel: 'Select',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-yadav-29340b273/', external: true },
    { label: 'GitHub', href: 'https://github.com/Aditya-0156', external: true },
    { label: 'LeetCode', href: 'https://leetcode.com/u/aditya21374/', external: true },
    { label: 'Codeforces', href: 'https://codeforces.com/profile/aditya21374', external: true },
  ],
  resume: { label: 'Resume (PDF)', file: 'Aditya_Yadav_Resume.pdf' },
}
