import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaTrophy, FaFire, FaClock, FaUsers, FaGift } from 'react-icons/fa';

const ChallengeCard = ({ challenge, index }) => (
  <motion.div
    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    whileHover={{ y: -10, scale: 1.02 }}
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${challenge.gradient}`}></div>

    {/* Difficulty badge */}
    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${challenge.difficultyColor}`}>
      {challenge.difficulty}
    </div>

    {/* Icon */}
    <motion.div
      className={`w-16 h-16 rounded-2xl ${challenge.iconBg} flex items-center justify-center mb-6`}
      whileHover={{ rotate: 5, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <challenge.icon className="text-2xl text-white" />
    </motion.div>

    {/* Content */}
    <h3 className="text-2xl font-bold mb-3">{challenge.title}</h3>
    <p className="text-gray-400 mb-6 leading-relaxed">{challenge.description}</p>

    {/* Stats */}
    <div className="flex items-center justify-between mb-6 text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <FaUsers />
        <span>{challenge.participants} participants</span>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <FaClock />
        <span>{challenge.timeLeft}</span>
      </div>
    </div>

    {/* Reward */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FaGift className="text-yellow-400" />
        <span className="font-semibold">{challenge.reward}</span>
      </div>
      <motion.button
        className={`px-4 py-2 rounded-xl font-semibold text-white ${challenge.buttonBg}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Join Challenge
      </motion.button>
    </div>
  </motion.div>
);

const Challenges = () => {
  const challenges = [
    {
      title: 'Smart Contract Quest',
      description: 'Build a secure staking contract with advanced features and deploy it on Avalanche testnet.',
      icon: FaCode,
      iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      buttonBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20',
      difficulty: 'Advanced',
      difficultyColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
      participants: 234,
      timeLeft: '5 days',
      reward: '500 AVAX'
    },
    {
      title: 'UI/UX Challenge',
      description: 'Design and implement a beautiful Web3 dashboard with modern animations and responsive design.',
      icon: FaTrophy,
      iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      buttonBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20',
      difficulty: 'Intermediate',
      difficultyColor: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      participants: 156,
      timeLeft: '3 days',
      reward: '300 AVAX'
    },
    {
      title: 'API Integration',
      description: 'Create a robust API integration with Avalanche network and implement real-time data synchronization.',
      icon: FaFire,
      iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
      buttonBg: 'bg-gradient-to-r from-green-500 to-green-600',
      gradient: 'bg-gradient-to-r from-green-500/20 to-green-600/20',
      difficulty: 'Beginner',
      difficultyColor: 'bg-green-500/20 text-green-400 border border-green-500/30',
      participants: 89,
      timeLeft: '7 days',
      reward: '200 AVAX'
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
            <FaTrophy className="text-[#E84142]" />
            <span>Compete & Win</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E84142] to-[#9B2CFF] bg-clip-text text-transparent">
              Challenges
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test your skills, compete with other developers, and win amazing AVAX rewards.
            New challenges every week!
          </p>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={index} challenge={challenge} index={index} />
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Want to Create Your Own Challenge?</h3>
            <p className="text-gray-400 mb-6">
              Submit your challenge ideas and help shape the future of developer competitions.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-xl font-semibold text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Challenge
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Challenges;

