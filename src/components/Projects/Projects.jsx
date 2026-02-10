import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronRight, Star, Code2 } from 'lucide-react';
import { projects, categories } from '../../data/projectsData';

function ProjectCard({ project, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <motion.div
        className="relative h-full glass rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
        whileHover={{ scale: 1.02, borderColor: 'rgba(251, 191, 36, 0.3)' }}
      >
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              className="px-3 py-1 rounded-full bg-primary-500 text-dark-900 text-xs font-bold flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Star className="w-3 h-3 fill-current" />
              Featured
            </motion.div>
          </div>
        )}

        {/* Project Image/Preview */}
        <div className="relative h-48 bg-gradient-to-br from-primary-500/20 via-accent-purple/20 to-accent-cyan/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Code2 className="w-20 h-20 text-primary-400/30" />
          </div>
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Category */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-2xl font-display font-bold group-hover:text-primary-400 transition-colors">
                {project.title}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 whitespace-nowrap">
                {project.category}
              </span>
            </div>
            <p className="text-sm text-primary-400 font-medium">{project.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed">
            {isExpanded ? project.longDescription : project.description}
          </p>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-400 text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>

          {/* Features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <h4 className="text-sm font-semibold text-primary-400">Key Features:</h4>
                <ul className="space-y-1">
                  {project.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-sm text-gray-400 flex items-start gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <motion.div
                key={i}
                className="px-3 py-1.5 rounded-lg glass text-xs font-medium flex items-center gap-1.5 border border-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.3)' }}
                style={{ color: tech.color }}
              >
                <span className="text-base">{tech.icon}</span>
                {tech.name}
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              {project.stats.stars}
            </span>
            <span>{project.stats.tech}</span>
            <span className="px-2 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan text-xs">
              {project.stats.type}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/30 font-medium text-sm flex items-center justify-center gap-2 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="w-4 h-4" />
                View Code
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-lg glow-button text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured{' '}
            <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Showcasing my latest work in AI, full-stack development, and modern web technologies
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary-500 text-dark-900 shadow-lg shadow-primary-500/50'
                  : 'glass glass-hover border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-400">No projects found in this category</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">More exciting projects coming soon!</p>
          <motion.a
            href="https://github.com/Aditya-0156"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glow-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            View All on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
