export const skills = {
  "Programming Languages": [
    { name: "Python", level: 95, icon: "🐍", color: "#3776AB" },
    { name: "Java", level: 85, icon: "☕", color: "#007396" },
    { name: "C/C++", level: 80, icon: "⚙️", color: "#00599C" },
    { name: "SQL", level: 85, icon: "🗃️", color: "#4479A1" },
    { name: "JavaScript", level: 70, icon: "💛", color: "#F7DF1E" },
    { name: "HTML/CSS", level: 65, icon: "🌐", color: "#E34F26" },
  ],
  "ML/AI & Data Science": [
    { name: "TensorFlow", level: 90, icon: "🧠", color: "#FF6F00" },
    { name: "Keras", level: 90, icon: "📊", color: "#D00000" },
    { name: "PyTorch", level: 85, icon: "🔥", color: "#EE4C2C" },
    { name: "Scikit-learn", level: 95, icon: "📈", color: "#F7931E" },
    { name: "Hugging Face", level: 88, icon: "🤗", color: "#FFD21E" },
    { name: "Pandas", level: 92, icon: "🐼", color: "#150458" },
    { name: "NumPy", level: 92, icon: "🔢", color: "#013243" },
    { name: "Matplotlib", level: 85, icon: "📉", color: "#11557C" },
    { name: "Deep Learning", level: 90, icon: "🔬", color: "#8B5CF6" },
    { name: "NLP", level: 88, icon: "💬", color: "#10B981" },
  ],
  "AI Tools & Frameworks": [
    { name: "LangChain", level: 85, icon: "🦜", color: "#1C3C3C" },
    { name: "ChromaDB", level: 80, icon: "💾", color: "#FF6B6B" },
    { name: "Azure OpenAI", level: 85, icon: "☁️", color: "#0078D4" },
    { name: "GPT-4", level: 88, icon: "✨", color: "#10A37F" },
    { name: "Google Gemini", level: 85, icon: "💎", color: "#4285F4" },
  ],
  "Backend & APIs": [
    { name: "Flask", level: 90, icon: "⚗️", color: "#000000" },
    { name: "FastAPI", level: 85, icon: "⚡", color: "#009688" },
    { name: "REST APIs", level: 90, icon: "🔌", color: "#FF6C37" },
  ],
  "Tools & Platforms": [
    { name: "Azure", level: 85, icon: "☁️", color: "#0078D4" },
    { name: "Git", level: 90, icon: "🔀", color: "#F05032" },
    { name: "GitHub", level: 90, icon: "🐙", color: "#181717" },
    { name: "CI/CD", level: 80, icon: "🔄", color: "#2088FF" },
    { name: "Linux", level: 88, icon: "🐧", color: "#FCC624" },
    { name: "Docker", level: 75, icon: "🐳", color: "#2496ED" },
    { name: "Agile/Scrum", level: 85, icon: "📋", color: "#0052CC" },
  ],
  "Frontend (with a little AI magic ✨)": [
    { name: "React", level: 70, icon: "⚛️", color: "#61DAFB" },
    { name: "Tailwind CSS", level: 65, icon: "🎨", color: "#06B6D4" },
    { name: "HTML/CSS", level: 65, icon: "🌐", color: "#E34F26" },
    { name: "AI-Assisted Development", level: 95, icon: "🤖", color: "#FF6B6B" },
  ],
};

export const highlights = [
  {
    title: "AI/ML Engineer",
    description: "2 IEEE publications, Best Paper Award winner, 95% R² accuracy models",
    icon: "🏆"
  },
  {
    title: "Python Expert",
    description: "Building production-grade automation, ML pipelines, and AI systems",
    icon: "🐍"
  },
  {
    title: "Research Scholar",
    description: "Published researcher in optical networks & deep learning",
    icon: "📄"
  },
  {
    title: "Software Developer @ HCLTech",
    description: "Reducing dev effort by 80% with Azure OpenAI automation",
    icon: "💼"
  },
  {
    title: "Full-Stack AI Developer",
    description: "From deep learning models to production APIs and web interfaces",
    icon: "🚀"
  },
  {
    title: "Quirky Coder",
    description: "Can build anything - Python, Java, or AI-powered frontend! 😉",
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
