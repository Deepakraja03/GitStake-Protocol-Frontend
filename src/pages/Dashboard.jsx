import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaChartLine, 
  FaTrophy, 
  FaCode, 
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaFire,
  FaSpinner,
  FaSync
} from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import { userService } from '../services/userService';
import { githubService } from '../services/githubService';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const Dashboard = () => {
  const { user, analyzeGitHubUser, getUserAnalytics } = useAuthContext();
  const [analytics, setAnalytics] = useState(null);
  const [githubProfile, setGithubProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.githubUsername) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.githubUsername) return;

    setLoading(true);
    setError(null);

    try {
      // Load user analytics
      const analyticsResult = await getUserAnalytics(user.githubUsername);
      if (analyticsResult.success) {
        setAnalytics(analyticsResult.data);
      }

      // Load GitHub profile
      const profileResult = await githubService.profile.getProfile(user.githubUsername);
      setGithubProfile(profileResult);

      // Load repositories
      const reposResult = await githubService.repositories.getUserRepos(user.githubUsername, {
        sort: 'updated',
        per_page: 6
      });
      setRepositories(reposResult);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeGitHub = async () => {
    if (!user?.githubUsername) return;

    setAnalyzing(true);
    try {
      const result = await analyzeGitHubUser(user.githubUsername);
      if (result.success) {
        // Reload analytics after analysis
        await loadDashboardData();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to analyze GitHub profile');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
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
            <TypingText text={`Welcome back, ${user?.displayName || user?.githubUsername || 'Developer'}!`} speed={50} />
          </h1>
          <p className="text-gray-400">Your GitStake developer dashboard</p>
        </motion.div>

        {/* Analysis Button */}
        {user?.githubUsername && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleAnalyzeGitHub}
              disabled={analyzing}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {analyzing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Analyzing GitHub Profile...</span>
                </>
              ) : (
                <>
                  <FaSync />
                  <span>Analyze GitHub Profile</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 text-center">
              <FaCode className="text-3xl text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Repositories</h3>
              <p className="text-2xl font-bold text-purple-400">
                <AnimatedCounter end={githubProfile?.public_repos || 0} />
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
              <h3 className="text-white font-semibold mb-2">Followers</h3>
              <p className="text-2xl font-bold text-blue-400">
                <AnimatedCounter end={githubProfile?.followers || 0} />
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 text-center">
              <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Level</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {analytics?.developerLevel || 'Analyzing...'}
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 text-center">
              <FaFire className="text-3xl text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Score</h3>
              <p className="text-2xl font-bold text-red-400">
                <AnimatedCounter end={analytics?.proficiencyScore || 0} />
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GitHub Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaGithub className="mr-2" />
                GitHub Profile
              </h2>
              
              {githubProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={githubProfile.avatar_url}
                      alt={githubProfile.name}
                      className="w-16 h-16 rounded-full border-2 border-purple-400"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{githubProfile.name}</h3>
                      <p className="text-gray-400">@{githubProfile.login}</p>
                    </div>
                  </div>
                  
                  {githubProfile.bio && (
                    <p className="text-gray-300 text-sm">{githubProfile.bio}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Following</p>
                      <p className="text-white font-semibold">{githubProfile.following}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Followers</p>
                      <p className="text-white font-semibold">{githubProfile.followers}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <FaCalendarAlt className="mr-2" />
                    Joined {new Date(githubProfile.created_at).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaSpinner className="text-2xl text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Loading profile...</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaChartLine className="mr-2" />
                Analytics Overview
              </h2>
              
              {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Developer Level</p>
                      <p className="text-white text-lg font-semibold">{analytics.developerLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Proficiency Score</p>
                      <p className="text-purple-400 text-lg font-semibold">{analytics.proficiencyScore}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Commits</p>
                      <p className="text-blue-400 text-lg font-semibold">{analytics.totalCommits}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Innovation Score</p>
                      <p className="text-green-400 text-lg font-semibold">{analytics.innovationScore}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Collaboration Score</p>
                      <p className="text-yellow-400 text-lg font-semibold">{analytics.collaborationScore}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Primary Language</p>
                      <p className="text-white text-lg font-semibold">{analytics.primaryLanguage || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {user?.githubUsername 
                      ? 'Click "Analyze GitHub Profile" to see your analytics'
                      : 'Connect your GitHub account to see analytics'
                    }
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaCode className="mr-2" />
              Recent Repositories
            </h2>
            
            {repositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repositories.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold truncate">{repo.name}</h3>
                      {repo.stargazers_count > 0 && (
                        <div className="flex items-center text-yellow-400 text-sm">
                          <FaStar className="mr-1" />
                          {repo.stargazers_count}
                        </div>
                      )}
                    </div>
                    
                    {repo.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{repo.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{repo.language}</span>
                      <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No repositories found</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;