import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './Landing/Hero';
import HowItWorks from './Landing/HowItWorks';
import LiveStats from './Landing/LiveStats';
import GitHubPreview from './Landing/GitHubPreview';
import Challenges from './Landing/Challenges';
import WhyGitStake from './Landing/WhyGitStake';
import CommunityCTA from './Landing/CommunityCTA';


const Landing = () => {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <HowItWorks />
        <LiveStats />
        <GitHubPreview />
        <Challenges />
        <WhyGitStake />
        <CommunityCTA />
      </Suspense>
    </motion.div>
  );
};

export default Landing;