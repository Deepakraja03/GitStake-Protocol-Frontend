import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaMedal, FaFire, FaGift, FaStar } from 'react-icons/fa';
import { useLeaderboard, useUsers } from '../hooks/useApi';
import { useAuthContext as useAuth } from '../context/AuthContext';
import GlassCard from '../components/animations/GlassCard';
import Podium3D from '../components/3d/Podium3D';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import TypingText from '../components/animations/TypingText';

const FilterButton = ({ active, onClick, children, icon }) => (
  <motion.button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-white/10 text-gray-300 hover:bg-white/20'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    <span>{children}</span>
  </motion.button>
);

const LeaderboardEntry = ({ user, rank, showAnimation = true }) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-400" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
    return 'bg-white/5 border-white/10';
  };

  return (
    <motion.div
      initial={showAnimation ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: showAnimation ? rank * 0.1 : 0 }}
      className={`p-4 rounded-lg border ${getRankBg(rank)} hover:bg-white/10 transition-all duration-200`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 flex items-center justify-center">
          {getRankIcon(rank)}
        </div>
        
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl">
          {user.avatar || '👤'}
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold">{user.username}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Level {user.level || 1}</span>
            <span>{user.totalCommits || 0} commits</span>
            <span>{user.streak || 0} day streak</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            <AnimatedCounter value={user.score || 0} suffix=" pts" />
          </div>
          <div className="text-sm text-green-400">
            <AnimatedCounter value={user.rewards || 0} decimals={2} suffix=" AVAX" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RewardsCard = ({ userRank = 15, nextReward = 100 }) => {
  const canClaim = userRank <= 10;
  
  return (
    <GlassCard className="p-6" glow={canClaim}>
      <div className="flex items-center space-x-2 mb-4">
        <FaGift className="text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Claim Rewards</h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Your Current Rank</p>
          <p className="text-3xl font-bold text-white">#{userRank}</p>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Available Rewards</p>
          <p className="text-green-400 text-xl font-bold">
            <AnimatedCounter value={nextReward} decimals={2} suffix=" AVAX" />
          </p>
        </div>
        
        <motion.button
          disabled={!canClaim}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            canClaim
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={canClaim ? { scale: 1.02 } : {}}
          whileTap={canClaim ? { scale: 0.98 } : {}}
          animate={canClaim ? {
            boxShadow: [
              '0 0 20px rgba(168, 85, 247, 0.4)',
              '0 0 40px rgba(168, 85, 247, 0.6)',
              '0 0 20px rgba(168, 85, 247, 0.4)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {canClaim ? 'Claim Rewards' : `Reach Top 10 to Claim`}
        </motion.button>
        
        {!canClaim && (
          <p className="text-center text-gray-400 text-sm">
            {10 - userRank} more ranks to go!
          </p>
        )}
      </div>
    </GlassCard>
  );
};

const Leaderboard = () => {
  const { user } = useAuth();
  const { data: leaderboardData, loading, error, refetch } = useLeaderboard();
  const [filter, setFilter] = useState('overall');
  const [showConfetti, setShowConfetti] = useState(false);

  // Fallback data if API fails
  const fallbackData = [
    {
      username: 'alice_dev',
      score: 2450,
      avatar: '👩‍💻',
      level: 15,
      totalCommits: 1250,
      streak: 45,
      rewards: 125.50
    },
    {
      username: 'bob_codes',
      score: 2180,
      avatar: '👨‍💻',
      level: 12,
      totalCommits: 980,
      streak: 32,
      rewards: 98.75
    },
    {
      username: 'charlie_git',
      score: 1950,
      avatar: '🧑‍💻',
      level: 11,
      totalCommits: 875,
      streak: 28,
      rewards: 87.25
    },
    {
      username: 'diana_dev',
      score: 1720,
      avatar: '👩‍💻',
      level: 9,
      totalCommits: 720,
      streak: 22,
      rewards: 72.10
    },
    {
      username: 'eve_codes',
      score: 1580,
      avatar: '👩‍💻',
      level: 8,
      totalCommits: 650,
      streak: 18,
      rewards: 65.80
    },
    {
      username: 'frank_dev',
      score: 1420,
      avatar: '👨‍💻',
      level: 7,
      totalCommits: 580,
      streak: 15,
      rewards: 58.90
    },
    {
      username: 'grace_git',
      score: 1280,
      avatar: '👩‍💻',
      level: 6,
      totalCommits: 520,
      streak: 12,
      rewards: 52.40
    },
    {
      username: 'henry_code',
      score: 1150,
      avatar: '👨‍💻',
      level: 5,
      totalCommits: 460,
      streak: 10,
      rewards: 46.75
    }
  ];

  const displayData = leaderboardData || fallbackData;

  useEffect(() => {
    if (filter !== 'overall') {
      refetch();
    }
  }, [filter, refetch]);

  const topThree = displayData.slice(0, 3);
  const restOfLeaderboard = displayData.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

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
            <TypingText text="Leaderboard & Rewards" speed={80} />
          </h1>
          <p className="text-gray-400">Compete with developers worldwide</p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <FilterButton
            active={filter === 'overall'}
            onClick={() => setFilter('overall')}
            icon={<FaTrophy />}
          >
            Overall
          </FilterButton>
          <FilterButton
            active={filter === 'monthly'}
            onClick={() => setFilter('monthly')}
            icon={<FaStar />}
          >
            This Month
          </FilterButton>
          <FilterButton
            active={filter === 'weekly'}
            onClick={() => setFilter('weekly')}
            icon={<FaFire />}
          >
            This Week
          </FilterButton>
        </motion.div>

        {/* 3D Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Top Performers
            </h2>
            <Podium3D leaderboard={topThree} showConfetti={showConfetti} />
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Full Rankings
              </h2>
              
              <div className="space-y-3">
                {/* Top 3 in list format */}
                {topThree.map((user, index) => (
                  <LeaderboardEntry
                    key={user.username}
                    user={user}
                    rank={index + 1}
                    showAnimation={true}
                  />
                ))}
                
                {/* Rest of the leaderboard */}
                {restOfLeaderboard.map((user, index) => (
                  <LeaderboardEntry
                    key={user.username}
                    user={user}
                    rank={index + 4}
                    showAnimation={true}
                  />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Rewards Section */}
          <div className="space-y-6">
            <RewardsCard />
            
            {/* Stats Card */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Your Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Rank</span>
                  <span className="text-white font-bold">#15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Score</span>
                  <span className="text-white font-bold">
                    <AnimatedCounter value={850} suffix=" pts" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-green-400 font-bold">+125 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Earned Rewards</span>
                  <span className="text-blue-400 font-bold">
                    <AnimatedCounter value={42.50} decimals={2} suffix=" AVAX" />
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
