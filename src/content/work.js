// Experience. Shape from DESIGN_SPEC section 8.1 (work.js). Values from COPY.json work.
// Dates are ISO year-month strings; end null means present. ExperienceEntry renders
// them as mono lines such as JUN 2026 / TO PRESENT and adds the hidden long form.
export default {
  title: 'Work',
  roles: [
    {
      title: 'Forward Deployment Engineer',
      org: 'Cornerstone OnDemand',
      location: 'Hyderabad, India',
      start: '2026-06',
      end: null,
      current: true,
      summary: 'I work on the Skills Architect Agent, part of the agentic AI layer of Cornerstone Workforce AI.',
      outcomes: [
        "I extended the Skills Architect Agent to reason over an enterprise's own proprietary data, not only Cornerstone's built-in sources.",
        'I take features from design to production in a multi-tenant stack: tenant-isolated schemas, a JWT API gateway and SAML2 SSO.',
      ],
      stack: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'MongoDB', 'ClickHouse', 'Redis'],
    },
    {
      title: 'Software Developer',
      org: 'HCLTech',
      location: 'India',
      start: '2025-08',
      end: '2026-05',
      current: false,
      summary: 'I built and shipped an AI document processing framework on Azure.',
      outcomes: [
        'The framework took over work previously done by hand by a document review team.',
        'I added confidence scoring, hallucination guardrails, and a fault-classification feedback loop that cut edge-case failures by 30% without retraining.',
        'With the QA team I built automated test suites that cut manual testing effort by 60%.',
      ],
      stack: [
        'Python',
        'Flask',
        'Azure OpenAI',
        'GPT-4 Vision',
        'Azure Blob Storage',
        'Azure Document Intelligence',
        'CI/CD',
      ],
    },
    {
      title: 'Research Intern, Machine Learning',
      org: 'BITS-ON Research Group, IIIT-Delhi',
      location: 'New Delhi, India',
      start: '2025-01',
      end: '2025-07',
      current: false,
      summary:
        'I built a deep learning classifier that localizes soft failures on a 400 km C+L band optical testbed carrying 96 WDM channels.',
      outcomes: [
        'Feature engineering took accuracy from 70% to 95%, with 0.98 F1 across 8 fault classes.',
        'The work became a demo paper at IEEE ANTS 2025 and won the Best Paper Award in Demos and Exhibits.',
      ],
      stack: ['Python'],
    },
  ],
}
