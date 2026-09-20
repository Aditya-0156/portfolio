// Copy-fit limits, transcribed from DESIGN_SPEC section 8.2. Limits are characters including
// spaces and are hard at phone width. Nothing here truncates anything: src/lib/copyFit.js
// walks the content modules under `import.meta.env.DEV` and `console.warn`s every slot that
// falls outside its limit, naming the slot path and the measured length.
//
// Key grammar (resolved by copyFit against the default exports of the other content files):
//   'hero.statement'              a single string slot
//   'work.roles[].title'          every item of an array, or that key on every item
//   'hero.ctas[kind=link].label'  only items whose `kind` equals `link`
//   'hero.roleLine'               a composed slot: copyFit builds `${role} at ${company}, ${location}`
// Entry fields:
//   min, max     string length bounds (max alone for most slots)
//   count        array length bounds, { min, max }
//   total        { min?, max } bounds on the sum of item lengths across an array (separators excluded)
//   words        exact word count; firstWord: max length of the first word
//   composed     the slot is built by copyFit from other slots (see the key grammar)
//   note         the reason column from the spec, for the warning text
export default {
  // site
  'site.name': { max: 14, note: 'Nav mark one line' },
  'site.navMark': { max: 14, note: 'Nav mark one line' },
  'site.footer.colophon': { max: 80, note: 'Mono row' },
  'site.footer.copyright': { max: 24, note: 'Mono row' },

  // hero
  'hero.eyebrow': { max: 32, note: 'Shares the phone meta row with the clock' },
  'hero.name': { max: 14, words: 2, firstWord: 7, note: '128 px one line at desktop; two lines at 64 px on phone' },
  'hero.role': { max: 32 },
  'hero.company': { max: 24 },
  'hero.location': { max: 20 },
  'hero.roleLine': { max: 72, composed: true, note: 'One line at 22 px desktop, two at 18 px phone' },
  'hero.statement': { min: 120, max: 230, note: 'One or two sentences; three to five lines at 18 px on phone' },
  'hero.cue': { max: 14, note: 'Sits on the fold with a rule beside it' },
  'hero.ctas': { count: { max: 5 } },
  'hero.ctas[kind=primary].label': { max: 12, note: 'Two half-width phone buttons' },
  'hero.ctas[kind=secondary].label': { max: 12, note: 'Two half-width phone buttons' },
  'hero.ctas[kind=link].label': { max: 14, note: 'One link row' },

  // now
  'now.meta': { count: { max: 3 }, note: 'Rail cap of 5 lines' },
  'now.meta[]': { max: 20 },
  'now.paragraphs': { count: { min: 1, max: 2 }, total: { min: 200, max: 380 }, note: 'About six lines at 18 px on phone' },
  'now.stack': { count: { max: 8 }, total: { max: 90 }, note: 'Two mono lines on phone' },

  // work
  'work.roles': { count: { min: 3, max: 3 } },
  'work.roles[].title': { max: 40, note: 'h3, one line desktop' },
  'work.roles[].org': { max: 40 },
  'work.roles[].location': { max: 20 },
  'work.roles[].summary': { min: 80, max: 130, note: 'Optional; one or two lines' },
  'work.roles[].outcomes': { count: { min: 2, max: 4 } },
  'work.roles[].outcomes[]': { min: 80, max: 170, note: 'One sentence; two to three lines at 62ch' },
  'work.roles[].stack': { count: { max: 10 }, total: { max: 110 }, note: 'Two mono lines on phone' },

  // projects
  'projects.intro': { min: 80, max: 140, note: 'Optional; one line desktop' },
  'projects.flagship.name': { max: 12, note: 'h1' },
  'projects.flagship.tagline': { max: 80, note: 'h3 fg-1, two lines' },
  'projects.flagship.summary': { min: 180, max: 300, note: 'Five to six lines in the left half' },
  'projects.flagship.how': { count: { min: 5, max: 5 } },
  'projects.flagship.how[].label': { max: 22 },
  'projects.flagship.how[].text': { min: 90, max: 200, note: 'Aligned list' },
  'projects.flagship.stack': { count: { max: 9 }, total: { max: 110 }, note: 'Mono line under the button' },
  'projects.flagship.slots': { count: { min: 4, max: 4 } },
  'projects.flagship.slots[].time': { max: 5 },
  'projects.flagship.slots[].label': { max: 8 },
  'projects.flagship.trace.slotLabel': { max: 26 },
  'projects.flagship.trace.rows': { count: { min: 8, max: 11 }, note: 'Ledger at 13 px desktop; two-line rows on phone' },
  'projects.flagship.trace.rows[].label': { max: 22 },
  'projects.flagship.trace.rows[].detail': { max: 34 },
  'projects.flagship.facts': { count: { min: 4, max: 4 }, note: '2 x 2' },
  'projects.flagship.facts[].label': { max: 16 },
  'projects.flagship.facts[].value': { max: 30 },
  'projects.secondary': { count: { min: 2, max: 2 }, note: 'Half-width cards' },
  'projects.secondary[].name': { max: 24 },
  'projects.secondary[].tagline': { max: 48 },
  'projects.secondary[].year': { max: 16 },
  'projects.secondary[].summary': { min: 120, max: 280 },
  'projects.secondary[].stack': { count: { max: 5 }, total: { max: 60 } },
  'projects.more': { count: { min: 2, max: 2 } },
  'projects.more[].name': { max: 34 },
  'projects.more[].note': { max: 80 },

  // research
  'research.meta': { count: { max: 3 }, note: 'Rail' },
  'research.meta[]': { max: 16 },
  'research.readouts': { count: { min: 5, max: 5 }, note: 'Strip cells' },
  'research.readouts[].value': { max: 6, note: 'Digits, measured on the printed value' },
  'research.readouts[].unit': { max: 3 },
  'research.readouts[].label': { max: 14 },
  'research.story.title': { max: 64, note: 'h3, two lines' },
  'research.story.paragraphs': { count: { min: 2, max: 3 } },
  'research.story.paragraphs[]': { min: 160, max: 300 },
  'research.publications[].award': { max: 44 },
  // publication.title and publication.authors: exact from CONTEXT, no limit, no truncation.

  // stack
  'stack.groups': { count: { max: 3 } },
  'stack.note': { max: 110, note: 'Optional' },

  // education
  'education.degree': { max: 44 },
  'education.school': { max: 20 },
  'education.location': { max: 20 },
  'education.gpa': { max: 12 },

  // contact
  'contact.statement': { min: 60, max: 160, note: 'One or two sentences; two lines desktop' },
  'contact.links': { count: { max: 5 }, note: 'One row desktop, two per row phone' },
  'contact.links[].label': { max: 14 },

}
