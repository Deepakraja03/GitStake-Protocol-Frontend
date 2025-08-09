import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  GitBranch,
  Award
} from 'lucide-react';
import CountUp from 'react-countup';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Import new modern dashboard components
import StatsOverview from '../components/dashboard/StatsOverview';
import GitHubActivity from '../components/dashboard/GitHubActivity';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import QuickActions from '../components/dashboard/QuickActions';

// Animated Card Component
const AnimatedCard = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    {children}
  </motion.div>
);

// Interactive Chart Component
const InteractiveChart = ({ timeRange }) => {
  const [chartType, setChartType] = useState('area');
  
  const data = [
    { name: 'Jan', rewards: 400, staked: 2400, commits: 24 },
    { name: 'Feb', rewards: 300, staked: 1398, commits: 13 },
    { name: 'Mar', rewards: 200, staked: 9800, commits: 98 },
    { name: 'Apr', rewards: 278, staked: 3908, commits: 39 },
    { name: 'May', rewards: 189, staked: 4800, commits: 48 },
    { name: 'Jun', rewards: 239, staked: 3800, commits: 38 },
    { name: 'Jul', rewards: 349, staked: 4300, commits: 43 },
  ];

  return (
    <AnimatedCard delay={0.4} className="h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white font-['JetBrains_Mono']">Performance Overview</h3>
        <div className="flex gap-2">
          {['area', 'line', 'bar'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 rounded-lg text-sm transition-all font-['JetBrains_Mono'] ${
                chartType === type
                  ? 'bg-[#E84142] text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
        {chartType === 'area' && (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E84142" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#E84142" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="rewards" 
              stroke="#E84142" 
              fillOpacity={1} 
              fill="url(#colorRewards)" 
            />
          </AreaChart>
        )}
        
        {chartType === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }} 
            />
            <Line type="monotone" dataKey="rewards" stroke="#E84142" strokeWidth={3} />
            <Line type="monotone" dataKey="commits" stroke="#9B2CFF" strokeWidth={3} />
          </LineChart>
        )}
        
        {chartType === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="rewards" fill="#E84142" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  );
};

// Staking Panel Component
const StakingPanel = () => {
  const stakingData = [
    { name: 'Staked', value: 75, color: '#E84142' },
    { name: 'Available', value: 25, color: '#374151' }
  ];

  return (
    <AnimatedCard delay={0.6} className="h-[500px] flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-6 font-['JetBrains_Mono']">Staking Overview</h3>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-center mb-6">
          <ResponsiveContainer width={200} height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={stakingData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#E84142" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-['JetBrains_Mono']">Total Staked</span>
            <span className="text-white font-semibold font-['JetBrains_Mono']">1,250.75 AVAX</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-['JetBrains_Mono']">APY</span>
            <span className="text-green-400 font-semibold font-['JetBrains_Mono']">12.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-['JetBrains_Mono']">Rewards Earned</span>
            <span className="text-white font-semibold font-['JetBrains_Mono']">156.23 AVAX</span>
          </div>
        </div>

        <motion.button
          className="w-full py-3 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-xl font-semibold text-white font-['JetBrains_Mono']"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Manage Staking
        </motion.button>
      </div>
    </AnimatedCard>
  );
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A]">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#E84142] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-gray-400 font-['JetBrains_Mono']"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-['JetBrains_Mono'] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-2 text-lg font-['JetBrains_Mono']">
                Welcome back! Here's your development performance overview.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-['JetBrains_Mono'] ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-[#E84142] to-[#9B2CFF] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview timeRange={timeRange} />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <InteractiveChart timeRange={timeRange} />
          </div>
          <div>
            <StakingPanel />
          </div>
        </div>

        {/* Performance and GitHub Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <PerformanceMetrics timeRange={timeRange} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6">
          <GitHubActivity timeRange={timeRange} />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
