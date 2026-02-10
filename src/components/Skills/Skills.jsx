import { motion } from 'framer-motion';
import { skills, highlights } from '../../data/skillsData';

function SkillBar({ skill, index, categoryIndex }) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{skill.icon}</span>
          <span className="font-medium text-white">{skill.name}</span>
        </div>
        <span className="text-sm text-gray-400 font-mono">{skill.level}%</span>
      </div>

      <div className="relative h-2 bg-dark-300 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full shadow-lg"
          style={{
            backgroundColor: skill.color,
            boxShadow: `0 0 10px ${skill.color}40`
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{
            delay: (categoryIndex * 0.1) + (index * 0.05) + 0.3,
            duration: 1,
            ease: 'easeOut'
          }}
        />
      </div>
    </motion.div>
  );
}

function HighlightCard({ highlight, index }) {
  return (
    <motion.div
      className="card text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="text-6xl mb-4"
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.6 }}
      >
        {highlight.icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
        {highlight.title}
      </h3>
      <p className="text-gray-400 text-sm">
        {highlight.description}
      </p>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
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
            Skills &{' '}
            <span className="gradient-text">Expertise</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Technologies and tools I use to bring ideas to life
          </motion.p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {highlights.map((highlight, index) => (
            <HighlightCard key={index} highlight={highlight} index={index} />
          ))}
        </div>

        {/* Skills by Category */}
        <div className="space-y-12">
          {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
            <motion.div
              key={category}
              className="glass rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 + 0.2 }}
              >
                <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-cyan rounded-full" />
                <h3 className="text-2xl font-display font-bold">{category}</h3>
              </motion.div>

              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {categorySkills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    index={index}
                    categoryIndex={categoryIndex}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block glass rounded-2xl px-8 py-6 border border-primary-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-lg text-gray-300 mb-2">
              Always learning and exploring{' '}
              <span className="gradient-text font-semibold">new technologies</span>
            </p>
            <p className="text-sm text-gray-400">
              Currently diving deeper into AI/ML, Web3, and Cloud Architecture
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
