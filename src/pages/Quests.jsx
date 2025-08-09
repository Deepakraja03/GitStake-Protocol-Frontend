import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrophy, 
  FaCode, 
  FaClock, 
  FaUsers, 
  FaCoins,
  FaPlay,
  FaSpinner,
  FaFilter,
  FaMedal,
  FaFire,
  FaChevronRight
} from 'react-icons/fa';
import { questService } from '../services/questService';
import { useAuthContext } from '../context/AuthContext';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const Quests = () => {
  const { user } = useAuthContext();
  const [quests, setQuests] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [cryptoRates, setCryptoRates] = useState(null);

  useEffect(() => {
    loadQuests();
    loadCryptoRates();
    if (user?.githubUsername) {
      loadUserHistory();
    }
  }, [filter, selectedLevel, user]);

  const loadQuests = async () => {
    setLoading(true);
    try {
      const filters = {
        ...(filter !== 'all' && { status: filter }),
        ...(selectedLevel && { level: selectedLevel })
      };
      
      const response = await questService.management.getActiveQuests(filters);
      setQuests(response.quests || []);
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserHistory = async () => {
    try {
      const response = await questService.history.getUserHistory(user.githubUsername);
      setUserHistory(response.history || []);
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };

  const loadCryptoRates = async () => {
    try {
      const response = await questService.wallet.getCryptoRates();
      setCryptoRates(response);
    } catch (error) {
      console.error('Error loading crypto rates:', error);
    }
  };

  const handleJoinQuest = async (questId) => {
    if (!user?.walletAddress) {
      alert('Please connect your wallet to join quests');
      return;
    }

    try {
      const result = await questService.participation.stakeForQuest(questId, {
        walletAddress: user.walletAddress,
        stakeAmount: 10, // Default stake amount
        currency: 'AVAX'
      });
      
      if (result.success) {
        loadQuests(); // Refresh quests
        alert('Successfully joined quest!');
      }
    } catch (error) {
      console.error('Error joining quest:', error);
      alert('Failed to join quest. Please try again.');
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: 'text-green-400',
      2: 'text-green-400',
      3: 'text-yellow-400',
      4: 'text-yellow-400',
      5: 'text-orange-400',
      6: 'text-orange-400',
      7: 'text-red-400',
      8: 'text-red-400'
    };
    return colors[level] || 'text-gray-400';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      1: 'Beginner',
      2: 'Novice',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert',
      6: 'Master',
      7: 'Grandmaster',
      8: 'Legend'
    };
    return labels[level] || 'Unknown';
  };

  const filterOptions = [
    { value: 'all', label: 'All Quests' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' }
  ];

  const levelOptions = Array.from({ length: 8 }, (_, i) => ({
    value: i + 1,
    label: `Level ${i + 1} - ${getDifficultyLabel(i + 1)}`
  }));

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
            <TypingText text="Developer Quests" speed={80} />
          </h1>
          <p className="text-gray-400">Challenge yourself and earn AVAX rewards</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 text-center">
              <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Active Quests</h3>
              <p className="text-2xl font-bold text-yellow-400">
                <AnimatedCounter end={quests.filter(q => q.status === 'active').length} />
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 text-center">
              <FaUsers className="text-3xl text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Participants</h3>
              <p className="text-2xl font-bold text-blue-400">
                <AnimatedCounter end={quests.reduce((sum, q) => sum + (q.participants || 0), 0)} />
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 text-center">
              <FaCoins className="text-3xl text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Total Rewards</h3>
              <p className="text-2xl font-bold text-green-400">
                <AnimatedCounter end={quests.reduce((sum, q) => sum + (q.reward || 0), 0)} /> AVAX
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 text-center">
              <FaMedal className="text-3xl text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Your Completed</h3>
              <p className="text-2xl font-bold text-purple-400">
                <AnimatedCounter end={userHistory.filter(h => h.status === 'completed').length} />
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-400" />
                <span className="text-white font-semibold">Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      filter === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Level:</span>
                <select
                  value={selectedLevel || ''}
                  onChange={(e) => setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">All Levels</option>
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full text-center py-12">
                <FaSpinner className="text-4xl text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-white">Loading quests...</p>
              </div>
            ) : quests.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FaTrophy className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No quests found matching your criteria</p>
              </div>
            ) : (
              quests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full flex flex-col hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          quest.status === 'active' ? 'bg-green-400' :
                          quest.status === 'upcoming' ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`} />
                        <span className={`text-sm font-semibold ${getDifficultyColor(quest.level)}`}>
                          Level {quest.level}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{quest.reward || 0} AVAX</p>
                        <p className="text-gray-400 text-xs">Reward</p>
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {quest.title || `${getDifficultyLabel(quest.level)} Challenge`}
                    </h3>

                    <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                      {quest.description || 'Complete this coding challenge to earn rewards and improve your skills.'}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <FaClock />
                          <span>{quest.duration || '2 hours'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <FaUsers />
                          <span>{quest.participants || 0} joined</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {quest.technologies?.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {quest.technologies?.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{quest.technologies.length - 3} more
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleJoinQuest(quest.id)}
                        disabled={quest.status !== 'active'}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <FaPlay />
                        <span>
                          {quest.status === 'active' ? 'Join Quest' :
                           quest.status === 'upcoming' ? 'Coming Soon' :
                           'Completed'}
                        </span>
                        <FaChevronRight />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* User Quest History */}
        {userHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaFire className="mr-2" />
                Your Quest History
              </h2>
              
              <div className="space-y-3">
                {userHistory.slice(0, 5).map((history, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        history.status === 'completed' ? 'bg-green-400' :
                        history.status === 'in_progress' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <div>
                        <p className="text-white font-semibold">{history.questTitle}</p>
                        <p className="text-gray-400 text-sm">Level {history.level}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${
                        history.status === 'completed' ? 'text-green-400' :
                        history.status === 'in_progress' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {history.status === 'completed' ? `+${history.reward} AVAX` :
                         history.status === 'in_progress' ? 'In Progress' :
                         'Failed'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(history.completedAt || history.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quests;