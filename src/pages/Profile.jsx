import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaFire, FaTrophy, FaStar, FaCode, FaEdit, FaSync } from 'react-icons/fa';
import { useGitHubProfile, useGitHubRepos, useUserAnalytics, useAnalyzeUser } from '../hooks/useApi';
import { useAuthContext as useAuth } from '../context/AuthContext';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const Profile = () => {
  const { user } = useAuth();
  const { data: githubProfile, loading: profileLoading } = useGitHubProfile(user?.username);
  const { data: githubRepos, loading: reposLoading } = useGitHubRepos(user?.username);
  const { data: userAnalytics, loading: analyticsLoading } = useUserAnalytics(user?.username);
  const { analyzeUser, loading: analyzeLoading } = useAnalyzeUser();

  const [profile] = useState({
    username: user?.username || 'developer_pro',
    avatar: githubProfile?.avatar_url ? '🖼️' : '👨‍💻',
    level: userAnalytics?.level || 15,
    currentStreak: userAnalytics?.currentStreak || 23,
    longestStreak: userAnalytics?.longestStreak || 45,
    totalRewards: userAnalytics?.totalRewards || 1247.50,
    githubRepos: githubProfile?.public_repos || 28,
    achievements: [
      { id: 1, name: 'First Commit', icon: '🎯', earned: true },
      { id: 2, name: 'Week Warrior', icon: '⚡', earned: userAnalytics?.weekStreak >= 7 },
      { id: 3, name: 'Code Master', icon: '👑', earned: userAnalytics?.totalCommits >= 1000 },
      { id: 4, name: 'Team Player', icon: '🤝', earned: userAnalytics?.collaborations >= 10 },
      { id: 5, name: 'Bug Hunter', icon: '🐛', earned: userAnalytics?.issuesResolved >= 50 },
      { id: 6, name: 'Innovation Award', icon: '💡', earned: userAnalytics?.innovationScore >= 80 },
    ]
  });

  const handleRefreshAnalytics = async () => {
    if (user?.username) {
      try {
        await analyzeUser(user.username);
        // Trigger a refresh of the data
        window.location.reload();
      } catch (error) {
        console.error('Failed to refresh analytics:', error);
      }
    }
  };

  const loading = profileLoading || reposLoading || analyticsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="Developer Profile" speed={80} />
          </h1>
          <p className="text-gray-400">Your coding journey and achievements</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <GlassCard className="p-6 text-center">
            <motion.div
              className="relative inline-block mb-4"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                  '0 0 40px rgba(59, 130, 246, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl">
                {profile.avatar}
              </div>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{profile.username}</h2>
            <p className="text-blue-400 mb-4">Level {profile.level}</p>
            
            <motion.button
              onClick={handleRefreshAnalytics}
              disabled={analyzeLoading}
              className="mb-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSync className={analyzeLoading ? 'animate-spin' : ''} />
              <span>{analyzeLoading ? 'Refreshing...' : 'Refresh Analytics'}</span>
            </motion.button>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Rewards</span>
                <span className="text-green-400 font-bold">
                  <AnimatedCounter value={profile.totalRewards} decimals={2} suffix=" AVAX" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GitHub Repos</span>
                <span className="text-white font-bold">{profile.githubRepos}</span>
              </div>
            </div>
          </GlassCard>

          {/* Streak Tracker */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaFire className="text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Streak Tracker</h3>
            </div>
            
            <div className="text-center mb-6">
              <motion.div
                className="text-6xl mb-2"
                animate={profile.currentStreak > 0 ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.div>
              <div className="text-3xl font-bold text-orange-400">
                <AnimatedCounter value={profile.currentStreak} />
              </div>
              <p className="text-gray-400">Current Streak</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">Longest Streak</p>
              <p className="text-white text-xl font-bold">{profile.longestStreak} days</p>
            </div>
          </GlassCard>

          {/* Connected Repos */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaGithub className="text-white" />
              <h3 className="text-xl font-semibold text-white">Connected Repos</h3>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg animate-pulse">
                      <div className="h-4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 bg-white/5 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                (githubRepos?.slice(0, 4) || ['awesome-project', 'web3-dapp', 'ai-assistant', 'mobile-app']).map((repo, index) => (
                  <motion.div
                    key={typeof repo === 'string' ? repo : repo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <FaCode className="text-blue-400" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        {typeof repo === 'string' ? repo : repo.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {typeof repo === 'string' ? 'JavaScript • Active' : `${repo.language || 'Unknown'} • ${repo.stargazers_count} stars`}
                      </p>
                    </div>
                    <FaStar className="text-yellow-400" />
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Achievements Grid */}
        <GlassCard className="p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Achievements</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {profile.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: achievement.earned ? 15 : 0
                }}
                className={`p-4 rounded-lg text-center transition-all duration-200 ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                    : 'bg-white/5 border border-white/10 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className={`text-sm font-semibold ${
                  achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Profile;
