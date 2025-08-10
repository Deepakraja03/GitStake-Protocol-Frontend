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
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  GitMerge,
  Clock,
  Flame,
  ChevronRight
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
  Cell
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

// Modern Card Component with Glass Effect
const Card = ({ children, className = '', hover = false, gradient = false }) => (
  <motion.div
    className={`
      relative overflow-hidden rounded-2xl border backdrop-blur-xl
      ${gradient 
        ? 'bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-indigo-200/10' 
        : 'bg-white/[0.03] border-white/[0.08]'
      }
      ${hover ? 'hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300' : ''}
      ${className}
    `}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative p-6">
      {children}
    </div>
  </motion.div>
);

// Enhanced Metric Card Component
const MetricCard = ({ icon: Icon, label, value, change, changeType, delay = 0, description, trend }) => {
  const getChangeIcon = () => {
    if (changeType === 'up') return <ArrowUpRight size={14} className="text-emerald-400" />;
    if (changeType === 'down') return <ArrowDownRight size={14} className="text-rose-400" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  const getChangeColor = () => {
    if (changeType === 'up') return 'text-emerald-400 bg-emerald-500/10';
    if (changeType === 'down') return 'text-rose-400 bg-rose-500/10';
    return 'text-slate-400 bg-slate-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover gradient>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center backdrop-blur-xl">
              <Icon size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
              <div className="text-white text-2xl font-bold font-mono">
                <CountUp end={value} duration={1.5} separator="," />
              </div>
            </div>
          </div>
          {change && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
        )}

        {trend && (
          <div className="mt-3 flex items-center space-x-2">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${trend}%` }}
                transition={{ duration: 1.5, delay: delay + 0.5 }}
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">{trend}%</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Enhanced Activity Chart Component with Multiple Views
const ActivityChart = ({ data = [], viewType = 'area' }) => {
  const [chartView, setChartView] = useState(viewType);
  
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

    if (chartView === 'area') {
      return (
        <ResponsiveContainer {...commonProps}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'ui-monospace' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'ui-monospace' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(100, 116, 139, 0.2)',
                borderRadius: '12px',
                fontFamily: 'ui-sans-serif',
                backdropFilter: 'blur(12px)'
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#areaGradient)"
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
    }

    if (chartView === 'line') {
      return (
        <ResponsiveContainer {...commonProps}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'ui-monospace' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'ui-monospace' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(100, 116, 139, 0.2)',
                borderRadius: '12px',
                fontFamily: 'ui-sans-serif',
                backdropFilter: 'blur(12px)'
              }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              name="Commits"
            />
            <Line
              type="monotone"
              dataKey="prs"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Pull Requests"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer {...commonProps}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'ui-monospace' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'ui-monospace' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              borderRadius: '12px',
              fontFamily: 'ui-sans-serif'
            }}
          />
          <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} name="Commits" />
          <Bar dataKey="prs" fill="#10b981" radius={[4, 4, 0, 0]} name="Pull Requests" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card gradient>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Activity size={18} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Activity Overview</h3>
            <p className="text-slate-400 text-sm">{totalContributions} total contributions this week</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg">
            {[
              { type: 'area', icon: AreaChart },
              { type: 'line', icon: LineChart },
              { type: 'bar', icon: BarChart3 }
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setChartView(type)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  chartView === type
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-300">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="h-80">
        {renderChart()}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white font-mono">
            {chartData.reduce((sum, day) => sum + day.commits, 0)}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Commits</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white font-mono">
            {chartData.reduce((sum, day) => sum + day.prs, 0)}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Pull Requests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white font-mono">
            {chartData.reduce((sum, day) => sum + day.issues, 0)}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Issues</div>
        </div>
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

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const displayRepos = showAll ? repositories : repositories.slice(0, 6);

  return (
    <Card gradient>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Code size={18} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Recent Repositories</h3>
            <p className="text-slate-400 text-sm">{repositories.length} total repositories</p>
          </div>
        </div>
        
        {repositories.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors text-sm font-medium"
          >
            <span>{showAll ? 'Show Less' : 'View All'}</span>
            <ChevronRight size={14} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayRepos.length > 0 ? displayRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 cursor-pointer"
            onClick={() => window.open(repo.html_url, '_blank')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-4 flex items-center space-x-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-medium text-sm truncate group-hover:text-indigo-400 transition-colors">
                    {repo.name}
                  </h4>
                  {repo.private && (
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded font-medium">
                      Private
                    </span>
                  )}
                </div>
                
                {repo.description && (
                  <p className="text-slate-400 text-xs mb-2 line-clamp-1">
                    {repo.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span>{repo.language || 'Unknown'}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock size={10} />
                    <span>{formatDate(repo.updated_at)}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-slate-400">
                <div className="flex items-center space-x-1">
                  <Star size={14} />
                  <span className="font-mono text-sm">{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitBranch size={14} />
                  <span className="font-mono text-sm">{repo.forks_count}</span>
                </div>
                {repo.watchers_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span className="font-mono text-sm">{repo.watchers_count}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-400/30 flex items-center justify-center">
              <Code size={24} className="text-slate-400" />
            </div>
            <h4 className="text-slate-300 font-medium mb-2">No repositories found</h4>
            <p className="text-slate-500 text-sm">Start creating repositories to see them here</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced Programming Languages Component with Pie Chart
const ProgrammingLanguages = ({ languages = [] }) => {
  const [viewMode, setViewMode] = useState('bars');
  
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

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

  const pieData = languages.map((lang, index) => ({
    name: lang.language,
    value: lang.percentage,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card gradient>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Code size={18} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Languages</h3>
            <p className="text-slate-400 text-sm">Top programming languages</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg">
          {[
            { mode: 'bars', icon: BarChart3 },
            { mode: 'pie', icon: PieChart }
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'bars' ? (
        <div className="space-y-4">
          {languages.map((lang, index) => (
            <div key={lang.language} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white/10"
                    style={{ backgroundColor: getLanguageColor(lang.language) }}
                  />
                  <span className="text-slate-300 font-medium">{lang.language}</span>
                  <span className="text-slate-500 text-sm font-mono">{lang.count?.toLocaleString() || 0} bytes</span>
                </div>
                <span className="text-white font-bold font-mono">{lang.percentage}%</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full relative overflow-hidden"
                    style={{ backgroundColor: getLanguageColor(lang.language) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    borderRadius: '8px',
                    fontFamily: 'ui-sans-serif'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            {pieData.map((lang, index) => (
              <div key={lang.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-slate-400 text-sm">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

// Enhanced Insights Panel Component
const InsightsPanel = ({ insights, analytics }) => {
  if (!insights) return null;

  const getSkillLevelColor = (level) => {
    const colors = {
      'Beginner': 'text-amber-400 bg-amber-500/10 border-amber-400/30',
      'Intermediate': 'text-blue-400 bg-blue-500/10 border-blue-400/30',
      'Advanced': 'text-emerald-400 bg-emerald-500/10 border-emerald-400/30',
      'Expert': 'text-purple-400 bg-purple-500/10 border-purple-400/30'
    };
    return colors[level] || 'text-slate-400 bg-slate-500/10 border-slate-400/30';
  };

  const getSkillLevelIcon = (level) => {
    const icons = {
      'Beginner': Target,
      'Intermediate': TrendingUp,
      'Advanced': Award,
      'Expert': Zap
    };
    const Icon = icons[level] || Target;
    return <Icon size={16} />;
  };

  return (
    <Card gradient>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center">
          <Target size={18} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">AI Insights</h3>
          <p className="text-slate-400 text-sm">Performance analysis & recommendations</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Skill Level Badge */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.05] border border-white/[0.08] p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${getSkillLevelColor(insights.skillLevel)}`}>
                {getSkillLevelIcon(insights.skillLevel)}
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Current Level</p>
                <p className={`font-bold font-mono ${getSkillLevelColor(insights.skillLevel).split(' ')[0]}`}>
                  {insights.skillLevel}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Next milestone</p>
              <p className="text-slate-300 text-sm font-medium">Keep coding! 🚀</p>
            </div>
          </div>
        </div>

        {/* Proficiency Score */}
        {analytics?.proficiencyScore && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame size={16} className="text-orange-400" />
                <span className="text-slate-300 font-medium">Proficiency Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white font-mono">{analytics.proficiencyScore}</span>
                <span className="text-slate-400 font-mono">/10</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${(analytics.proficiencyScore / 10) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
              
              {/* Score markers */}
              <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-slate-500 font-mono">
                {[0, 2, 4, 6, 8, 10].map(score => (
                  <span key={score} className={analytics.proficiencyScore >= score ? 'text-slate-300' : ''}>
                    {score}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Strengths */}
        <div className="space-y-4">
          <h4 className="text-slate-200 font-semibold flex items-center space-x-2">
            <Award size={16} className="text-emerald-400" />
            <span>Strengths</span>
          </h4>
          <div className="space-y-3">
            {insights.strengths?.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-400/10"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <p className="text-slate-300 text-sm leading-relaxed">{strength}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h4 className="text-slate-200 font-semibold flex items-center space-x-2">
            <TrendingUp size={16} className="text-blue-400" />
            <span>Growth Areas</span>
          </h4>
          <div className="space-y-3">
            {insights.recommendations?.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-blue-500/5 border border-blue-400/10"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        {analytics?.streak && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <div className="text-xl font-bold text-white font-mono mb-1">
                {analytics.streak.current}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white font-mono mb-1">
                {analytics.streak.longest}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Best Streak</div>
            </div>
          </div>
        )}
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
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Calculate total stars from repositories
  const totalStars = dashboardData.repositories?.reduce((acc, repo) => acc + repo.stargazers_count, 0) || 0;
  const totalForks = dashboardData.repositories?.reduce((acc, repo) => acc + repo.forks_count, 0) || 0;
  const totalWatchers = dashboardData.repositories?.reduce((acc, repo) => acc + repo.watchers_count, 0) || 0;

  const metrics = [
    {
      icon: GitCommit,
      label: 'Total Commits',
      value: dashboardData.analytics?.totalCommits || 0,
      change: dashboardData.analytics?.totalCommits > 100 ? '+15%' : '+5%',
      changeType: 'up',
      delay: 0,
      description: 'Code contributions across all repositories',
      trend: Math.min(85, (dashboardData.analytics?.totalCommits || 0) / 2)
    },
    {
      icon: GitPullRequest,
      label: 'Pull Requests',
      value: dashboardData.analytics?.totalPRs || 0,
      change: dashboardData.analytics?.totalPRs > 0 ? '+8%' : '0%',
      changeType: dashboardData.analytics?.totalPRs > 0 ? 'up' : 'neutral',
      delay: 0.1,
      description: 'Collaborative contributions and reviews',
      trend: Math.min(65, (dashboardData.analytics?.totalPRs || 0) * 10)
    },
    {
      icon: Star,
      label: 'Total Stars',
      value: totalStars,
      change: totalStars > 0 ? '+23%' : '0%',
      changeType: totalStars > 0 ? 'up' : 'neutral',
      delay: 0.2,
      description: 'Community appreciation for your work',
      trend: Math.min(75, totalStars * 5)
    },
    {
      icon: GitBranch,
      label: 'Repositories',
      value: dashboardData.analytics?.repoCount || 0,
      change: '+12%',
      changeType: 'up',
      delay: 0.3,
      description: 'Active projects and contributions',
      trend: Math.min(90, (dashboardData.analytics?.repoCount || 0) * 4)
    }
  ];

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-indigo-200/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white text-xl font-semibold">Loading Dashboard</h3>
            <p className="text-slate-400 text-sm">Fetching your GitHub analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
        }
        * { scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.3) transparent; }
      `}</style>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {dashboardData.profile?.avatarUrl ? (
                    <img
                      src={dashboardData.profile.avatarUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400/30 flex items-center justify-center">
                      <Users size={24} className="text-indigo-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Developer Dashboard
                  </h1>
                  <div className="flex items-center space-x-4">
                    <p className="text-slate-400">
                      Welcome back, <span className="text-white font-medium">{dashboardData.profile?.name || dashboardData.profile?.username || 'Developer'}</span>
                    </p>
                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Calendar size={14} />
                      <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Skill Level Badge */}
                {dashboardData.insights?.skillLevel && (
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 backdrop-blur-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                      <span className="text-slate-300 text-sm">Level: </span>
                      <span className="text-indigo-400 font-bold text-sm">
                        {dashboardData.insights.skillLevel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Time Range Selector */}
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-white/10">
                  {['7d', '30d', '90d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        timeRange === range
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 shadow-lg'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
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
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-300 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-6 gap-6 mb-8">
            {/* Activity Chart - Takes 4 columns */}
            <div className="lg:col-span-4">
              <ActivityChart data={dashboardData.activity} />
            </div>

            {/* Insights Panel - Takes 2 columns */}
            <div className="lg:col-span-2">
              <InsightsPanel insights={dashboardData.insights} analytics={dashboardData.analytics} />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Repository List - Takes 3 columns */}
            <div className="lg:col-span-3">
              <RepositoryList repositories={dashboardData.repositories} />
            </div>

            {/* Programming Languages - Takes 2 columns */}
            <div className="lg:col-span-2">
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
              <Card gradient>
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <Users size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Profile Summary</h3>
                    <p className="text-slate-400 text-sm">Generated insights based on your coding patterns</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl p-6 border border-white/5">
                  <p className="text-slate-300 leading-relaxed">
                    {dashboardData.insights.profileSummary}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;