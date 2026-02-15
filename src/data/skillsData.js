export const skills = {
  "Programming Languages": [
    { name: "Python", level: 85, icon: "🐍", color: "#3776AB" },
    { name: "Java", level: 55, icon: "☕", color: "#007396" },
    { name: "C/C++", level: 50, icon: "⚙️", color: "#00599C" },
    { name: "SQL", level: 60, icon: "🗃️", color: "#4479A1" },
    { name: "JavaScript", level: 35, icon: "💛", color: "#F7DF1E" },
    { name: "HTML/CSS", level: 35, icon: "🌐", color: "#E34F26" },
  ],
  "ML/AI & Data Science": [
    { name: "Scikit-learn", level: 80, icon: "📈", color: "#F7931E" },
    { name: "TensorFlow / Keras", level: 70, icon: "🧠", color: "#FF6F00" },
    { name: "Pandas / NumPy", level: 80, icon: "🐼", color: "#150458" },
    { name: "Deep Learning", level: 65, icon: "🔬", color: "#8B5CF6" },
    { name: "PyTorch", level: 45, icon: "🔥", color: "#EE4C2C" },
    { name: "NLP", level: 50, icon: "💬", color: "#10B981" },
    { name: "Hugging Face", level: 50, icon: "🤗", color: "#FFD21E" },
    { name: "Matplotlib", level: 70, icon: "📉", color: "#11557C" },
  ],
  "AI-Integrated Development": [
    { name: "Azure OpenAI + GPT-4", level: 75, icon: "☁️", color: "#0078D4" },
    { name: "LangChain", level: 55, icon: "🦜", color: "#1C3C3C" },
    { name: "ChromaDB", level: 50, icon: "💾", color: "#FF6B6B" },
    { name: "Google Gemini", level: 45, icon: "💎", color: "#4285F4" },
    { name: "Claude Code / Cursor", level: 80, icon: "🤖", color: "#FF6B6B" },
  ],
  "Backend & APIs (AI-Assisted)": [
    { name: "Flask", level: 55, icon: "⚗️", color: "#000000" },
    { name: "FastAPI", level: 45, icon: "⚡", color: "#009688" },
    { name: "REST APIs", level: 60, icon: "🔌", color: "#FF6C37" },
  ],
  "Tools & Platforms": [
    { name: "Git / GitHub", level: 75, icon: "🔀", color: "#F05032" },
    { name: "Linux", level: 65, icon: "🐧", color: "#FCC624" },
    { name: "CI/CD", level: 50, icon: "🔄", color: "#2088FF" },
    { name: "Docker", level: 35, icon: "🐳", color: "#2496ED" },
    { name: "Agile/Scrum", level: 60, icon: "📋", color: "#0052CC" },
  ],
  "Frontend (AI does the heavy lifting 😉)": [
    { name: "React", level: 30, icon: "⚛️", color: "#61DAFB" },
    { name: "Tailwind CSS", level: 25, icon: "🎨", color: "#06B6D4" },
    { name: "HTML/CSS", level: 35, icon: "🌐", color: "#E34F26" },
    { name: "AI-Assisted Development", level: 90, icon: "🤖", color: "#FF6B6B" },
  ],
};

export const highlights = [
  {
    title: "Software Developer @ HCLTech",
    description: "Reducing dev effort by 80% with Azure OpenAI automation tools",
    icon: "💼"
  },
  {
    title: "Python Expert",
    description: "Building automation utilities, ML models, and intelligent systems",
    icon: "🐍"
  },
  {
    title: "Published Researcher",
    description: "2 IEEE publications, 🏆 Best Paper Award winner (IEEE ANTS 2025)",
    icon: "📄"
  },
  {
    title: "IIIT-Delhi Graduate",
    description: "B.Tech in Computer Science (2025) with research experience",
    icon: "🎓"
  },
  {
    title: "AI-Integrated Developer",
    description: "Claude Code, Cursor, GPT-4, Azure OpenAI - I ship with AI help",
    icon: "🤖"
  },
  {
    title: "Honest About Skills",
    description: "I know Python well, the rest I figure out with AI. And it works! 😉",
    icon: "😎"
  },
];

// Work Experience for timeline/display
export const experience = [
  {
    role: "Software Developer",
    company: "HCLTech",
    period: "August 2025 – Present",
    achievements: [
      "Engineered Azure OpenAI-powered Python automation utilities, reducing manual development effort by 80%+",
      "Architected intelligent automation tools leveraging GPT-4 for automated code generation, testing, and docs",
      "Integrated AI-driven solutions with CI/CD pipelines in Agile environment"
    ],
    tech: ["Python", "Azure OpenAI", "GPT-4", "CI/CD", "REST APIs", "Agile/Scrum"]
  },
  {
    role: "Research Intern – Machine Learning",
    company: "BITS-ON Research Group, IIIT-Delhi",
    period: "January 2024 – July 2025",
    achievements: [
      "Developed ML-based QoT estimator achieving 95% R² accuracy using Random Forest and DNNs",
      "Built fault localization system for optical amplifiers handling 8 fault scenarios",
      "🏆 Won Best Paper Award at IEEE ANTS 2025"
    ],
    tech: ["Python", "TensorFlow", "Keras", "Scikit-learn", "Deep Learning"]
  }
];

// Publications
export const publications = [
  {
    title: "Machine Learning-Based Quality of Transmission Estimation in Optical Networks",
    authors: "A. Yadav et al.",
    venue: "IEEE ANTS 2024",
    type: "Conference Paper",
    award: null
  },
  {
    title: "Demonstration of Soft-Failure Localization in C+L Band Optical Testbed: A Deep-Learning Assisted Approach",
    authors: "A. Yadav et al.",
    venue: "IEEE ANTS 2025",
    type: "Conference Demo",
    award: "🏆 Best Paper Award (Demos & Exhibits Category)"
  }
];
