import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthDebug from '../components/AuthDebug';
import {
  Github,
  GitCommit,
  GitPullRequest,
  GitBranch,
  Star,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Code,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  GitMerge,
  Clock,
  Flame,
  ChevronRight,
  Brain,
  Shield
} from 'lucide-react';
import CountUp from 'react-countup';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';

// Import GitHub service
import { githubService } from '../services/githubService';
import { useAuthContext as useAuth } from '../context/AuthContext';

// Professional Dashboard Hook for Real API Data
const useGitHubDashboard = (username) => {
  const [data, setData] = useState({
    analytics: null,
    repositories: [],
    profile: null,
    insights: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchRealData = async () => {
      if (!username) return;

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch real data using GitHub service
        const [analyticsResponse, reposResponse] = await Promise.all([
          githubService.getUserAnalytics(username),
          githubService.getUserRepositories(username)
        ]);

        // Since we're using the service methods directly, the response structure is different
        if (analyticsResponse && reposResponse) {
          setData({
            analytics: analyticsResponse.data.analytics,
            repositories: reposResponse.data,
            profile: {
              username: analyticsResponse.data.username,
              name: analyticsResponse.data.name,
              avatarUrl: analyticsResponse.data.avatarUrl
            },
            insights: analyticsResponse.data.insights,
            loading: false,
            error: null
          });
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching real data:', error);
        // Fallback to demo data if API fails
        setData({
          analytics: {
            streak: { current: 1, longest: 1 },
            totalCommits: 138,
            totalPRs: 0,
            totalIssues: 0,
            totalMerges: 0,
            emptyCommits: 5,
            programmingLanguages: [
              { language: "JavaScript", count: 794581, percentage: 89 },
              { language: "CSS", count: 64698, percentage: 7 },
              { language: "HTML", count: 29527, percentage: 3 }
            ],
            repoCount: 19,
            proficiencyScore: 7
          },
          repositories: [],
          profile: { username: username, name: 'Developer', avatarUrl: null },
          insights: {
            profileSummary: "Loading insights...",
            strengths: ["Consistent commit activity", "Focus on JavaScript"],
            recommendations: ["Increase collaborative contributions"],
            skillLevel: "Beginner"
          },
          loading: false,
          error: error.message
        });
      }
    };

    fetchRealData();
  }, [username]);

  return data;
};

// Ultra Dark Card Component
const Card = ({ children, className = '', hover = false, fullHeight = false }) => (
  <motion.div
    className={`
      relative overflow-hidden rounded-xl border
      bg-gray-900/60 backdrop-blur-xl border-gray-700/30
      ${hover ? 'hover:bg-gray-800/60 hover:border-gray-600/40 transition-all duration-300' : ''}
      ${fullHeight ? 'h-full' : ''}
      ${className}
    `}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent pointer-events-none" />
    <div className={`relative ${fullHeight ? 'h-full flex flex-col' : ''} p-6`}>
      {children}
    </div>
  </motion.div>
);

// Enhanced Metric Card Component
const MetricCard = ({ icon: Icon, label, value, change, changeType, delay = 0, description }) => {
  const getChangeIcon = () => {
    if (changeType === 'up') return <ArrowUpRight size={12} className="text-green-400" />;
    if (changeType === 'down') return <ArrowDownRight size={12} className="text-red-400" />;
    return <Minus size={12} className="text-gray-400" />;
  };

  const getChangeColor = () => {
    if (changeType === 'up') return 'text-green-400 bg-green-900/20 border-green-700/30';
    if (changeType === 'down') return 'text-red-400 bg-red-900/20 border-red-700/30';
    return 'text-gray-400 bg-gray-800/20 border-gray-700/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center backdrop-blur-xl">
              <Icon size={18} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
              <div className="text-white text-2xl font-bold font-mono">
                <CountUp end={value} duration={1.5} separator="," />
              </div>
            </div>
          </div>
          {change && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        )}
      </Card>
    </motion.div>
  );
};

// Enhanced Activity Chart Component
const ActivityChart = ({ data = [] }) => {
  const [chartView, setChartView] = useState('area');
  
  const defaultData = [
    { date: 'Mon', commits: 12, prs: 3, issues: 2, contributions: 17 },
    { date: 'Tue', commits: 8, prs: 5, issues: 1, contributions: 14 },
    { date: 'Wed', commits: 15, prs: 2, issues: 4, contributions: 21 },
    { date: 'Thu', commits: 6, prs: 7, issues: 3, contributions: 16 },
    { date: 'Fri', commits: 20, prs: 4, issues: 1, contributions: 25 },
    { date: 'Sat', commits: 3, prs: 1, issues: 0, contributions: 4 },
    { date: 'Sun', commits: 5, prs: 2, issues: 1, contributions: 8 }
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const totalContributions = chartData.reduce((sum, day) => sum + (day.contributions || day.commits + day.prs + day.issues), 0);

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: "100%"
    };

    return (
      <ResponsiveContainer {...commonProps}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'ui-monospace' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'ui-monospace' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontFamily: 'ui-sans-serif',
              fontSize: '12px'
            }}
            labelStyle={{ color: '#d1d5db' }}
          />
          <Area
            type="monotone"
            dataKey="commits"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#commitGradient)"
            name="Commits"
          />
          <Area
            type="monotone"
            dataKey="prs"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#prGradient)"
            name="Pull Requests"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card fullHeight>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
            <Activity size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
            <p className="text-gray-400 text-sm">{totalContributions} total contributions this week</p>
          </div>
        </div>

        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-300">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-64">
          {renderChart()}
        </div>

        {/* Activity Summary */}
        <div className=" grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/30">
          <div className="text-center">
            <div className="text-xl font-bold text-white font-mono">
              {chartData.reduce((sum, day) => sum + day.commits, 0)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Commits</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white font-mono">
              {chartData.reduce((sum, day) => sum + day.prs, 0)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">PRs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white font-mono">
              {chartData.reduce((sum, day) => sum + day.issues, 0)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Issues</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Compact Insights Panel Component
const InsightsPanel = ({ insights, analytics }) => {
  if (!insights) return null;

  const getSkillLevelColor = (level) => {
    const colors = {
      'Beginner': 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30',
      'Intermediate': 'text-blue-400 bg-blue-900/20 border-blue-700/30',
      'Advanced': 'text-green-400 bg-green-900/20 border-green-700/30',
      'Expert': 'text-purple-400 bg-purple-900/20 border-purple-700/30'
    };
    return colors[level] || 'text-gray-400 bg-gray-800/20 border-gray-700/30';
  };

  return (
    <Card fullHeight>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
          <Brain size={16} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          <p className="text-gray-400 text-sm">Performance analysis</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Skill Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <span className="text-sm text-gray-400 font-medium">Skill Level</span>
          <span className={`text-sm font-bold px-2 py-1 rounded border ${getSkillLevelColor(insights.skillLevel)}`}>
            {insights.skillLevel}
          </span>
        </div>

        {/* Proficiency Score */}
        {analytics?.proficiencyScore && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">Proficiency</span>
              <span className="text-sm text-white font-mono">{analytics.proficiencyScore}/10</span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(analytics.proficiencyScore / 10) * 100}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        )}

        {/* Compact Strengths */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
            <Shield size={14} className="text-green-400 mr-2" />
            Strengths
          </h4>
          <div className="space-y-1">
            {insights.strengths?.slice(0, 2).map((strength, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                <span className="text-xs text-gray-300">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Recommendations */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
            <TrendingUp size={14} className="text-blue-400 mr-2" />
            Growth Areas
          </h4>
          <div className="space-y-1">
            {insights.recommendations?.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-blue-400" />
                <span className="text-xs text-gray-300">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Stats */}
        {analytics?.streak && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700/30 mt-auto">
            <div className="text-center">
              <div className="text-lg font-bold text-white font-mono mb-1">
                {analytics.streak.current}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Current</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white font-mono mb-1">
                {analytics.streak.longest}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Best</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced Repository List Component
const RepositoryList = ({ repositories = [] }) => {
  const [showAll, setShowAll] = useState(false);
  
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      CSS: '#1572b6',
      HTML: '#e34f26',
      Java: '#ed8b00',
      Go: '#00add8',
      Rust: '#dea584',
      'C++': '#00599c'
    };
    return colors[language] || '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w`;
    return `${Math.ceil(diffDays / 30)}m`;
  };

  const displayRepos = showAll ? repositories : repositories.slice(0, 8);

  return (
    <Card fullHeight>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
            <Code size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Repositories</h3>
            <p className="text-gray-400 text-sm">{repositories.length} total repos</p>
          </div>
        </div>
        
        {repositories.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs px-3 py-1 rounded-md bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showAll ? 'Less' : 'All'}
          </button>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {displayRepos.length > 0 ? displayRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group rounded-lg bg-gray-800/30 hover:bg-gray-700/40 border border-gray-700/30 hover:border-gray-600/40 transition-all duration-200 cursor-pointer p-3"
            onClick={() => window.open(repo.html_url, '_blank')}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-medium text-sm truncate group-hover:text-cyan-400 transition-colors">
                    {repo.name}
                  </h4>
                  {repo.private && (
                    <span className="px-1 py-0.5 bg-yellow-900/30 text-yellow-400 text-xs rounded">
                      Private
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span>{repo.language || 'Unknown'}</span>
                  <span>•</span>
                  <span>{formatDate(repo.updated_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star size={12} />
                  <span className="font-mono">{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitBranch size={12} />
                  <span className="font-mono">{repo.forks_count}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-8">
            <Code size={24} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No repositories found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced Programming Languages Component
const ProgrammingLanguages = ({ languages = [] }) => {
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      CSS: '#1572b6',
      HTML: '#e34f26',
      Java: '#ed8b00',
      Go: '#00add8',
      Rust: '#dea584',
      'C++': '#00599c'
    };
    return colors[language] || '#6b7280';
  };

  return (
    <Card fullHeight>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
          <Code size={16} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Languages</h3>
          <p className="text-gray-400 text-sm">Code distribution</p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {languages.map((lang, index) => (
          <div key={lang.language} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full border border-gray-600"
                  style={{ backgroundColor: getLanguageColor(lang.language) }}
                />
                <span className="text-sm text-gray-300 font-medium">{lang.language}</span>
              </div>
              <span className="text-sm text-white font-mono">{lang.percentage}%</span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-1.5">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: getLanguageColor(lang.language) }}
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

// Enhanced Main Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const dashboardData = useGitHubDashboard(user?.username || 'Thenmozhi-k');

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Calculate total stars from repositories
  const totalStars = dashboardData.repositories?.reduce((acc, repo) => acc + repo.stargazers_count, 0) || 0;
  const totalForks = dashboardData.repositories?.reduce((acc, repo) => acc + repo.forks_count, 0) || 0;

  const metrics = [
    {
      icon: GitCommit,
      label: 'Total Commits',
      value: dashboardData.analytics?.totalCommits || 0,
      change: dashboardData.analytics?.totalCommits > 100 ? '+15%' : '+5%',
      changeType: 'up',
      delay: 0,
      description: 'Code contributions across repositories'
    },
    {
      icon: GitPullRequest,
      label: 'Pull Requests',
      value: dashboardData.analytics?.totalPRs || 0,
      change: dashboardData.analytics?.totalPRs > 0 ? '+8%' : '0%',
      changeType: dashboardData.analytics?.totalPRs > 0 ? 'up' : 'neutral',
      delay: 0.1,
      description: 'Collaborative contributions'
    },
    {
      icon: Star,
      label: 'Total Stars',
      value: totalStars,
      change: totalStars > 0 ? '+23%' : '0%',
      changeType: totalStars > 0 ? 'up' : 'neutral',
      delay: 0.2,
      description: 'Community appreciation'
    },
    {
      icon: GitBranch,
      label: 'Repositories',
      value: dashboardData.analytics?.repoCount || 0,
      change: '+12%',
      changeType: 'up',
      delay: 0.3,
      description: 'Active projects'
    }
  ];

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white text-lg font-semibold">Loading Dashboard</h3>
            <p className="text-gray-400 text-sm">Fetching GitHub analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: rgba(75, 85, 99, 0.5);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: rgba(75, 85, 99, 0.7);
        }
        * { scrollbar-width: thin; scrollbar-color: rgba(75, 85, 99, 0.5) transparent; }
      `}</style>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {dashboardData.profile?.avatarUrl ? (
                  <img
                    src={dashboardData.profile.avatarUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-xl border-2 border-gray-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                    <Users size={20} className="text-cyan-400" />
                  </div>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    GitHub Dashboard
                  </h1>
                  <div className="flex items-center space-x-3 text-sm">
                    <p className="text-gray-400">
                      Welcome back, <span className="text-white font-medium">{dashboardData.profile?.name || dashboardData.profile?.username || 'Developer'}</span>
                    </p>
                    <div className="w-1 h-1 bg-gray-600 rounded-full" />
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Skill Level Badge */}
                {dashboardData.insights?.skillLevel && (
                  <div className="px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-gray-300 text-xs">Level:</span>
                      <span className="text-cyan-400 font-bold text-xs">
                        {dashboardData.insights.skillLevel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Time Range Selector */}
                <div className="flex items-center space-x-1 bg-gray-800/60 p-1 rounded-lg border border-gray-700/50">
                  {['7d', '30d', '90d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        timeRange === range
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 text-gray-400 hover:text-gray-300 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Content Grid - Fixed Height Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Activity Chart */}
            <div className="h-[420px]">
              <ActivityChart data={dashboardData.activity} />
            </div>

            {/* Insights Panel */}
            <div className="h-[420px]">
              <InsightsPanel insights={dashboardData.insights} analytics={dashboardData.analytics} />
            </div>
          </div>

          {/* Secondary Content Grid - Fixed Height Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Repository List - Takes 2 columns */}
            <div className="lg:col-span-2 h-[480px]">
              <RepositoryList repositories={dashboardData.repositories} />
            </div>

            {/* Programming Languages - Takes 1 column */}
            <div className="h-[480px]">
              <ProgrammingLanguages languages={dashboardData.analytics?.programmingLanguages || []} />
            </div>
          </div>

          {/* Profile Summary */}
          {dashboardData.insights?.profileSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                    <Brain size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">AI Profile Summary</h3>
                    <p className="text-gray-400 text-sm">Generated insights based on coding patterns</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {dashboardData.insights.profileSummary}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Additional Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white font-mono mb-1">
                {dashboardData.analytics?.streak?.current || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Current Streak</div>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white font-mono mb-1">
                {dashboardData.analytics?.streak?.longest || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Longest Streak</div>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white font-mono mb-1">
                {totalForks}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Forks</div>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white font-mono mb-1">
                {dashboardData.analytics?.totalIssues || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Issues Opened</div>
            </div>
          </div>
        </div>
      </div>
      {/* <AuthDebug pageName="Dashboard" /> */}
    </div>
  );
};

export default Dashboard;