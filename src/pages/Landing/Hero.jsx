import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Code, Trophy, Rocket, ChevronDown, Coins } from 'lucide-react';

const FeatureCard = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-all duration-300 ${className}`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);



// Clean background with subtle gradient
const CleanBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,65,66,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(155,44,255,0.1),transparent_50%)]" />
  </div>
);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <CleanBackground />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Rocket size={16} className="text-[#E84142]" />
            <span className="font-['Fira_Code'] font-medium text-gray-300">Revolutionizing Developer Rewards</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 font-['Fira_Code']"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">Code. Stake. Earn.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-['Fira_Sans']"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The decentralized platform that rewards developers for their GitHub contributions through AVAX staking and gamified challenges.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/challenges"
              className="group px-8 py-4 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-[#E84142]/25 transition-all duration-300 font-['Fira_Sans']"
            >
              <span className="flex items-center gap-2">
                <Rocket size={20} />
                Get Started
              </span>
            </Link>

            <Link
              to="/leaderboard"
              className="px-8 py-4 border border-white/[0.2] rounded-xl font-semibold text-white text-lg hover:bg-white/[0.05] transition-all duration-300 font-['Fira_Sans'] backdrop-blur-xl"
            >
              View Leaderboard
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard delay={0.8}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Github size={24} className="text-[#E84142]" />
              </div>
              <h3 className="text-lg font-semibold mb-3 font-['Fira_Sans'] text-white">GitHub Integration</h3>
              <p className="text-gray-400 font-['Fira_Sans'] text-sm leading-relaxed">Connect your GitHub account and earn rewards for every commit, PR, and contribution.</p>
            </div>
          </FeatureCard>

          <FeatureCard delay={1.0}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#00D09C]/10 to-[#E84142]/10 border border-[#00D09C]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Coins size={24} className="text-[#00D09C]" />
              </div>
              <h3 className="text-lg font-semibold mb-3 font-['Fira_Sans'] text-white">AVAX Staking</h3>
              <p className="text-gray-400 font-['Fira_Sans'] text-sm leading-relaxed">Stake AVAX tokens to boost your rewards and participate in governance decisions.</p>
            </div>
          </FeatureCard>

          <FeatureCard delay={1.2}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#9B2CFF]/10 to-[#00D09C]/10 border border-[#9B2CFF]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} className="text-[#9B2CFF]" />
              </div>
              <h3 className="text-lg font-semibold mb-3 font-['Fira_Sans'] text-white">Compete & Win</h3>
              <p className="text-gray-400 font-['Fira_Sans'] text-sm leading-relaxed">Join coding challenges, climb leaderboards, and win exclusive NFT rewards.</p>
            </div>
          </FeatureCard>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-500 cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs mb-2 font-['Fira_Sans']">Scroll to explore</span>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;