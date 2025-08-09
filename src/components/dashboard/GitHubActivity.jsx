import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitCommit, GitPullRequest, Star, Eye, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const GitHubActivity = ({ timeRange }) => {
  const [activeTab, setActiveTab] = useState('commits');

  // Sample data - replace with real API data
  const commitData = [
    { day: 'Mon', commits: 12, additions: 245, deletions: 89 },
    { day: 'Tue', commits: 8, additions: 156, deletions: 45 },
    { day: 'Wed', commits: 15, additions: 389, deletions: 123 },
    { day: 'Thu', commits: 6, additions: 98, deletions: 34 },
    { day: 'Fri', commits: 20, additions: 456, deletions: 167 },
    { day: 'Sat', commits: 4, additions: 67, deletions: 23 },
    { day: 'Sun', commits: 2, additions: 34, deletions: 12 },
  ];

  const repoStats = [
    { name: 'gitstake', stars: 234, forks: 45, commits: 156, language: 'JavaScript' },
    { name: 'web3-dashboard', stars: 89, forks: 23, commits: 78, language: 'TypeScript' },
    { name: 'smart-contracts', stars: 156, forks: 67, commits: 234, language: 'Solidity' },
    { name: 'api-service', stars: 45, forks: 12, commits: 89, language: 'Python' },
  ];

  const languageData = [
    { name: 'JavaScript', value: 45, color: '#F7DF1E' },
    { name: 'TypeScript', value: 25, color: '#3178C6' },
    { name: 'Solidity', value: 20, color: '#363636' },
    { name: 'Python', value: 10, color: '#3776AB' },
  ];

  const tabs = [
    { id: 'commits', label: 'Commits', icon: GitCommit },
    { id: 'repos', label: 'Repositories', icon: GitBranch },
    { id: 'languages', label: 'Languages', icon: Star },
  ];

  return (
    <motion.div
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-['JetBrains_Mono']">
          <GitBranch className="text-[#E84142]" size={24} />
          GitHub Activity
        </h3>

        <div className="flex bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all font-['JetBrains_Mono'] ${
                activeTab === tab.id
                  ? 'bg-[#E84142] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'commits' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-['JetBrains_Mono']">156</div>
              <div className="text-sm text-gray-400 font-['JetBrains_Mono']">Total Commits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 font-['JetBrains_Mono']">+1,245</div>
              <div className="text-sm text-gray-400 font-['JetBrains_Mono']">Lines Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 font-['JetBrains_Mono']">-456</div>
              <div className="text-sm text-gray-400 font-['JetBrains_Mono']">Lines Removed</div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={commitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="commits" fill="#E84142" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {activeTab === 'repos' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {repoStats.map((repo, index) => (
            <motion.div
              key={repo.name}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#E84142]"></div>
                <div>
                  <div className="font-semibold text-white font-['JetBrains_Mono']">{repo.name}</div>
                  <div className="text-sm text-gray-400 font-['JetBrains_Mono']">{repo.language}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Star size={14} />
                  {repo.stars}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <GitBranch size={14} />
                  {repo.forks}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <GitCommit size={14} />
                  {repo.commits}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'languages' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {languageData.map((lang, index) => (
            <motion.div
              key={lang.name}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: lang.color }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-medium font-['JetBrains_Mono']">{lang.name}</span>
                  <span className="text-gray-400 text-sm font-['JetBrains_Mono']">{lang.value}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: lang.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default GitHubActivity;
