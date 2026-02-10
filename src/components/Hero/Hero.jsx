import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated text reveal
      gsap.from('.hero-text', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
      });

      // Floating animation for the hero image
      gsap.to('.hero-float', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Content */}
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div ref={textRef} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="hero-text inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary-400 border border-primary-500/30">
                🏆 IEEE Best Paper Award Winner | Software Developer @ HCLTech
              </span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="hero-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight">
                Hi, I'm{' '}
                <span className="gradient-text block mt-2">
                  Aditya
                </span>
              </h1>

              <motion.div
                className="hero-text space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-300">
                  Software Developer & Python Expert
                </p>
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
                  Building{' '}
                  <span className="text-primary-400 font-semibold">intelligent automation tools</span> with{' '}
                  <span className="text-accent-cyan font-semibold">Python, Azure OpenAI & GPT-4</span>. Published researcher with{' '}
                  <span className="text-accent-purple font-semibold">2 IEEE papers</span>.
                  <br />
                  <span className="text-sm text-gray-500 italic">
                    (This beautiful portfolio? Made with AI's help because I'm honest like that 😉)
                  </span>
                </p>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="hero-text flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                onClick={scrollToProjects}
                className="glow-button group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowDown className="inline-block ml-2 w-5 h-5 group-hover:animate-bounce" />
              </motion.button>

              <motion.a
                href="#contact"
                className="px-8 py-3 rounded-full glass glass-hover font-semibold border border-primary-500/30 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.a>

              <motion.a
                href="/Aditya_Yadav_Resume.pdf"
                download="Aditya_Yadav_Resume.pdf"
                className="px-6 py-3 rounded-full glass glass-hover font-semibold border border-white/10 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                Resume
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="hero-text flex gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.a
                href="https://github.com/Aditya-0156"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg glass glass-hover border border-white/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/aditya-yadav-29340b273/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg glass glass-hover border border-white/10"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </div>

          {/* 3D Visual Element */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="hero-float relative">
              {/* Floating Card */}
              <div className="relative perspective-1000">
                <motion.div
                  className="relative glass rounded-3xl p-8 border-2 border-primary-500/20 shadow-2xl shadow-primary-500/20 transform-3d"
                  whileHover={{ rotateY: 5, rotateX: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Code snippet decoration */}
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-accent-purple">const</span>
                      <span className="text-accent-cyan">developer</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-primary-400">{'{'}</span>
                    </div>
                    <div className="pl-6 space-y-2">
                      <div>
                        <span className="text-accent-cyan">name:</span>
                        <span className="text-green-400"> "Aditya Yadav"</span>,
                      </div>
                      <div>
                        <span className="text-accent-cyan">role:</span>
                        <span className="text-green-400"> "Software Developer"</span>,
                      </div>
                      <div>
                        <span className="text-accent-cyan">company:</span>
                        <span className="text-green-400"> "HCLTech"</span>,
                      </div>
                      <div>
                        <span className="text-accent-cyan">expertise:</span>
                        <span className="text-gray-400"> [</span>
                        <span className="text-green-400">"Python"</span>,
                        <span className="text-green-400"> "Automation"</span>
                        <span className="text-gray-400">]</span>,
                      </div>
                      <div>
                        <span className="text-accent-cyan">achievements:</span>
                        <span className="text-green-400"> "🏆 IEEE Best Paper"</span>,
                      </div>
                      <div>
                        <span className="text-accent-cyan">hireable:</span>
                        <span className="text-primary-400"> true</span>
                      </div>
                    </div>
                    <div className="text-primary-400">{'}'}</div>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </motion.div>
              </div>

              {/* Orbiting elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-full shadow-lg shadow-primary-500/50"
                animate={{
                  y: [0, -20, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <motion.div
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-pink rounded-lg shadow-lg shadow-accent-purple/50"
                animate={{
                  y: [0, 20, 0],
                  rotate: -360,
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
