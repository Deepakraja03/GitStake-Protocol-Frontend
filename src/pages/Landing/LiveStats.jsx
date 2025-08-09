import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LiveStats = () => {
  const [stats, setStats] = useState({ staked: 0, developers: 0, rewards: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        staked: stats.staked + Math.random() * 100,
        developers: stats.developers + 1,
        rewards: stats.rewards + Math.random() * 10,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [stats]);

  return (
    <section className="py-20 px-4 bg-[var(--glass-bg)]">
      <motion.h2
        className="text-4xl font-extrabold text-center font-['Plus_Jakarta_Sans']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Live Stats
      </motion.h2>
      <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {[
          { label: 'Total Staked', value: stats.staked.toFixed(2), unit: 'AVAX' },
          { label: 'Active Developers', value: stats.developers, unit: '' },
          { label: 'Rewards Paid', value: stats.rewards.toFixed(2), unit: 'AVAX' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <motion.p
              className="text-3xl font-bold font-['JetBrains_Mono']"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {stat.value} {stat.unit}
            </motion.p>
            <p className="text-sm text-[var(--muted)] mt-2 font-['Inter']">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LiveStats;