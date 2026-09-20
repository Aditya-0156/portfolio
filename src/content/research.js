// Research. Shape from DESIGN_SPEC section 8.1 (research.js). Story and publications from COPY.json.
// meta and readouts are derived from DESIGN_SPEC 4.4 (research) and CONTEXT.md.
// Readouts feed the Figure component: `value` is the number it counts up to, `from` is an
// optional starting figure rendered before an arrow (U+2192), `unit` is set as a superior unit,
// `decimals` fixes the printed precision. The Accuracy readout therefore renders as "70 → 95 %".
// Publication titles and author lines are exact from CONTEXT.md and are never truncated.
// Titles are not links; no `href` is supplied.
export default {
  title: 'Research',
  meta: ['BITS-ON Group', 'IIIT-Delhi', 'Jan to Jul 2025'],
  readouts: [
    { value: 400, unit: 'km', label: 'Testbed' },
    { value: 96, label: 'WDM channels' },
    { value: 95, from: 70, unit: '%', label: 'Accuracy' },
    { value: 0.98, decimals: 2, label: 'F1' },
    { value: 8, label: 'Fault classes' },
  ],
  story: {
    title: 'Soft-failure localization on a 400 km optical testbed',
    paragraphs: [
      'At the BITS-ON Research Group at IIIT-Delhi I worked on a C+L band optical testbed: 400 km of fibre carrying 96 WDM channels. The question was whether a model could localize soft failures in the link.',
      'I built a DNN classifier for fault localization across 8 fault classes. The first version reached 70% accuracy. Feature engineering took it to 95% accuracy and 0.98 F1.',
      "The result became a demonstration paper at IEEE ANTS 2025, which won the Best Paper Award in the Demos and Exhibits category. I am also a co-author on the group's earlier quality of transmission paper on the same testbed, published at IEEE ANTS 2024.",
    ],
  },
  publicationsLabel: 'Publications',
  publications: [
    {
      title:
        'Demonstration of Soft-Failure Localization in C+L Band Optical Testbed: A Deep-Learning Assisted Approach',
      authors: 'S. Khan, A. Yadav, P. Sowmendran, S. Krishna S., P. Palai, A. Mitra',
      venue: 'IEEE ANTS 2025',
      year: '2025',
      award: 'Best Paper Award, Demos and Exhibits',
    },
    {
      title:
        'Experimental Investigation over 400 km C+L Band Optical Testbed for Quality of Transmission Estimation Using Machine Learning',
      authors: 'R. K. Jana, S. Krishna S, A. Yadav, P. Palai, A. Mitra, P. Sowmendran, A. Srivastava',
      venue: 'IEEE ANTS 2024',
      year: '2024',
    },
  ],
}
