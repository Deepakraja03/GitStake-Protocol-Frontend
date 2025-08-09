import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const Podium = () => (
  <Canvas style={{ height: '100px' }}>
    <ambientLight />
    <pointLight position={[5, 5, 5]} />
    <Box args={[1, 2, 1]} position={[0, 1, 0]}>
      <meshStandardMaterial color="#FFD700" />
    </Box>
  </Canvas>
);

const Challenges = () => {
  const challenges = [
    { title: 'Smart Contract Quest', desc: 'Build a secure staking contract.' },
    { title: 'UI Challenge', desc: 'Design a Web3 dashboard.' },
    { title: 'API Integration', desc: 'Connect to Avalanche API.' },
  ];

  return (
    <section className="py-20 px-4">
      <motion.h2
        className="text-4xl font-extrabold text-center font-['Plus_Jakarta_Sans']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Featured Challenges
      </motion.h2>
      <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {challenges.map((challenge, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            whileHover={{ rotateY: 5 }}
          >
            <Podium />
            <h3 className="font-semibold text-xl font-['Inter']">{challenge.title}</h3>
            <p className="text-sm text-[var(--muted)] mt-2 font-['JetBrains_Mono']">{challenge.desc}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Podium />
        <h3 className="font-semibold text-xl font-['Inter']">Leaderboard Preview</h3>
        <p className="text-sm text-[var(--muted)] mt-2 font-['JetBrains_Mono']">Top 3 developers this week!</p>
      </motion.div>
    </section>
  );
};

export default Challenges;