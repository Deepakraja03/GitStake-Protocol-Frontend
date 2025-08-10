import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import CountUp from 'react-countup';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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

// Professional Card Component
const Card = ({ children, className = '', hover = false }) => (
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

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, change, changeType, delay = 0 }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
              <Icon size={18} className="text-[#E84142]" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-['Fira_Sans']">{label}</p>
              <p className="text-white text-2xl font-bold font-['Fira_Code'] mt-1">
                <CountUp end={value} duration={1.5} separator="," />
              </p>
            </div>
          </div>
          {change && (
            <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm font-['Fira_Code']">{change}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Activity Chart Component
const ActivityChart = ({ data = [] }) => {
  const defaultData = [
    { date: 'Mon', commits: 12, prs: 3, issues: 2 },
    { date: 'Tue', commits: 8, prs: 5, issues: 1 },
    { date: 'Wed', commits: 15, prs: 2, issues: 4 },
    { date: 'Thu', commits: 6, prs: 7, issues: 3 },
    { date: 'Fri', commits: 20, prs: 4, issues: 1 },
    { date: 'Sat', commits: 3, prs: 1, issues: 0 },
    { date: 'Sun', commits: 5, prs: 2, issues: 1 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
            <Activity size={16} className="text-[#E84142]" />
          </div>
          <h3 className="text-lg font-semibold text-white font-['Fira_Sans']">Activity Overview</h3>
        </div>
        <button className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors">
          <RefreshCw size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E84142" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E84142" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'Fira Code' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'Fira Code' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontFamily: 'Fira Code'
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#E84142"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#commitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Repository List Component with Real Data
const RepositoryList = ({ repositories = [] }) => {
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#F7DF1E',
      TypeScript: '#3178C6',
      Python: '#3776AB',
      CSS: '#1572B6',
      HTML: '#E34F26',
      Java: '#ED8B00',
      Go: '#00ADD8',
      Rust: '#000000',
      'C++': '#00599C'
    };
    return colors[language] || '#6B7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const displayRepos = repositories.slice(0, 6);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
            <Code size={16} className="text-[#E84142]" />
          </div>
          <h3 className="text-lg font-semibold text-white font-['Fira_Sans']">Recent Repositories</h3>
        </div>
        <span className="text-xs text-gray-500 font-['Fira_Code']">{repositories.length} total</span>
      </div>

      <div className="space-y-3">
        {displayRepos.length > 0 ? displayRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-all duration-200 cursor-pointer"
            onClick={() => window.open(repo.html_url, '_blank')}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-white font-['Fira_Code'] text-sm font-medium truncate group-hover:text-[#E84142] transition-colors">
                  {repo.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="font-['Fira_Sans']">{repo.language || 'Unknown'}</span>
                  <span>•</span>
                  <span className="font-['Fira_Sans']">{formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Star size={12} />
                <span className="font-['Fira_Code']">{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitBranch size={12} />
                <span className="font-['Fira_Code']">{repo.forks_count}</span>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-8">
            <Code size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 font-['Fira_Sans'] text-sm">No repositories found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Programming Languages Component
const ProgrammingLanguages = ({ languages = [] }) => {
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#F7DF1E',
      TypeScript: '#3178C6',
      Python: '#3776AB',
      CSS: '#1572B6',
      HTML: '#E34F26',
      Java: '#ED8B00',
      Go: '#00ADD8',
      Rust: '#000000',
      'C++': '#00599C'
    };
    return colors[language] || '#6B7280';
  };

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
          <Code size={16} className="text-[#E84142]" />
        </div>
        <h3 className="text-lg font-semibold text-white font-['Fira_Sans']">Languages</h3>
      </div>

      <div className="space-y-4">
        {languages.map((lang, index) => (
          <div key={lang.language} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang.language) }}
                />
                <span className="text-sm text-gray-300 font-['Fira_Sans']">{lang.language}</span>
              </div>
              <span className="text-sm text-white font-['Fira_Code']">{lang.percentage}%</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-1.5">
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

// Insights Panel Component
const InsightsPanel = ({ insights, analytics }) => {
  if (!insights) return null;

  const getSkillLevelColor = (level) => {
    const colors = {
      'Beginner': 'text-yellow-400',
      'Intermediate': 'text-blue-400',
      'Advanced': 'text-green-400',
      'Expert': 'text-purple-400'
    };
    return colors[level] || 'text-gray-400';
  };

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
          <Target size={16} className="text-[#E84142]" />
        </div>
        <h3 className="text-lg font-semibold text-white font-['Fira_Sans']">AI Insights</h3>
      </div>

      <div className="space-y-6">
        {/* Skill Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
          <span className="text-sm text-gray-400 font-['Fira_Sans']">Skill Level</span>
          <span className={`text-sm font-bold font-['Fira_Code'] ${getSkillLevelColor(insights.skillLevel)}`}>
            {insights.skillLevel}
          </span>
        </div>

        {/* Proficiency Score */}
        {analytics?.proficiencyScore && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-['Fira_Sans']">Proficiency Score</span>
              <span className="text-sm text-white font-['Fira_Code']">{analytics.proficiencyScore}/10</span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[#E84142] to-[#9B2CFF]"
                initial={{ width: 0 }}
                animate={{ width: `${(analytics.proficiencyScore / 10) * 100}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        )}

        {/* Strengths */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 font-['Fira_Sans']">Strengths</h4>
          <div className="space-y-2">
            {insights.strengths?.map((strength, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-gray-300 font-['Fira_Sans']">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 font-['Fira_Sans']">Recommendations</h4>
          <div className="space-y-2">
            {insights.recommendations?.map((rec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs text-gray-300 font-['Fira_Sans']">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};



const Dashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const dashboardData = useGitHubDashboard(user?.username || 'Thenmozhi-k');

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
      delay: 0
    },
    {
      icon: GitPullRequest,
      label: 'Pull Requests',
      value: dashboardData.analytics?.totalPRs || 0,
      change: dashboardData.analytics?.totalPRs > 0 ? '+8%' : '0%',
      changeType: dashboardData.analytics?.totalPRs > 0 ? 'up' : 'neutral',
      delay: 0.1
    },
    {
      icon: Star,
      label: 'Total Stars',
      value: totalStars,
      change: totalStars > 0 ? '+23%' : '0%',
      changeType: totalStars > 0 ? 'up' : 'neutral',
      delay: 0.2
    },
    {
      icon: GitBranch,
      label: 'Repositories',
      value: dashboardData.analytics?.repoCount || 0,
      change: '+12%',
      changeType: 'up',
      delay: 0.3
    }
  ];

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#E84142]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-2 border-[#E84142] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 font-['Fira_Sans'] text-sm mt-4">Loading Dashboard...</p>
        </div>
      </div>
    );
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {dashboardData.profile?.avatarUrl && (
                <img
                  src={dashboardData.profile.avatarUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-xl border border-white/[0.1]"
                />
              )}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
                <Activity size={20} className="text-[#E84142]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-['Fira_Code']">Dashboard</h1>
                <p className="text-gray-400 text-sm font-['Fira_Sans']">
                  Welcome back, {dashboardData.profile?.name || dashboardData.profile?.username || 'Developer'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Skill Level Badge */}
              {dashboardData.insights?.skillLevel && (
                <div className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                  <span className="text-xs text-gray-300 font-['Fira_Sans']">Skill Level: </span>
                  <span className="text-xs font-bold text-[#E84142] font-['Fira_Code']">
                    {dashboardData.insights.skillLevel}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {['7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-xs font-['Fira_Code'] rounded-md transition-all duration-200 ${
                      timeRange === range
                        ? 'bg-[#E84142]/20 text-[#E84142] border border-[#E84142]/30'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Activity Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityChart data={dashboardData.activity} />
          </div>

          {/* Programming Languages */}
          <ProgrammingLanguages languages={dashboardData.analytics?.programmingLanguages || []} />

          {/* Insights Panel */}
          <InsightsPanel insights={dashboardData.insights} analytics={dashboardData.analytics} />
        </div>

        {/* Repository List */}
        <div className="grid lg:grid-cols-1 gap-6">
          <RepositoryList repositories={dashboardData.repositories} />
        </div>

        {/* Profile Summary */}
        {dashboardData.insights?.profileSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 flex items-center justify-center">
                  <Users size={16} className="text-[#E84142]" />
                </div>
                <h3 className="text-lg font-semibold text-white font-['Fira_Sans']">AI Profile Summary</h3>
              </div>
              <p className="text-gray-300 leading-relaxed font-['Fira_Sans'] text-sm">
                {dashboardData.insights.profileSummary}
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;