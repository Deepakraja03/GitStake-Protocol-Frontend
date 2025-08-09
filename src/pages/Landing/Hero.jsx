import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaCode, FaCoins, FaTrophy, FaRocket, FaChevronDown } from 'react-icons/fa';
import TypingText from '../../components/animations/TypingText';

const FloatingCard = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    {children}
  </motion.div>
);



const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #E84142 0%, transparent 70%)',
          left: `${mousePosition.x * 0.1}%`,
          top: `${mousePosition.y * 0.1}%`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #9B2CFF 0%, transparent 70%)',
          right: `${mousePosition.x * 0.05}%`,
          bottom: `${mousePosition.y * 0.05}%`,
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating AVAX Coins */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`coin-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50 + 100}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            y: [0, -80, -160],
            rotateY: [0, 180]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        >
          <div
            className="rounded-full relative border border-yellow-300/50"
            style={{
              width: Math.random() * 20 + 15,
              height: Math.random() * 20 + 15,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-bold text-red-800 font-['Plus_Jakarta_Sans']"
                style={{ fontSize: '6px' }}
              >
                A
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, -60],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 6 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative font-['JetBrains_Mono'] min-h-screen flex items-center justify-center px-4 py-20">
      <AnimatedBackground />

      <div className="relative z-10 max-w-8xl mx-auto w-full">
        <div className="text-center mb-16 max-w-6xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-base mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaRocket className="text-[#E84142] text-lg" />
            <span className="font-['JetBrains_Mono'] font-semibold">Revolutionizing Developer Rewards</span>
          </motion.div>

          <div className="text-6xl flex md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 font-['JetBrains_Mono']">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent"
            >
              <TypingText text="Code." speed={150} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="bg-gradient-to-r from-[#E84142] to-[#9B2CFF] bg-clip-text text-transparent"
            >
              <TypingText text="Stake." speed={150} delay={1500} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.0 }}
              className="bg-gradient-to-r from-[#00D09C] to-[#E84142] bg-clip-text text-transparent"
            >
              <TypingText text="Earn." speed={150} delay={3000} />
            </motion.div>
          </div>

          <motion.div
            className="text-xl md:text-xl  text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed font-['Plus_Jakarta_Sans']"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 4.5 }}
          >
            <TypingText
              text="The first decentralized platform that rewards developers for their GitHub contributions through AVAX staking and gamified challenges."
              speed={50}
              delay={4500}
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 6.0 }}
          >
            <Link
              to="/auth"
              className="group relative px-10 py-5 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-2xl font-bold text-white text-xl overflow-hidden font-['Plus_Jakarta_Sans'] shadow-2xl"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#9B2CFF] to-[#E84142] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center gap-3">
                <FaRocket className="text-xl" />
                Get Started
              </span>
            </Link>

            <Link
              to="/leaderboard"
              className="px-10 py-5 border-2 border-white/20 rounded-2xl font-bold text-white text-xl hover:bg-white/5 transition-all duration-300 font-['Plus_Jakarta_Sans'] backdrop-blur-md"
            >
              View Leaderboard
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FloatingCard delay={0.8}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaGithub className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-['Plus_Jakarta_Sans']">GitHub Integration</h3>
              <p className="text-gray-400 font-['Plus_Jakarta_Sans']">Connect your GitHub account and earn rewards for every commit, PR, and contribution.</p>
            </div>
          </FloatingCard>

          <FloatingCard delay={1.0}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00D09C] to-[#E84142] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCoins className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-['Plus_Jakarta_Sans']">AVAX Staking</h3>
              <p className="text-gray-400 font-['Plus_Jakarta_Sans']">Stake AVAX tokens to boost your rewards and participate in governance decisions.</p>
            </div>
          </FloatingCard>

          <FloatingCard delay={1.2}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#9B2CFF] to-[#00D09C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-['Plus_Jakarta_Sans']">Compete & Win</h3>
              <p className="text-gray-400 font-['Plus_Jakarta_Sans']">Join coding challenges, climb leaderboards, and win exclusive NFT rewards.</p>
            </div>
          </FloatingCard>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-400 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm mb-2 font-['Plus_Jakarta_Sans']">Scroll to explore</span>
            <FaChevronDown />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;