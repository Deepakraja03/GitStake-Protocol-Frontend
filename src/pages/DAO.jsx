import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaVoteYea, FaChartBar, FaUsers, FaLightbulb } from 'react-icons/fa';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const DAO = () => {
  const [proposals] = useState([
    {
      id: 1,
      title: 'Increase Staking Rewards by 2%',
      description: 'Proposal to increase the base staking APY from 12.5% to 14.5%',
      status: 'active',
      votesFor: 1250,
      votesAgainst: 340,
      timeLeft: '5 days',
    },
    {
      id: 2,
      title: 'Add New Programming Language Support',
      description: 'Extend GitStake to support Rust and Go repositories',
      status: 'pending',
      votesFor: 890,
      votesAgainst: 120,
      timeLeft: '12 days',
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="DAO Governance" speed={80} />
          </h1>
          <p className="text-gray-400">Shape the future of GitStake together</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6 text-center">
            <FaUsers className="text-blue-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={2847} />
            </div>
            <p className="text-gray-400 text-sm">Active Voters</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <FaVoteYea className="text-green-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={15} />
            </div>
            <p className="text-gray-400 text-sm">Active Proposals</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <FaChartBar className="text-purple-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={89.2} decimals={1} suffix="%" />
            </div>
            <p className="text-gray-400 text-sm">Participation Rate</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <FaLightbulb className="text-yellow-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={127} />
            </div>
            <p className="text-gray-400 text-sm">Implemented Ideas</p>
          </GlassCard>
        </div>

        {/* Proposals */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Active Proposals</h2>
          
          <div className="space-y-6">
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {proposal.title}
                    </h3>
                    <p className="text-gray-400">{proposal.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      proposal.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {proposal.status}
                    </span>
                    <p className="text-gray-400 text-sm mt-2">{proposal.timeLeft} left</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400">For</span>
                      <span className="text-white font-bold">{proposal.votesFor}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400">Against</span>
                      <span className="text-white font-bold">{proposal.votesAgainst}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ 
                          width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Vote For
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Vote Against
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DAO;
