import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, GitCommit, DollarSign, Target, Search, Filter, Crown, Star, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { userService } from '../services/userService';
import AuthDebug from '../components/AuthDebug';

// Loading Screen Component
const LoadingScreen = () => (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E84142] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-['JetBrains_Mono'] text-lg">Loading Leaderboard...</p>
        </div>
      </div>
    );

    // Modern Card Component
    const ModernCard = ({ children, className = "", delay = 0 }) => (
      <motion.div
        className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        {children}
      </motion.div>
    );

    // Stats Card Component
    const StatsCard = ({ icon: Icon, title, value, subtitle, delay }) => (
      <ModernCard delay={delay} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center mx-auto mb-4">
          <Icon size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 font-['JetBrains_Mono']">
          <CountUp end={value} duration={2} separator="," />
        </h3>
        <p className="text-lg font-semibold text-gray-300 mb-1 font-['JetBrains_Mono']">{title}</p>
        <div className="text-sm text-gray-500 font-['JetBrains_Mono']">{subtitle}</div>
      </ModernCard>
    );

    // Updated Podium Component
  const PodiumDisplay = ({ leaderboardData  }) => {
  return (
    <motion.div
      className="relative mb-16 bg-gradient-to-br from-[#2D3748] to-[#1A202C] rounded-3xl p-8 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-blue-400/10 pointer-events-none"></div>
      
      <div className="flex items-end justify-center gap-8 max-w-5xl mx-auto relative">
        {/* 2nd Place - Jackson */}
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {/* User Profile Section */}
          <div className="flex flex-col items-center mb-4 z-10">
            {/* Profile Circle */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 p-1 relative">
                <div className="w-full h-full rounded-full bg-[#2D3748] flex items-center justify-center relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-white font-bold text-xl font-mono">
                      {leaderboardData[1]?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Position Badge */}
              {/* <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#2D3748]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, type: "spring" }}
              >
                <span className="text-white font-bold text-sm font-mono">2</span>
              </motion.div> */}
            </div>
            
            {/* Username */}
            <motion.h3 
              className="text-white font-semibold text-lg font-mono mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {leaderboardData[1]?.username || 'Jackson'}
            </motion.h3>
            
            {/* Points */}
            <motion.div 
              className="text-2xl font-bold text-blue-400 font-mono mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              <CountUp end={leaderboardData[1]?.points || 1847} duration={2.5} separator="," />
            </motion.div>
            
            <div className="text-sm text-gray-400 font-mono">@username</div>
          </div>

          {/* Podium Base - 2nd Place (Medium Height) */}
          <motion.div
            className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg relative shadow-2xl"
            initial={{ height: 0 }}
            animate={{ height: 128 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          >
            {/* Podium Number */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <span className="text-4xl font-bold text-white/80 font-mono">2</span>
            </div>
            
            {/* Podium Shine Effect */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse"></div> */}
            
            {/* Bottom Border */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-700 rounded-b-lg"></div> */}
          </motion.div>
        </motion.div>

        {/* 1st Place - Eiden (Winner - Tallest) */}
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {/* User Profile Section */}
          <div className="flex flex-col items-center mb-4 z-10">
            {/* Crown */}
            <motion.div
              className="mb-2"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="text-yellow-400" size={32} />
            </motion.div>
            
            {/* Profile Circle */}
            <div className="relative mb-4">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1 relative"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.3)",
                    "0 0 30px rgba(251, 191, 36, 0.6)",
                    "0 0 20px rgba(251, 191, 36, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-full h-full rounded-full bg-[#2D3748] flex items-center justify-center relative overflow-hidden">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl font-mono">
                      {leaderboardData[0]?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
              
              {/* Position Badge */}
              {/* <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-[#2D3748]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              >
                <span className="text-white font-bold text-lg font-mono">1</span>
              </motion.div> */}
            </div>
            
            {/* Username */}
            <motion.h3 
              className="text-white font-semibold text-xl font-mono mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {leaderboardData[0]?.username || 'Eiden'}
            </motion.h3>
            
            {/* Points */}
            <motion.div 
              className="text-3xl font-bold text-yellow-400 font-mono mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              <CountUp end={leaderboardData[0]?.points || 2430} duration={2.5} separator="," />
            </motion.div>
            
            <div className="text-sm text-gray-400 font-mono">@username</div>
          </div>

          {/* Podium Base - 1st Place (Tallest) */}
          <motion.div
          
            className="w-36 h-48 bg-gradient-to-r from-yellow-400 to-orange-500  rounded-t-lg relative shadow-2xl"
            initial={{ height: 0 }}
            animate={{ height: 192 }}
            transition={{ duration: 1.2, delay: 1.7, ease: "easeOut" }}
          >
            {/* Podium Number */}
            <div className="absolute top-6 mt-8 left-1/2 transform -translate-x-1/2">
              <span className="text-5xl font-bold text-white/80 font-mono">1</span>
            </div>
            
            {/* Winner Glow */}
            {/* <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              animate={{ x: [-100, 200] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            ></motion.div> */}
            
            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-700 rounded-b-lg"></div>
            
            {/* Trophy Symbol */}
            {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="text-2xl">🏆</div>
            </div> */}
          </motion.div>
        </motion.div>

        {/* 3rd Place - Emma Aria (Shortest) */}
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {/* User Profile Section */}
          <div className="flex flex-col items-center mb-4 z-10">
            {/* Profile Circle */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-green-700 p-1 relative">
                <div className="w-full h-full rounded-full bg-[#2D3748] flex items-center justify-center relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center">
                    <span className="text-white font-bold text-xl font-mono">
                      {leaderboardData[2]?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Position Badge */}
              {/* <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#2D3748]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                <span className="text-white font-bold text-sm font-mono">3</span>
              </motion.div> */}
            </div>
            
            {/* Username */}
            <motion.h3 
              className="text-white font-semibold text-lg font-mono mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {leaderboardData[2]?.username || 'Emma Aria'}
            </motion.h3>
            
            {/* Points */}
            <motion.div 
              className="text-2xl font-bold text-green-400 font-mono mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            >
              <CountUp end={leaderboardData[2]?.points || 1674} duration={2.5} separator="," />
            </motion.div>
            
            <div className="text-sm text-gray-400 font-mono">@username</div>
          </div>

          {/* Podium Base - 3rd Place (Shortest) */}
          <motion.div
            className="w-32 h-24 bg-gradient-to-r from-green-500 to-green-700 rounded-t-lg  relative shadow-2xl"
            initial={{ height: 0 }}
            animate={{ height: 96 }}
            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
          >
            {/* Podium Number */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <span className="text-3xl font-bold text-white/80 font-mono">3</span>
            </div>
            
            {/* Podium Shine Effect */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse"></div> */}
            
            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-700 rounded-b-lg"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

    // Leaderboard Entry Component
    const LeaderboardEntry = ({ user, rank, isTop3, delay }) => {
      const getRankIcon = () => {
        if (rank === 1) return <Crown className="text-yellow-400" size={20} />;
        if (rank === 2) return <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 flex items-center justify-center text-xs font-bold text-white">2</div>;
        if (rank === 3) return <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-xs font-bold text-white">3</div>;
        return <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center text-sm font-bold text-white font-['JetBrains_Mono']">{rank}</div>;
      };

      const getRankColors = () => {
        if (rank === 1) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
        if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
        if (rank === 3) return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
        return 'from-white/5 to-white/10 border-white/10';
      };

      return (
        <motion.div
          className={`backdrop-blur-xl bg-gradient-to-r ${getRankColors()} border rounded-2xl p-4 shadow-xl hover:scale-[1.02] transition-all duration-300`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {getRankIcon()}
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-['JetBrains_Mono']">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg font-['JetBrains_Mono']">{user.username}</h3>
                <p className="text-gray-400 text-sm font-['JetBrains_Mono']">{user.commits} commits</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white font-['JetBrains_Mono']">
                <CountUp end={user.points} duration={2} separator="," />
              </div>
              <div className={`text-sm font-['JetBrains_Mono'] ${user.change > 0 ? 'text-green-400' : user.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {user.change > 0 ? '↗' : user.change < 0 ? '↘' : '→'} {Math.abs(user.change)}
              </div>
            </div>
          </div>
        </motion.div>
      );
    };

    const Leaderboard = () => {
      const [timeFilter, setTimeFilter] = useState('proficiencyScore');
      const [searchTerm, setSearchTerm] = useState('');
      const [isLoading, setIsLoading] = useState(true);
      const [leaderboardData, setLeaderboardData] = useState([]);
      const [error, setError] = useState(null);

      // Load leaderboard data from API
      useEffect(() => {
        const loadLeaderboard = async () => {
          setIsLoading(true);
          setError(null);
          
          try {
            const response = await userService.getLeaderboard({
              metric: timeFilter,
              limit: 50
            });
            
            if (response.success) {
              // Transform API data to match component structure
              const transformedData = response.data.map((user, index) => ({
                username: user.username || user.name || `User${index + 1}`,
                points: user.analytics?.proficiencyScore || user.proficiencyScore || 0,
                commits: user.analytics?.totalCommits || user.totalCommits || 0,
                change: Math.floor(Math.random() * 20) - 10, // Random change for demo
                avatarUrl: user.avatarUrl,
                skillLevel: user.insights?.skillLevel || 'Beginner',
                repoCount: user.analytics?.repoCount || 0,
                totalPRs: user.analytics?.totalPRs || 0,
                streak: user.analytics?.streak?.current || 0
              }));
              
              setLeaderboardData(transformedData);
            } else {
              throw new Error('Failed to fetch leaderboard data');
            }
          } catch (error) {
            console.error('Error loading leaderboard:', error);
            setError(error.message);
            
            // Fallback to sample data
            setLeaderboardData([
              { username: 'CodeMaster_Alex', points: 15420, commits: 342, change: 12 },
              { username: 'DevNinja_Sarah', points: 14890, commits: 298, change: 8 },
              { username: 'GitGuru_Mike', points: 13750, commits: 276, change: -3 },
              { username: 'ByteWizard_Emma', points: 12980, commits: 245, change: 15 },
              { username: 'CodeCrusher_Tom', points: 11560, commits: 223, change: 5 },
              { username: 'ScriptSage_Lisa', points: 10890, commits: 201, change: -1 },
              { username: 'DataDriven_John', points: 9750, commits: 189, change: 7 },
              { username: 'AlgoAce_Maria', points: 8920, commits: 167, change: 3 },
            ]);
          } finally {
            setIsLoading(false);
          }
        };

        loadLeaderboard();
      }, [timeFilter]);

      // Calculate stats from real data
      const totalCommits = leaderboardData.reduce((sum, user) => sum + user.commits, 0);
      const totalDevelopers = leaderboardData.length;
      const avgScore = leaderboardData.length > 0 ? Math.round(leaderboardData.reduce((sum, user) => sum + user.points, 0) / leaderboardData.length) : 0;
      const totalRepos = leaderboardData.reduce((sum, user) => sum + (user.repoCount || 0), 0);

      const statsData = [
        { icon: Users, title: 'Total Developers', value: totalDevelopers, subtitle: 'Active contributors', delay: 0.2 },
        { icon: GitCommit, title: 'Total Commits', value: totalCommits, subtitle: 'All time', delay: 0.3 },
        { icon: Target, title: 'Average Score', value: avgScore, subtitle: 'Proficiency score', delay: 0.4 },
        { icon: DollarSign, title: 'Total Repositories', value: totalRepos, subtitle: 'Public repos', delay: 0.5 },
      ];

      if (isLoading) {
        return <LoadingScreen />;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A]">
          <div className="container mx-auto px-4 py-12">
            {/* Hero Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center">
                  <Trophy size={32} className="text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4 font-['JetBrains_Mono']">
                Leaderboard
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['JetBrains_Mono']">
                Compete with developers worldwide and climb the ranks through your contributions
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

            {/* Filters */}
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
    className="w-full px-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#E84142] font-['JetBrains_Mono']"
  />
</div>



                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={20} />
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E84142] font-['JetBrains_Mono']"
                  >
                    <option value="proficiencyScore">Proficiency Score</option>
                    <option value="totalCommits">Total Commits</option>
                    <option value="repoCount">Repository Count</option>
                    <option value="totalPRs">Pull Requests</option>
                    <option value="innovationScore">Innovation Score</option>
                    <option value="collaborationScore">Collaboration Score</option>
                  </select>
                </div>
              </div>
            </ModernCard>

            {/* Leaderboard */}
            <ModernCard delay={0.8} className="mb-16">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white font-['JetBrains_Mono'] flex items-center gap-2">
                  <TrendingUp className="text-[#E84142]" size={28} />
                  Top Performers
                </h2>
                <p className="text-gray-400 mt-2 font-['JetBrains_Mono']">
                  Rankings based on contributions and community engagement
                </p>
              </div>

              <div className="space-y-2">
                {leaderboardData
                  .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((user, index) => (
                    <LeaderboardEntry
                      key={user.username}
                      user={user}
                      rank={index + 1}
                      isTop3={index < 3}
                      delay={0.1 * index}
                    />
                  ))}
              </div>
            </ModernCard>

            {/* Achievement Showcase */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <ModernCard delay={1.3} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mx-auto mb-4">
                  <Crown size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-['JetBrains_Mono']">Top Contributor</h3>
                <p className="text-gray-400 font-['JetBrains_Mono']">Most commits this month</p>
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400 font-['JetBrains_Mono']">CodeMaster_Alex</div>
                  <div className="text-sm text-gray-400 font-['JetBrains_Mono']">342 commits</div>
                </div>
              </ModernCard>

              <ModernCard delay={1.4} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-['JetBrains_Mono']">Rising Star</h3>
                <p className="text-gray-400 font-['JetBrains_Mono']">Biggest improvement</p>
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-green-400 font-['JetBrains_Mono']">ByteWizard_Emma</div>
                  <div className="text-sm text-gray-400 font-['JetBrains_Mono']">+15 positions</div>
                </div>
              </ModernCard>

              <ModernCard delay={1.5} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-['JetBrains_Mono']">Quality Champion</h3>
                <p className="text-gray-400 font-['JetBrains_Mono']">Highest code quality</p>
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-purple-400 font-['JetBrains_Mono']">DevNinja_Sarah</div>
                  <div className="text-sm text-gray-400 font-['JetBrains_Mono']">98% quality score</div>
                </div>
              </ModernCard>
            </motion.div>
          </div>
        </div>
       
      );
    };

export default Leaderboard;
