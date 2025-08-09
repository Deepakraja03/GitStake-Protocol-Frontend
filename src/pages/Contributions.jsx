import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode, FaStar, FaEye, FaChartLine } from 'react-icons/fa';
import { useGitHubActivity, useGitHubQuality, useGitHubComplexity, useGitHubProfile } from '../hooks/useApi';
import { useAuthContext as useAuth } from '../context/AuthContext';
import GlassCard from '../components/animations/GlassCard';
import ProgressRing from '../components/animations/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import TypingText from '../components/animations/TypingText';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const ActivityTimeline = () => {
  const [activities] = useState([
    { date: '2024-01-15', commits: 5, prs: 2, issues: 1, type: 'commit', repo: 'awesome-project' },
    { date: '2024-01-16', commits: 3, prs: 1, issues: 0, type: 'pr', repo: 'cool-library' },
    { date: '2024-01-17', commits: 8, prs: 0, issues: 2, type: 'issue', repo: 'bug-tracker' },
    { date: '2024-01-18', commits: 2, prs: 3, issues: 1, type: 'commit', repo: 'web-app' },
    { date: '2024-01-19', commits: 6, prs: 1, issues: 0, type: 'pr', repo: 'mobile-app' },
  ]);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FaGithub className="text-white" />
        <h3 className="text-xl font-semibold text-white">GitHub Activity Timeline</h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minWidth: '800px' }}>
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-48 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="text-sm text-gray-400 mb-2">{activity.date}</div>
              <div className="text-white font-semibold mb-2">{activity.repo}</div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Commits</span>
                  <span className="text-green-400 font-bold">{activity.commits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">PRs</span>
                  <span className="text-blue-400 font-bold">{activity.prs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Issues</span>
                  <span className="text-orange-400 font-bold">{activity.issues}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

const AIScorecard = () => {
  const [scores] = useState([
    { name: 'Code Quality', value: 85, color: '#10b981' },
    { name: 'Consistency', value: 92, color: '#3b82f6' },
    { name: 'Collaboration', value: 78, color: '#f59e0b' },
    { name: 'Innovation', value: 88, color: '#8b5cf6' },
  ]);

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">AI Scorecard</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {scores.map((score, index) => (
          <motion.div
            key={score.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="text-center"
          >
            <ProgressRing
              progress={score.value}
              size={100}
              color={score.color}
              strokeWidth={6}
            />
            <p className="text-white font-semibold mt-2">{score.name}</p>
            <p className="text-gray-400 text-sm">{score.value}/100</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <p className="text-gray-400 text-sm mb-2">Overall Score</p>
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={85.8} decimals={1} />
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '85.8%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const CodeQualityHeatmap = () => {
  const [heatmapData] = useState(() => {
    const data = [];
    const languages = ['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'];
    const metrics = ['Complexity', 'Coverage', 'Maintainability', 'Security', 'Performance'];
    
    languages.forEach(lang => {
      metrics.forEach(metric => {
        data.push({
          language: lang,
          metric,
          value: Math.floor(Math.random() * 100),
        });
      });
    });
    
    return data;
  });

  const getHeatmapColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const languages = ['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'];
  const metrics = ['Complexity', 'Coverage', 'Maintainability', 'Security', 'Performance'];

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Code Quality Heatmap</h3>
      
      <div className="overflow-x-auto">
        <div className="grid grid-cols-6 gap-1 text-sm">
          {/* Header */}
          <div></div>
          {metrics.map(metric => (
            <div key={metric} className="text-gray-400 text-center p-2 font-semibold">
              {metric}
            </div>
          ))}
          
          {/* Data rows */}
          {languages.map(lang => (
            <React.Fragment key={lang}>
              <div className="text-gray-400 p-2 font-semibold">{lang}</div>
              {metrics.map(metric => {
                const dataPoint = heatmapData.find(d => d.language === lang && d.metric === metric);
                return (
                  <motion.div
                    key={`${lang}-${metric}`}
                    className={`p-2 rounded text-white text-center font-bold ${getHeatmapColor(dataPoint.value)}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    title={`${lang} ${metric}: ${dataPoint.value}`}
                  >
                    {dataPoint.value}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <span>Poor</span>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <div className="w-4 h-4 bg-green-500 rounded"></div>
        </div>
        <span>Excellent</span>
      </div>
    </GlassCard>
  );
};

const Contributions = () => {
  const { user } = useAuth();
  const { data: githubActivity, loading: activityLoading } = useGitHubActivity(user?.username);
  const { data: githubQuality, loading: qualityLoading } = useGitHubQuality(user?.username);
  const { data: githubComplexity, loading: complexityLoading } = useGitHubComplexity(user?.username);
  const { data: githubProfile, loading: profileLoading } = useGitHubProfile(user?.username);

  const loading = activityLoading || qualityLoading || complexityLoading || profileLoading;

  const userData = {
    username: user?.username || 'demo_user',
    totalContributions: githubActivity?.totalContributions || 1247,
    currentStreak: githubActivity?.currentStreak || 23,
    longestStreak: githubActivity?.longestStreak || 45,
    totalRepos: githubProfile?.public_repos || 28,
  };

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
            <TypingText text="Contributions & Scoring" speed={80} />
          </h1>
          <p className="text-gray-400">Track your development impact and code quality</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <GlassCard className="p-6 text-center">
            <FaCode className="text-blue-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={userData?.totalContributions || 0} />
            </div>
            <p className="text-gray-400 text-sm">Total Contributions</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <FaChartLine className="text-green-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={userData?.currentStreak || 0} />
            </div>
            <p className="text-gray-400 text-sm">Current Streak</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <FaStar className="text-yellow-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={userData?.longestStreak || 0} />
            </div>
            <p className="text-gray-400 text-sm">Longest Streak</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <FaEye className="text-purple-400 text-3xl mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={userData?.totalRepos || 0} />
            </div>
            <p className="text-gray-400 text-sm">Repositories</p>
          </GlassCard>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ActivityTimeline />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CodeQualityHeatmap />
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <AIScorecard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contributions;
