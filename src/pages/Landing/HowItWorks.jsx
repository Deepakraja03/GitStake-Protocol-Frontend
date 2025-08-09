import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const CardAnimation = ({ children }) => (
  <Canvas style={{ height: '100px' }}>
    <ambientLight />
    <pointLight position={[5, 5, 5]} />
    <Box args={[1, 1, 1]} rotation={[0.4, 0.4, 0]}>
      <meshStandardMaterial color="#E84142" />
    </Box>
  </Canvas>
);

const HowItWorks = () => {
  const items = [
    { title: 'Stake', desc: 'Stake AVAX to participate in CodeStake’s ecosystem.' },
    { title: 'Code', desc: 'Contribute to open-source projects and track via GitHub.' },
    { title: 'Earn', desc: 'Earn rewards based on your contributions and stakes.' },
  ];

  return (
    <section className="py-20 px-4">
      <motion.h2
        className="text-4xl font-extrabold text-center font-['Plus_Jakarta_Sans']"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        How It Works
      </motion.h2>
      <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <CardAnimation />
            <h3 className="font-semibold text-xl font-['Inter']">{item.title}</h3>
            <p className="text-sm text-[var(--muted)] mt-2 font-['JetBrains_Mono']">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;