import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import AnimatedBackground from './components/Background/AnimatedBackground';

function App() {
  useEffect(() => {
    // Smooth scroll polyfill for older browsers
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-500 text-white">
      {/* Animated 3D Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />

        {/* About Section - Simple intro before projects */}
        <section id="about" className="section-container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-6">
              I'm a passionate software developer with a strong focus on building innovative solutions
              that merge cutting-edge AI technologies with modern web development. My recent work includes
              developing a professional RAG (Retrieval-Augmented Generation) system, and I'm constantly
              exploring new ways to leverage AI, machine learning, and full-stack technologies.
            </p>
            <p className="text-lg text-gray-500">
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source
              projects, or designing beautiful user interfaces that make a difference.
            </p>
          </div>
        </section>

        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
