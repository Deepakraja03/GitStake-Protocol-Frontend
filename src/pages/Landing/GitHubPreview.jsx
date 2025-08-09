import React from 'react';
import { motion } from 'framer-motion';

const GitHubPreview = () => {
  const contributions = Array(365).fill(0).map(() => Math.floor(Math.random() * 5));

  return (
    <section className="py-20 px-4">
      <motion.h2
        className="text-4xl font-extrabold text-center font-['Plus_Jakarta_Sans']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Contribution Preview
      </motion.h2>
      <div className="mt-8 max-w-6xl mx-auto grid grid-cols-7 gap-1">
        {contributions.map((count, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: count > 0 ? `rgba(232, 65, 66, ${count * 0.2})` : '#2d2d2d' }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute bg-[var(--glass-bg)] border border-[var(--glass-border)] p-2 rounded-md text-sm font-['JetBrains_Mono']"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {count} contributions
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GitHubPreview;