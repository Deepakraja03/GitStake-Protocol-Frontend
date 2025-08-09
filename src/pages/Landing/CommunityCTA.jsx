import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CommunityCTA = () => {
  return (
    <section className="py-20 px-4 text-center">
      <motion.h2
        className="text-4xl font-extrabold font-['Plus_Jakarta_Sans']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Join the CodeStake Community
      </motion.h2>
      <motion.p
        className="mt-4 text-[var(--muted)] max-w-2xl mx-auto font-['Inter']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Connect with developers, contribute to open-source, and earn rewards!
      </motion.p>
      <motion.div
        className="mt-8 flex items-center justify-center gap-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <Link
          to="/dao"
          className="px-6 py-3 rounded-md font-semibold border border-[var(--glass-border)] bg-[var(--glass-bg)] font-['JetBrains_Mono']"
        >
          <motion.div whileHover={{ scale: 1.05 }}>Join DAO</motion.div>
        </Link>
        <a
          href="https://discord.com"
          className="px-6 py-3 rounded-md font-semibold border border-[var(--glass-border)] bg-[var(--glass-bg)] font-['JetBrains_Mono']"
        >
          <motion.div whileHover={{ scale: 1.05 }}>Join Discord</motion.div>
        </a>
      </motion.div>
    </section>
  );
};

export default CommunityCTA;