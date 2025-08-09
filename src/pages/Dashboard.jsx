import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaGithub, FaTrophy, FaFire } from 'react-icons/fa';
import { useLeaderboard, useUserAnalytics, useGitHubActivity } from '../hooks/useApi';
import { useAuthContext as useAuth } from '../context/AuthContext';
import GlassCard from '../components/animations/GlassCard';
import ProgressRing from '../components/animations/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import TypingText from '../components/animations/TypingText';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WalletBar = ({ balance = 0, address = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-white/10"
  >
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <FaWallet className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-400">Wallet</p>
        <p className="text-white font-semibold">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-400">AVAX Balance</p>
      <p className="text-white font-bold text-lg">
        <AnimatedCounter value={balance} decimals={2} suffix=" AVAX" />
      </p>
    </div>
  </motion.div>
);

const StakingOverview = ({ apy = 12.5, totalStaked = 1250.75 }) => (
  <GlassCard className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-white">Staking Overview</h3>
      <motion.div
        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Live APY
      </motion.div>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div className="text-center">
        <div className="relative">
          <ProgressRing 
            progress={(apy / 20) * 100} 
            size={120} 
            color="#10b981"
            showPercentage={false}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                <AnimatedCounter value={apy} decimals={1} suffix="%" />
              </div>
              <div className="text-xs text-gray-400">APY</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Total Staked</p>
          <p className="text-white text-2xl font-bold">
            <AnimatedCounter value={totalStaked} decimals={2} suffix=" AVAX" />
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Estimated Rewards</p>
          <p className="text-green-400 text-lg font-semibold">
            <AnimatedCounter value={totalStaked * (apy / 100) / 365} decimals={4} suffix=" AVAX/day" />
          </p>
        </div>
      </div>
    </div>
  </GlassCard>
);

const YieldTimeline = () => {
  const [data] = useState([
    { date: '2024-01', yield: 8.2 },
    { date: '2024-02', yield: 9.1 },
    { date: '2024-03', yield: 10.5 },
    { date: '2024-04', yield: 11.8 },
    { date: '2024-05', yield: 12.5 },
  ]);

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Yield Timeline</h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="yield" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
};

const ContributionGrid = () => {
  const [contributions] = useState(() => {
    const grid = [];
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        grid.push({
          week,
          day,
          count: Math.floor(Math.random() * 5),
          date: new Date(2024, 0, week * 7 + day + 1)
        });
      }
    }
    return grid;
  });

  const getIntensity = (count) => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 1) return 'bg-green-900';
    if (count <= 2) return 'bg-green-700';
    if (count <= 3) return 'bg-green-500';
    return 'bg-green-300';
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FaGithub className="text-white" />
        <h3 className="text-xl font-semibold text-white">GitHub Activity</h3>
      </div>
      
      <div className="grid grid-cols-52 gap-1 mb-4">
        {contributions.map((contrib, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-sm ${getIntensity(contrib.count)} cursor-pointer`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.001 }}
            whileHover={{ scale: 1.5 }}
            title={`${contrib.count} contributions on ${contrib.date.toDateString()}`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} className={`w-3 h-3 rounded-sm ${getIntensity(level)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </GlassCard>
  );
};

const ActiveQuests = () => {
  const [quests] = useState([
    { id: 1, title: 'Daily Commit Streak', progress: 75, reward: '10 AVAX' },
    { id: 2, title: 'Code Review Master', progress: 45, reward: '25 AVAX' },
    { id: 3, title: 'Open Source Contributor', progress: 90, reward: '50 AVAX' },
  ]);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FaTrophy className="text-yellow-400" />
        <h3 className="text-xl font-semibold text-white">Active Quests</h3>
      </div>
      
      <div className="space-y-4">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            <ProgressRing 
              progress={quest.progress} 
              size={60} 
              strokeWidth={4}
              color="#f59e0b"
            />
            <div className="flex-1">
              <h4 className="text-white font-semibold">{quest.title}</h4>
              <p className="text-gray-400 text-sm">Reward: {quest.reward}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

const LeaderboardSnapshot = ({ data }) => {
  const leaderboard = data?.slice(0, 5) || [
    { rank: 1, username: 'alice_dev', score: 2450, avatar: '👩‍💻' },
    { rank: 2, username: 'bob_codes', score: 2180, avatar: '👨‍💻' },
    { rank: 3, username: 'charlie_git', score: 1950, avatar: '🧑‍💻' },
    { rank: 4, username: 'diana_dev', score: 1720, avatar: '👩‍💻' },
    { rank: 5, username: 'eve_codes', score: 1580, avatar: '👩‍💻' },
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Leaderboard</h3>
        <motion.button
          className="text-blue-400 hover:text-blue-300 text-sm"
          whileHover={{ scale: 1.05 }}
        >
          View All
        </motion.button>
      </div>
      
      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              user.rank === 1 ? 'bg-yellow-500 text-black' :
              user.rank === 2 ? 'bg-gray-400 text-black' :
              user.rank === 3 ? 'bg-amber-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {user.rank}
            </div>
            <div className="text-2xl">{user.avatar}</div>
            <div className="flex-1">
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-gray-400 text-sm">
                <AnimatedCounter value={user.score} suffix=" pts" />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: leaderboardData, loading: leaderboardLoading } = useLeaderboard();
  const { data: userAnalytics, loading: analyticsLoading } = useUserAnalytics(user?.username);
  const { data: githubActivity, loading: activityLoading } = useGitHubActivity(user?.username);
  
  const [userData, setUserData] = useState({
    username: user?.username || 'demo_user',
    balance: 125.75,
    address: '0x1234...5678'
  });

  const loading = leaderboardLoading || analyticsLoading || activityLoading;

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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="Welcome back, Developer!" speed={100} />
          </h1>
          <p className="text-gray-400">Track your staking rewards and GitHub contributions</p>
        </motion.div>

        {/* Wallet Bar */}
        <WalletBar 
          balance={userData?.balance} 
          address={userData?.address} 
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <StakingOverview />
            <YieldTimeline />
            <ContributionGrid />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ActiveQuests />
            <LeaderboardSnapshot data={leaderboardData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
