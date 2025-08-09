import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaCrown, FaStar } from 'react-icons/fa';

const PodiumStep = ({ rank, user, height, color, delay, isHovered, onHover, onLeave }) => {
  const getRankIcon = () => {
    switch (rank) {
      case 1: return <FaCrown className="text-yellow-400 text-2xl" />;
      case 2: return <FaTrophy className="text-gray-400 text-xl" />;
      case 3: return <FaMedal className="text-orange-400 text-xl" />;
      default: return <FaStar className="text-gray-500 text-lg" />;
    }
  };

  const getGradient = () => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* User Info */}
      <motion.div
        className="mb-4 text-center"
        animate={{ y: isHovered ? -5 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {user && (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2 mx-auto">
              <span className="text-white font-bold text-lg">
                {user.username?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div className="text-white font-semibold text-sm mb-1">
              {user.username || `User ${rank}`}
            </div>
            <div className="text-gray-400 text-xs">
              {user.score || Math.floor(Math.random() * 1000)} pts
            </div>
          </>
        )}
      </motion.div>

      {/* Rank Badge */}
      <motion.div
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10"
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? 5 : 0
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className={`w-10 h-10 bg-gradient-to-r ${getGradient()} rounded-full flex items-center justify-center border-2 border-white shadow-lg`}>
          <span className="text-white font-bold text-sm">#{rank}</span>
        </div>
      </motion.div>

      {/* Podium Step */}
      <motion.div
        className={`relative bg-gradient-to-t ${getGradient()} rounded-t-lg shadow-2xl border-t-4 border-white/20`}
        style={{
          width: '120px',
          height: `${height}px`,
          background: `linear-gradient(to top, ${color}dd, ${color})`
        }}
        animate={{
          y: isHovered ? -5 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      >
        {/* Podium Decorations */}
        <div className="absolute inset-x-0 top-0 h-2 bg-white/20 rounded-t-lg" />
        <div className="absolute inset-x-2 top-2 h-px bg-white/30" />

        {/* Rank Icon */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {getRankIcon()}
        </div>

        {/* Sparkles for first place */}
        {rank === 1 && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const Podium3D = ({ leaderboard = [], className = '' }) => {
  const [hoveredRank, setHoveredRank] = useState(null);

  // Default leaderboard data if none provided
  const defaultLeaderboard = [
    { username: 'CodeMaster', score: 2847 },
    { username: 'DevNinja', score: 2156 },
    { username: 'GitGuru', score: 1923 }
  ];

  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : defaultLeaderboard;

  const podiumData = [
    { rank: 2, height: 120, color: '#C0C0C0', delay: 0.2 },
    { rank: 1, height: 160, color: '#FFD700', delay: 0.4 },
    { rank: 3, height: 80, color: '#CD7F32', delay: 0.6 },
  ];

  return (
    <div className={`${className} w-full`}>
      {/* Base Platform */}
      <motion.div
        className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg" />

        {/* Podium Steps Container */}
        <div className="flex items-end justify-center gap-8 relative z-10">
          {podiumData.map(({ rank, height, color, delay }) => (
            <PodiumStep
              key={rank}
              rank={rank}
              user={displayLeaderboard[rank - 1]}
              height={height}
              color={color}
              delay={delay}
              isHovered={hoveredRank === rank}
              onHover={() => setHoveredRank(rank)}
              onLeave={() => setHoveredRank(null)}
            />
          ))}
        </div>

        {/* Base Decorations */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-b-lg" />
        <div className="absolute bottom-4 left-4 right-4 h-px bg-white/10" />
      </motion.div>
    </div>
  );
};

export default Podium3D;