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
              I'm an <span className="text-primary-400 font-semibold">AI/ML Engineer</span> at <span className="text-accent-cyan font-semibold">HCLTech</span>, where I build Azure OpenAI-powered automation tools that reduce development effort by 80%+.
              Currently finishing my B.Tech in Computer Science at <span className="text-accent-purple font-semibold">IIIT-Delhi (June 2025)</span>.
            </p>
            <p className="text-lg text-gray-400 mb-4">
              My research in ML-based optical network optimization earned me <span className="text-primary-400 font-bold">2 IEEE publications</span> and the
              <span className="text-primary-400 font-bold"> 🏆 Best Paper Award at IEEE ANTS 2025</span>. I specialize in Python, Deep Learning, and building
              production-grade AI systems from research to deployment.
            </p>
            <p className="text-base text-gray-500 italic">
              Fun fact: I'm a Python & ML expert who can build amazing AI systems... and when it comes to frontend,
              I let AI do the heavy lifting! 😄 Because why not leverage the technology I work with?
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
