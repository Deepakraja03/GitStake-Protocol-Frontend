import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthDebug from '../components/AuthDebug';
import {
  Github,
  Code2,
  Star,
  GitCommit,
  GitPullRequest,
  GitBranch,
  Activity,
  Flame,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import CountUp from 'react-countup';
import { useGitHubActivity, useGitHubProfile } from '../hooks/useApi';
import { useAuthContext as useAuth } from '../context/AuthContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Professional Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-[#E84142]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-[#E84142] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400 font-['JetBrains_Mono'] text-sm mt-4">Loading...</p>
    </div>
  </div>
);

// Clean Professional Card
const Card = ({ children, className = "", hover = false }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 ${
      hover ? 'hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300' : ''
    } ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

// Professional Metric Card
const MetricCard = ({ icon: Icon, label, value, change, changeType }) => {
  const getChangeIcon = () => {
    if (changeType === 'up') return <ArrowUpRight size={14} className="text-green-400" />;
    if (changeType === 'down') return <ArrowDownRight size={14} className="text-red-400" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const getChangeColor = () => {
    if (changeType === 'up') return 'text-green-400';
    if (changeType === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon size={18} className="text-[#E84142]" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-['JetBrains_Mono']">{label}</p>
            <p className="text-white text-2xl font-bold font-['JetBrains_Mono'] mt-1">
              <CountUp end={value} duration={1.5} separator="," />
            </p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="text-sm font-['JetBrains_Mono']">{change}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Professional Activity Chart
const ActivityChart = () => {
  const [timeframe, setTimeframe] = useState('7d');

  const chartData = [
    { date: 'Mon', commits: 12, prs: 3, issues: 2 },
    { date: 'Tue', commits: 8, prs: 5, issues: 1 },
    { date: 'Wed', commits: 15, prs: 2, issues: 4 },
    { date: 'Thu', commits: 6, prs: 7, issues: 3 },
    { date: 'Fri', commits: 20, prs: 4, issues: 1 },
    { date: 'Sat', commits: 3, prs: 1, issues: 0 },
    { date: 'Sun', commits: 5, prs: 2, issues: 1 }
  ];

  const timeframes = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  return (
    <Card className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
            <Activity size={16} className="text-[#E84142]" />
          </div>
          <h3 className="text-lg font-semibold text-white font-['JetBrains_Mono']">Activity Overview</h3>
        </div>

        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 text-xs font-['JetBrains_Mono'] rounded-md transition-all duration-200 ${
                timeframe === tf.id
                  ? 'bg-[#E84142]/20 text-[#E84142] border border-[#E84142]/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="commits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E84142" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E84142" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="prs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono'
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#E84142"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#commits)"
            />
            <Area
              type="monotone"
              dataKey="prs"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#prs)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-white/[0.05]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#E84142]"></div>
          <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Commits</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
          <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Pull Requests</span>
        </div>
      </div>
    </Card>
  );
};

// Professional Performance Metrics
const PerformanceMetrics = () => {
  const metrics = [
    { label: 'Code Quality', value: 92, max: 100, color: '#10B981' },
    { label: 'Consistency', value: 88, max: 100, color: '#3B82F6' },
    { label: 'Collaboration', value: 76, max: 100, color: '#F59E0B' },
    { label: 'Innovation', value: 84, max: 100, color: '#8B5CF6' }
  ];

  const overallScore = Math.round(metrics.reduce((acc, metric) => acc + metric.value, 0) / metrics.length);

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
          <Trophy size={16} className="text-[#E84142]" />
        </div>
        <h3 className="text-lg font-semibold text-white font-['JetBrains_Mono']">Performance</h3>
      </div>

      <div className="space-y-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-['JetBrains_Mono']">{metric.label}</span>
              <span className="text-sm text-white font-['JetBrains_Mono']">{metric.value}%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: metric.color }}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/[0.05]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Overall Score</span>
          <span className="text-lg font-bold text-white font-['JetBrains_Mono']">
            <CountUp end={overallScore} duration={2} />%
          </span>
        </div>
      </div>
    </Card>
  );
};

// Clean Language Distribution
const LanguageDistribution = () => {
  const languages = [
    { name: 'JavaScript', percentage: 35, color: '#F7DF1E' },
    { name: 'TypeScript', percentage: 28, color: '#3178C6' },
    { name: 'Python', percentage: 20, color: '#3776AB' },
    { name: 'Go', percentage: 12, color: '#00ADD8' },
    { name: 'Rust', percentage: 5, color: '#000000' }
  ];

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
          <Code2 size={16} className="text-[#E84142]" />
        </div>
        <h3 className="text-lg font-semibold text-white font-['JetBrains_Mono']">Languages</h3>
      </div>

      <div className="space-y-4">
        {languages.map((lang, index) => (
          <div key={lang.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-sm text-gray-300 font-['JetBrains_Mono']">{lang.name}</span>
              </div>
              <span className="text-sm text-white font-['JetBrains_Mono']">{lang.percentage}%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-1.5">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: lang.color }}
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Recent Activity Feed
const RecentActivity = () => {
  const activities = [
    { type: 'commit', repo: 'web-app', message: 'Fix authentication bug', time: '2 hours ago', icon: GitCommit },
    { type: 'pr', repo: 'api-service', message: 'Add user management endpoints', time: '4 hours ago', icon: GitPullRequest },
    { type: 'issue', repo: 'mobile-app', message: 'Performance optimization needed', time: '6 hours ago', icon: GitBranch },
    { type: 'commit', repo: 'dashboard', message: 'Update UI components', time: '1 day ago', icon: GitCommit },
    { type: 'pr', repo: 'backend', message: 'Database migration scripts', time: '2 days ago', icon: GitPullRequest }
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'commit': return 'text-green-400';
      case 'pr': return 'text-blue-400';
      case 'issue': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
          <Activity size={16} className="text-[#E84142]" />
        </div>
        <h3 className="text-lg font-semibold text-white font-['JetBrains_Mono']">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div className={`w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center mt-0.5`}>
                <IconComponent size={12} className={getActivityColor(activity.type)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-['JetBrains_Mono'] truncate">{activity.message}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 font-['JetBrains_Mono']">{activity.repo}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500 font-['JetBrains_Mono']">{activity.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

const Contributions = () => {
  const { user } = useAuth();
  const { data: githubActivity, loading: activityLoading } = useGitHubActivity(user?.username);
  const { data: githubProfile, loading: profileLoading } = useGitHubProfile(user?.username);

  const [isLoading, setIsLoading] = useState(true);

  const loading = activityLoading || profileLoading;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const userData = {
    username: user?.username || 'demo_user',
    totalContributions: githubActivity?.totalContributions || 1247,
    currentStreak: githubActivity?.currentStreak || 23,
    longestStreak: githubActivity?.longestStreak || 45,
    totalRepos: githubProfile?.public_repos || 28,
  };

  if (isLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] p-6">
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
              <Github size={20} className="text-[#E84142]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-['JetBrains_Mono']">Contributions</h1>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">Development activity and performance metrics</p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={GitCommit}
            label="Total Contributions"
            value={userData.totalContributions}
            change="+15%"
            changeType="up"
          />
          <MetricCard
            icon={Flame}
            label="Current Streak"
            value={userData.currentStreak}
            change="+8%"
            changeType="up"
          />
          <MetricCard
            icon={Star}
            label="Longest Streak"
            value={userData.longestStreak}
            change="0%"
            changeType="neutral"
          />
          <MetricCard
            icon={Github}
            label="Repositories"
            value={userData.totalRepos}
            change="+12%"
            changeType="up"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Chart - Takes 2 columns */}
          <ActivityChart />

          {/* Performance Metrics */}
          <PerformanceMetrics />

          {/* Language Distribution */}
          <LanguageDistribution />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
      <AuthDebug pageName="Contributions" />
    </div>
  );
};

export default Contributions;
