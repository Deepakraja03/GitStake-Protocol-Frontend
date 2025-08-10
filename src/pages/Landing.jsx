import React, { Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import useAutoAuth from '../hooks/useAutoAuth';
import Hero from './Landing/Hero';
import HowItWorks from './Landing/HowItWorks';
import LiveStats from './Landing/LiveStats';
import GitHubPreview from './Landing/GitHubPreview';
import Challenges from './Landing/Challenges';
import WhyGitStake from './Landing/WhyGitStake';
import CommunityCTA from './Landing/CommunityCTA';


const Landing = () => {
  const { authenticationComplete, walletConnected, githubConnected } = useAuthContext();

  // Use auto-auth hook with no requirements for landing page
  // This will show prompts but not redirect automatically
  const authState = useAutoAuth({
    autoRedirect: false,
    showPrompt: false, // We'll handle prompts manually
    skipRoutes: ['/'] // Don't auto-redirect from landing
  });

  // Show authentication banner if user has started but not completed auth
  const showAuthBanner = (walletConnected || githubConnected) && !authenticationComplete;

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