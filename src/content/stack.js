// Stack. Shape from DESIGN_SPEC section 8.1 (stack.js). Values from COPY.json stack.
// Plain grouped lists: no percentages, no bars. Items are plain strings here; the shape also
// allows { name, sub: [string] } for sub-items, unused for now.
export default {
  title: 'Stack',
  note: 'Grouped by how often I use each one.',
  groups: [
    {
      label: 'Daily',
      items: [
        'Java',
        'Spring Boot',
        'React',
        'TypeScript',
        'PostgreSQL',
        'MongoDB',
        'ClickHouse',
        'Redis',
        'LLM agents and tool use',
      ],
    },
    {
      label: 'Strong',
      items: [
        'Python',
        'scikit-learn',
        'TensorFlow/Keras',
        'pandas',
        'NumPy',
        'Claude API',
        'Azure OpenAI',
        'LangChain',
        'ChromaDB',
        'RAG',
        'Flask',
        'FastAPI',
        'SQL',
        'SQLite',
        'Git',
        'Linux',
        'CI/CD',
      ],
    },
    {
      label: 'Used before',
      items: ['C/C++', 'PyTorch', 'Hugging Face', 'Docker', 'JavaFX'],
    },
  ],
}
