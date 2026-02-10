export const projects = [
  {
    id: 1,
    title: "RAG Knowledge Base",
    subtitle: "AI-Powered Document Q&A System",
    description: "An advanced RAG (Retrieval-Augmented Generation) system with semantic search capabilities. Features both CLI and web interface for intelligent document querying using vector embeddings and LLM integration.",
    longDescription: "A professional-grade RAG implementation that combines the power of ChromaDB vector database with Google Gemini LLM for accurate, context-aware responses. The system processes documents, creates semantic embeddings, and retrieves relevant information to generate precise answers.",
    technologies: [
      { name: "Python", icon: "🐍", color: "#3776AB" },
      { name: "LangChain", icon: "🦜", color: "#1C3C3C" },
      { name: "ChromaDB", icon: "💾", color: "#FF6B6B" },
      { name: "Google Gemini", icon: "✨", color: "#4285F4" },
      { name: "FastAPI", icon: "⚡", color: "#009688" },
      { name: "React", icon: "⚛️", color: "#61DAFB" },
    ],
    features: [
      "Semantic search with vector embeddings",
      "Document chunking and processing",
      "CLI interface for quick queries",
      "Modern glassmorphism web UI",
      "Real-time document Q&A",
      "Context-aware responses",
    ],
    github: "https://github.com/Aditya-0156/RAG",
    demo: null, // Add live demo URL if available
    image: "/projects/rag-preview.png", // You can add screenshots later
    category: "AI/ML",
    date: "2025-01",
    featured: true,
    stats: {
      stars: "⭐",
      tech: "6+ Technologies",
      type: "Full-Stack"
    }
  },
  // Template for future projects - uncomment and fill in when adding new projects
  /*
  {
    id: 2,
    title: "Your Next Project",
    subtitle: "Brief tagline",
    description: "Short description for card view",
    longDescription: "Detailed description of the project",
    technologies: [
      { name: "Tech1", icon: "🔧", color: "#color" },
      { name: "Tech2", icon: "⚙️", color: "#color" },
    ],
    features: [
      "Feature 1",
      "Feature 2",
    ],
    github: "https://github.com/yourusername/project",
    demo: "https://project-demo.com",
    image: "/projects/project-preview.png",
    category: "Web Development",
    date: "2025-02",
    featured: false,
    stats: {
      stars: "⭐",
      tech: "X Technologies",
      type: "Frontend/Backend/Full-Stack"
    }
  },
  */
];

export const categories = [
  "All",
  "AI/ML",
  "Web Development",
  "Full-Stack",
  "Mobile",
  "DevOps"
];
