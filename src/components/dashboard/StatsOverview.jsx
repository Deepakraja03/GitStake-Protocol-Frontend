import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  GitBranch, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import CountUp from 'react-countup';

const StatsCard = ({ title, value, change, icon: Icon, color, delay, prefix = '', suffix = '' }) => (
  <motion.div
    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${color}`} />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        
        <div className={`flex items-center gap-1 text-sm font-['JetBrains_Mono'] ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="mb-2">
        <p className="text-gray-400 text-sm mb-1 font-['JetBrains_Mono']">{title}</p>
        <p className="text-3xl font-bold text-white font-['JetBrains_Mono']">
          {prefix}
          <CountUp
            end={value}
            duration={2.5}
            separator=","
            preserveValue
          />
          {suffix}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`w-full bg-gray-700 rounded-full h-1.5 overflow-hidden`}>
          <motion.div
            className={`h-full ${color.replace('bg-gradient-to-r', 'bg-gradient-to-r')}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (value / 2000) * 100)}%` }}
            transition={{ duration: 2, delay: delay + 0.5 }}
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-2 font-['JetBrains_Mono']">
        {change >= 0 ? 'Increased' : 'Decreased'} from last period
      </p>
    </div>
  </motion.div>
);

const MiniChart = ({ data, color, delay }) => (
  <motion.div
    className="h-16 flex items-end gap-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    {data.map((value, index) => (
      <motion.div
        key={index}
        className={`flex-1 ${color} rounded-t-sm`}
        style={{ height: `${(value / Math.max(...data)) * 100}%` }}
        initial={{ height: 0 }}
        animate={{ height: `${(value / Math.max(...data)) * 100}%` }}
        transition={{ duration: 0.5, delay: delay + index * 0.1 }}
      />
    ))}
  </motion.div>
);

const StatsOverview = ({ timeRange }) => {
  const statsData = [
    { 
      title: 'Total Rewards', 
      value: 1250, 
      change: 12.5, 
      icon: DollarSign, 
      color: 'bg-gradient-to-r from-green-500 to-green-600', 
      delay: 0.1,
      suffix: ' AVAX'
    },
    { 
      title: 'Active Stakes', 
      value: 8, 
      change: 25, 
      icon: Target, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600', 
      delay: 0.2 
    },
    { 
      title: 'GitHub Commits', 
      value: 156, 
      change: -5.2, 
      icon: GitBranch, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600', 
      delay: 0.3 
    },
    { 
      title: 'Rank Position', 
      value: 42, 
      change: 8.1, 
      icon: Award, 
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', 
      delay: 0.4,
      prefix: '#'
    },
  ];

  const miniChartData = {
    rewards: [20, 35, 25, 40, 30, 45, 35],
    stakes: [5, 6, 7, 8, 7, 8, 8],
    commits: [12, 15, 10, 18, 14, 16, 12],
    rank: [50, 48, 45, 43, 42, 41, 42],
  };

  return (
    <div className="mb-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {statsData.map((stat, index) => (
          <div key={stat.title} className="relative">
            <StatsCard {...stat} />
            
            {/* Mini trend chart */}
            <motion.div
              className="absolute bottom-2 right-2 w-16 h-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: stat.delay + 1 }}
            >
              <MiniChart 
                data={Object.values(miniChartData)[index]} 
                color={stat.color.replace('bg-gradient-to-r', 'bg-gradient-to-t')}
                delay={stat.delay + 1.2}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-['JetBrains_Mono']">Daily Average</p>
              <p className="text-lg font-semibold text-white font-['JetBrains_Mono']">
                <CountUp end={24.5} decimals={1} duration={2} /> AVAX
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-['JetBrains_Mono']">Growth Rate</p>
              <p className="text-lg font-semibold text-green-400 font-['JetBrains_Mono']">
                +<CountUp end={15.7} decimals={1} duration={2} />%
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-['JetBrains_Mono']">Efficiency</p>
              <p className="text-lg font-semibold text-blue-400 font-['JetBrains_Mono']">
                <CountUp end={92} duration={2} />%
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsOverview;
