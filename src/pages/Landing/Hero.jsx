import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Mountain = () => {
  const meshRef = useRef();
  useFrame(({ mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = mouse.x * 0.2;
      meshRef.current.rotation.x = mouse.y * 0.1;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, -2, -5]}>
      <coneGeometry args={[5, 10, 32]} />
      <meshStandardMaterial color="#E84142" roughness={0.7} metalness={0.2} />
    </mesh>
  );
};

const SnowParticles = () => {
  const particlesRef = useRef();
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.position.y -= 0.01;
      if (particlesRef.current.position.y < -10) particlesRef.current.position.y = 10;
    }
  });
  return (
    <points ref={particlesRef}>
      <sphereGeometry args={[10, 32, 32]} />
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <fog attach="fog" args={['#0a0a0a', 5, 20]} />
        <Mountain />
        <SnowParticles />
        <Stars radius={100} depth={50} count={5000} factor={4} />
      </Canvas>
      <div className="absolute text-center">
        <motion.h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Stake. Contribute. Earn.
        </motion.h1>
        <motion.p
          className="mt-4 text-[var(--muted)] max-w-2xl mx-auto font-['Inter']"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Empowering developers with blockchain rewards on Avalanche
        </motion.p>
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Link
            to="/stake"
            className="px-6 py-3 rounded-md font-semibold text-white font-['JetBrains_Mono']"
            style={{ backgroundImage: 'linear-gradient(135deg, #E84142, #9B2CFF)' }}
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(232, 65, 66, 0.5)' }}>
              Stake Now
            </motion.div>
          </Link>
          <Link
            to="/dao"
            className="px-6 py-3 rounded-md font-semibold border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] font-['JetBrains_Mono']"
          >
            <motion.div whileHover={{ scale: 1.05 }}>Join DAO</motion.div>
          </Link>
          <Link
            to="/leaderboard"
            className="px-6 py-3 rounded-md font-semibold border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] font-['JetBrains_Mono']"
          >
            <motion.div whileHover={{ scale: 1.05 }}>View Leaderboard</motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;