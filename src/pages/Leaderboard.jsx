import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, GitCommit, DollarSign, Target, Search, Filter, Crown, Star, Zap, Code, Award, Medal, GitBranch } from 'lucide-react';
import CountUp from 'react-countup';
import { userService } from '../services/userService';
import { leaderboardService } from '../services/leaderBoard';

// Landing Background Component
const LandingBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,65,66,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(155,44,255,0.1),transparent_50%)]" />
  </div>
);

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen relative">
    <LandingBackground />
    <div className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#E84142] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white font-semibold text-lg font-['Fira_Sans']">
          Loading Leaderboard...
        </p>
      </div>
    </div>
  </div>
);

// Modern Card Component with Landing Page Theme
const ModernCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-all duration-300 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -2 }}
  >
    {children}
  </motion.div>
);

// Stats Card Component with Landing Page Theme
const StatsCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  delay,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20",
    green:
      "bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20",
    purple:
      "bg-gradient-to-r from-[#9B2CFF]/10 to-purple-600/10 border border-[#9B2CFF]/20",
    orange:
      "bg-gradient-to-r from-[#E84142]/10 to-orange-600/10 border border-[#E84142]/20",
  };

  const iconColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-[#9B2CFF]",
    orange: "text-[#E84142]",
  };

  return (
    <ModernCard
      delay={delay}
      className="text-center hover:scale-105 transition-transform duration-300"
    >
      <div
        className={`w-16 h-16 rounded-xl ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}
      >
        <Icon size={28} className={`${iconColors[color]}`} />
      </div>
      <h3 className="text-3xl font-bold text-white mb-2 font-['Fira_Code']">
        <CountUp end={value} duration={2} separator="," />
      </h3>
      <p className="text-lg font-semibold text-gray-300 mb-1 font-['Fira_Sans']">
        {title}
      </p>
      <div className="text-sm text-gray-400 font-['Fira_Sans']">{subtitle}</div>
    </ModernCard>
  );
};

// Enhanced User Avatar Component with Landing Page Theme
const UserAvatar = ({ user, size = "lg", rank }) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const getRankColors = () => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-slate-300 to-slate-500";
    if (rank === 3) return "from-amber-500 to-amber-700";
    return "from-[#E84142] to-[#9B2CFF]";
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div
        className={`w-full h-full rounded-full bg-gradient-to-r ${getRankColors()} p-0.5 shadow-xl`}
      >
        <div className="w-full h-full rounded-full bg-[#0F1419] flex items-center justify-center overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full bg-gradient-to-r ${getRankColors()} flex items-center justify-center ${
              user.avatarUrl ? "hidden" : "flex"
            }`}
            style={{ display: user.avatarUrl ? "none" : "flex" }}
          >
            <span className="text-white font-bold text-xl font-['Fira_Code']">
              {(user.name || user.username || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Rank Badge */}
      {rank <= 3 && (
        <motion.div
          className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0F1419] shadow-lg
            ${
              rank === 1
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                : rank === 2
                ? "bg-gradient-to-r from-slate-300 to-slate-500"
                : "bg-gradient-to-r from-amber-500 to-amber-700"
            }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {rank === 1 ? (
            <Crown size={16} className="text-white" />
          ) : (
            <span className="text-white font-bold text-sm font-['Fira_Code']">
              {rank}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Updated Podium Component with Landing Page Theme
const PodiumDisplay = ({ leaderboardData }) => {
  if (!leaderboardData || leaderboardData.length < 3) {
    return (
      <div className="text-center py-16">
        <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 font-semibold font-['Fira_Sans']">
          Not enough data for podium display
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="relative mb-16 backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E84142]/10 via-[#9B2CFF]/5 to-[#E84142]/10 pointer-events-none"></div>

      <div className="flex items-end justify-center gap-8 max-w-5xl mx-auto relative">
        {/* 2nd Place */}
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex flex-col items-center mb-6 z-10">
            <UserAvatar user={leaderboardData[1]} size="lg" rank={2} />

            <motion.h3
              className="text-white font-bold text-xl mt-4 mb-1 font-['Fira_Sans']"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {leaderboardData[1]?.name || leaderboardData[1]?.username}
            </motion.h3>

            {leaderboardData[1]?.developerLevel && (
              <motion.div
                className="text-sm text-gray-300 mb-2 flex items-center justify-center bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1] font-['Fira_Sans']"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15 }}
              >
                <span className="mr-1">
                  {leaderboardData[1].developerLevel.emoji}
                </span>
                {leaderboardData[1].developerLevel.name}
              </motion.div>
            )}

            <motion.div
              className="text-2xl font-bold text-gray-300 mb-2 font-['Fira_Code']"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              <CountUp
                end={leaderboardData[1]?.points || 0}
                duration={2.5}
                separator=","
              />
            </motion.div>

            <div className="text-sm text-gray-400 font-['Fira_Sans']">
              @{leaderboardData[1]?.username}
            </div>
          </div>

          <motion.div
            className="w-32 h-32 bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-xl relative shadow-2xl border-t-4 border-slate-400"
            initial={{ height: 0 }}
            animate={{ height: 128 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          >
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <Medal size={24} className="text-white" />
            </div>
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white font-['Fira_Code']">
              2
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-t-xl bg-gradient-to-t from-transparent to-slate-400/20"></div>
          </motion.div>
        </motion.div>

        {/* 1st Place - Winner */}
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex flex-col items-center mb-6 z-10">
            <motion.div
              className="mb-3"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Crown className="text-yellow-400" size={32} />
            </motion.div>

            <UserAvatar user={leaderboardData[0]} size="xl" rank={1} />

            <motion.h3
              className="text-white font-bold text-2xl mt-4 mb-1 font-['Fira_Sans']"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {leaderboardData[0]?.name || leaderboardData[0]?.username}
            </motion.h3>

            {leaderboardData[0]?.developerLevel && (
              <motion.div
                className="text-sm text-yellow-200 mb-2 flex items-center justify-center bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-700/50 font-medium font-['Fira_Sans']"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.35 }}
              >
                <span className="mr-1">
                  {leaderboardData[0].developerLevel.emoji}
                </span>
                {leaderboardData[0].developerLevel.name}
              </motion.div>
            )}

            <motion.div
              className="text-3xl font-bold text-yellow-400 mb-2 font-['Fira_Code']"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              <CountUp
                end={leaderboardData[0]?.points || 0}
                duration={2.5}
                separator=","
              />
            </motion.div>

            <div className="text-sm text-gray-400 font-['Fira_Sans']">
              @{leaderboardData[0]?.username}
            </div>
          </div>

          <motion.div
            className="w-36 h-48 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-xl relative shadow-2xl border-t-4 border-yellow-300"
            initial={{ height: 0 }}
            animate={{ height: 192 }}
            transition={{ duration: 1.2, delay: 1.7, ease: "easeOut" }}
          >
            <motion.div
              // className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-xl"
              // animate={{ x: [-100, 200] }}
              // transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <Trophy size={32} className="text-white drop-shadow-lg" />
            </div>
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-white drop-shadow-lg font-['Fira_Code']">
              1
            </div>
          </motion.div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="flex flex-col items-center mb-6 z-10">
            <UserAvatar user={leaderboardData[2]} size="lg" rank={3} />

            <motion.h3
              className="text-white font-bold text-xl mt-4 mb-1 font-['Fira_Sans']"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {leaderboardData[2]?.name || leaderboardData[2]?.username}
            </motion.h3>

            {leaderboardData[2]?.developerLevel && (
              <motion.div
                className="text-sm text-gray-300 mb-2 flex items-center justify-center bg-amber-900/30 px-3 py-1 rounded-full border border-amber-700/50 font-['Fira_Sans']"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
              >
                <span className="mr-1">
                  {leaderboardData[2].developerLevel.emoji}
                </span>
                {leaderboardData[2].developerLevel.name}
              </motion.div>
            )}

            <motion.div
              className="text-2xl font-bold text-amber-400 mb-2 font-['Fira_Code']"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            >
              <CountUp
                end={leaderboardData[2]?.points || 0}
                duration={2.5}
                separator=","
              />
            </motion.div>

            <div className="text-sm text-gray-400 font-['Fira_Sans']">
              @{leaderboardData[2]?.username}
            </div>
          </div>

          <motion.div
            className="w-32 h-24 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-xl relative shadow-2xl border-t-4 border-amber-400"
            initial={{ height: 0 }}
            animate={{ height: 96 }}
            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
          >
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <Award size={20} className="text-white" />
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white font-['Fira_Code']">
              3
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-t-xl bg-gradient-to-t from-transparent to-amber-400/20"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

    // Leaderboard Entry Component
    const LeaderboardEntry = ({ user, rank, delay, currentMetric }) => {
      const getRankIcon = () => {
        if (rank === 1) return <Crown className="text-yellow-400" size={20} />;
        if (rank === 2) return <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 flex items-center justify-center text-xs font-bold text-white">2</div>;
        if (rank === 3) return <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-xs font-bold text-white">3</div>;
        return <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center text-sm font-bold text-white font-['JetBrains_Mono']">{rank}</div>;
      };

  const getRankColors = () => {
    if (rank === 1)
      return "border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10";
    if (rank === 2)
      return "border-slate-500/30 bg-gradient-to-r from-slate-800/40 to-slate-700/20";
    if (rank === 3)
      return "border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-amber-800/10";
    return "border-white/[0.05] bg-white/[0.02]";
  };

  return (
    <motion.div
      className={`border ${getRankColors()} backdrop-blur-xl rounded-xl p-4 hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.01]`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {getRankIcon()}
            <UserAvatar user={user} size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg font-['Fira_Sans']">
                {user.name || user.username}
              </h3>
              {user.developerLevel && (
                <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] text-gray-300 font-medium flex items-center gap-1 border border-white/[0.1] font-['Fira_Sans']">
                  <span>{user.developerLevel.emoji}</span>
                  {user.developerLevel.name}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-1 font-['Fira_Sans']">
              @{user.username} • <GitCommit size={14} /> {user.commits || 0}{" "}
              commits
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-['Fira_Code']">
            <CountUp
              end={user.points || user.metricValue || 0}
              duration={2}
              separator=","
            />
          </div>
          <div className="text-xs text-gray-400 mb-1 font-['Fira_Sans']">
            {getMetricDisplayName(currentMetric)}
          </div>
          <div
            className={`text-sm font-medium flex items-center justify-end gap-1 font-['Fira_Sans'] ${
              user.change > 0
                ? "text-green-400"
                : user.change < 0
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {user.change > 0 ? "↗️" : user.change < 0 ? "↘️" : "➡️"}{" "}
            {Math.abs(user.change || 0)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get metric display name
const getMetricDisplayName = (metric) => {
  switch (metric) {
    case "proficiencyScore":
      return "Proficiency Score";
    case "totalCommits":
      return "Total Commits";
    case "repoCount":
      return "Repositories";
    case "totalPRs":
      return "Pull Requests";
    case "streak.longest":
      return "Longest Streak (days)";
    case "innovationScore":
      return "Innovation Score";
    case "collaborationScore":
      return "Collaboration Score";
    default:
      return "Score";
  }
};

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState("proficiencyScore");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);

  // Load leaderboard data from API
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await leaderboardService.getLeaderboard({
          metric: timeFilter,
          limit: 50,
        });

        if (response.success && response.data.users) {
          const transformedData = response.data.users.map((user, index) => ({
            username: user.username || user.name || `User${index + 1}`,
            name: user.name,
            rank: user.rank,
            points: user.value || 0,
            commits: user.analytics?.totalCommits || 0,
            change: Math.floor(Math.random() * 20) - 10,
            avatarUrl: user.avatarUrl,
            developerLevel: user.developerLevel,
            skillLevel: user.developerLevel?.name || "Beginner",
            repoCount: user.analytics?.repoCount || 0,
            totalPRs: user.analytics?.totalPRs || 0,
            streak: user.analytics?.streak?.current || 0,
            innovationScore: user.analytics?.innovationScore || 0,
            collaborationScore: user.analytics?.collaborationScore || 0,
            currentMetric: response.data.metric,
            metricValue: user.value,
          }));

          setLeaderboardData(transformedData);
        } else {
          throw new Error("Failed to fetch leaderboard data");
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error);
        setError(error.message);
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [timeFilter]);

  // Calculate stats from real data
  const totalCommits = leaderboardData.reduce(
    (sum, user) => sum + (user.commits || 0),
    0
  );
  const totalDevelopers = leaderboardData.length;
  const avgScore =
    leaderboardData.length > 0
      ? Math.round(
          leaderboardData.reduce(
            (sum, user) => sum + (user.points || user.metricValue || 0),
            0
          ) / leaderboardData.length
        )
      : 0;
  const totalRepos = leaderboardData.reduce(
    (sum, user) => sum + (user.repoCount || 0),
    0
  );

  const statsData = [
    {
      icon: Users,
      title: "Total Developers",
      value: totalDevelopers,
      subtitle: "Active contributors",
      delay: 0.2,
      color: "blue",
    },
    {
      icon: GitCommit,
      title: "Total Commits",
      value: totalCommits,
      subtitle: "All time",
      delay: 0.3,
      color: "green",
    },
    {
      icon: Target,
      title: "Average Score",
      value: avgScore,
      subtitle: "Proficiency score",
      delay: 0.4,
      color: "purple",
    },
    {
      icon: Code,
      title: "Total Repositories",
      value: totalRepos,
      subtitle: "Public repos",
      delay: 0.5,
      color: "orange",
    },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <LandingBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-['Fira_Sans']">
              Failed to Load Leaderboard
            </h2>
            <p className="text-gray-400 mb-4 font-['Fira_Sans']">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] text-white rounded-lg hover:shadow-lg hover:shadow-[#E84142]/25 transition-all duration-200 font-medium font-['Fira_Sans']"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <LandingBackground />
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Header with Landing Page Theme */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-sm mb-8">
            <Trophy size={16} className="text-[#E84142]" />
            <span className="font-['Fira_Code'] font-medium text-gray-300">
              Developer Rankings
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-['Fira_Code'] text-white">
            Leaderboard
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-['Fira_Sans']">
            Compete with developers worldwide and climb the ranks through your
            contributions
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Top 3 Podium */}
        <PodiumDisplay leaderboardData={leaderboardData} />

        {/* Filters with Landing Page Theme */}
        <ModernCard delay={0.6} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 w-80 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
              <input
                type="text"
                placeholder="Search developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-10 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E84142] focus:border-transparent backdrop-blur-sm font-['Fira_Sans']"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E84142] focus:border-transparent backdrop-blur-sm font-['Fira_Sans']"
              >
                <option value="proficiencyScore">Proficiency Score</option>
                <option value="totalCommits">Total Commits</option>
                <option value="repoCount">Repository Count</option>
                <option value="totalPRs">Pull Requests</option>
                <option value="streak.longest">Longest Streak</option>
                <option value="innovationScore">Innovation Score</option>
                <option value="collaborationScore">Collaboration Score</option>
              </select>
            </div>
          </div>
        </ModernCard>

        {/* Leaderboard with Landing Page Theme */}
        <ModernCard delay={0.8} className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-['Fira_Sans']">
              <TrendingUp className="text-[#E84142]" size={28} />
              Top Performers
            </h2>
            <p className="text-gray-400 mt-2 font-['Fira_Sans']">
              Rankings based on contributions and community engagement
            </p>
          </div>

          <div className="space-y-3">
            {leaderboardData
              .filter((user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user, index) => (
                <LeaderboardEntry
                  key={user.username}
                  user={user}
                  rank={index + 1}
                  delay={0.1 * index}
                  currentMetric={timeFilter}
                />
              ))}
          </div>
        </ModernCard>

        {/* Achievement Showcase with Landing Page Theme */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <ModernCard
            delay={1.3}
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <Crown size={28} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-['Fira_Sans']">
              Top Contributor
            </h3>
            <p className="text-gray-400 mb-4 font-['Fira_Sans']">
              Most commits this month
            </p>
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg backdrop-blur-sm">
              <div className="text-lg font-bold text-yellow-400 font-['Fira_Code']">
                {leaderboardData[0]?.name ||
                  leaderboardData[0]?.username ||
                  "No data"}
              </div>
              <div className="text-sm text-gray-300 flex items-center justify-center gap-1 mt-1 font-['Fira_Sans']">
                <GitCommit size={14} />
                {leaderboardData[0]?.commits || 0} commits
              </div>
            </div>
          </ModernCard>

          <ModernCard
            delay={1.4}
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap size={28} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-['Fira_Sans']">
              Rising Star
            </h3>
            <p className="text-gray-400 mb-4 font-['Fira_Sans']">
              Biggest improvement
            </p>
            <div className="mt-4 p-4 bg-green-900/20 border border-green-700/30 rounded-lg backdrop-blur-sm">
              <div className="text-lg font-bold text-green-400 font-['Fira_Code']">
                {leaderboardData.find((user) => user.change > 0)?.name ||
                  leaderboardData.find((user) => user.change > 0)?.username ||
                  "No data"}
              </div>
              <div className="text-sm text-gray-300 flex items-center justify-center gap-1 mt-1 font-['Fira_Sans']">
                <TrendingUp size={14} />+
                {Math.max(
                  ...leaderboardData.map((user) =>
                    user.change > 0 ? user.change : 0
                  )
                )}{" "}
                positions
              </div>
            </div>
          </ModernCard>

          <ModernCard
            delay={1.5}
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#9B2CFF]/10 to-purple-600/10 border border-[#9B2CFF]/20 flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-[#9B2CFF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-['Fira_Sans']">
              Quality Champion
            </h3>
            <p className="text-gray-400 mb-4 font-['Fira_Sans']">
              Highest code quality
            </p>
            <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg backdrop-blur-sm">
              <div className="text-lg font-bold text-[#9B2CFF] font-['Fira_Code']">
                {leaderboardData[1]?.name ||
                  leaderboardData[1]?.username ||
                  "No data"}
              </div>
              <div className="text-sm text-gray-300 flex items-center justify-center gap-1 mt-1 font-['Fira_Sans']">
                <GitBranch size={14} />
                {leaderboardData[1]?.developerLevel?.name || "Quality Champion"}
              </div>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
