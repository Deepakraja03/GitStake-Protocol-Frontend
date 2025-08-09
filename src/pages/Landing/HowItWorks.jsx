import React from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaCode, FaTrophy, FaArrowRight, FaGithub, FaWallet } from 'react-icons/fa';

const StepCard = ({ step, title, description, icon: Icon, color, delay, isLast }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
  >
    <motion.div
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 text-center h-full"
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Step number */}
      <div className="absolute -top-4 left-8">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
          {step}
        </div>
      </div>

      {/* Icon */}
      <motion.div
        className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center mx-auto mb-6`}
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Icon className="text-3xl text-white" />
      </motion.div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full"></div>
    </motion.div>

    {/* Arrow connector */}
    {!isLast && (
      <motion.div
        className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      >
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] relative">
          <FaArrowRight className="absolute -right-2 -top-2 text-[#9B2CFF]" />
        </div>
      </motion.div>
    )}
  </motion.div>
);

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: 'Connect Wallet',
      description: 'Link your Avalanche wallet to get started. No complex setup required - just connect and you\'re ready to go.',
      icon: FaWallet,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      delay: 0.2
    },
    {
      step: 2,
      title: 'Stake AVAX',
      description: 'Stake your AVAX tokens to participate in the ecosystem and boost your earning potential from contributions.',
      icon: FaCoins,
      color: 'bg-gradient-to-r from-[#E84142] to-[#9B2CFF]',
      delay: 0.4
    },
    {
      step: 3,
      title: 'Code & Contribute',
      description: 'Connect GitHub and start contributing to open-source projects. Every commit and PR earns you rewards.',
      icon: FaGithub,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      delay: 0.6
    },
    {
      step: 4,
      title: 'Earn Rewards',
      description: 'Watch your contributions turn into AVAX rewards. Compete in challenges and climb the leaderboard for bonus rewards.',
      icon: FaTrophy,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      delay: 0.8
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
            <FaCode className="text-[#E84142]" />
            <span>Simple Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E84142] to-[#9B2CFF] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started in minutes and begin earning rewards for your development work. 
            It's that simple.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-4 relative">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-gray-400 mb-6">
              Join thousands of developers who are already earning AVAX rewards for their contributions.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-xl font-semibold text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
