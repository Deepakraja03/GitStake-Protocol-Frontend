import React from 'react';
import { motion } from 'framer-motion';

const WhyGitStake = () => {
  const reasons = [
    { title: 'Avalanche Speed', desc: 'Lightning-fast transactions for staking and rewards.' },
    { title: 'AI Scoring', desc: 'Fair contribution scoring with transparent AI.' },
    { title: 'Open Source', desc: 'Community-driven with full transparency.' },
  ];

  return (
    <section className="py-20 px-4 bg-[var(--glass-bg)]">
      <motion.h2
        className="text-4xl font-extrabold text-center font-['Plus_Jakarta_Sans']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Why Avalanche + GitStake
      </motion.h2>
      <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <h3 className="font-semibold text-xl font-['Inter']">{reason.title}</h3>
            <p className="text-sm text-[var(--muted)] mt-2 font-['JetBrains_Mono']">{reason.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyGitStake;