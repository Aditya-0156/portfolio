// Stack. Deliberately short and honestly graded. The groups are about how much of it Aditya
// actually carries, not everything he has ever imported. The last group is set as one quiet
// wrapped line on purpose: it is the least of it, and it should look like the least of it.
export default {
  title: 'Stack',
  note: 'Graded by how much of it I actually carry, not by everything I have imported once.',
  groups: [
    {
      label: 'Every day',
      layout: 'list',
      items: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL'],
    },
    {
      label: 'Comfortable',
      layout: 'list',
      items: ['Python', 'LLM APIs and tool use', 'FastAPI', 'Flask', 'SQL', 'Git', 'Linux'],
    },
    {
      label: 'Have shipped something with, no more than that',
      layout: 'inline',
      items: ['scikit-learn', 'TensorFlow', 'pandas', 'NumPy', 'LangChain', 'ChromaDB', 'MongoDB', 'Redis', 'ClickHouse', 'Docker', 'C/C++', 'JavaFX'],
    },
  ],
}
