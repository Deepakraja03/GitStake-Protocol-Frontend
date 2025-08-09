import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Award, Calendar, Clock } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const PerformanceMetrics = ({ timeRange }) => {
  const [selectedMetric, setSelectedMetric] = useState('productivity');

  const productivityData = [
    { name: 'Productivity', value: 85, color: '#E84142' },
    { name: 'Quality', value: 92, color: '#9B2CFF' },
    { name: 'Consistency', value: 78, color: '#00D09C' },
  ];

  const weeklyTrend = [
    { day: 'Mon', productivity: 85, quality: 90, consistency: 75 },
    { day: 'Tue', productivity: 88, quality: 85, consistency: 80 },
    { day: 'Wed', productivity: 92, quality: 95, consistency: 85 },
    { day: 'Thu', productivity: 87, quality: 88, consistency: 78 },
    { day: 'Fri', productivity: 90, quality: 92, consistency: 82 },
    { day: 'Sat', productivity: 75, quality: 80, consistency: 70 },
    { day: 'Sun', productivity: 70, quality: 75, consistency: 65 },
  ];

  const achievements = [
    { 
      title: 'Code Quality Master', 
      description: 'Maintained 95%+ code quality for 30 days',
      icon: Award,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      progress: 100,
      unlocked: true
    },
    { 
      title: 'Consistency Champion', 
      description: 'Daily commits for 15 consecutive days',
      icon: Target,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      progress: 80,
      unlocked: false
    },
    { 
      title: 'Speed Demon', 
      description: 'Complete 50 tasks in record time',
      icon: Zap,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      progress: 60,
      unlocked: false
    },
  ];

  const metrics = [
    { id: 'productivity', label: 'Productivity', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'trends', label: 'Trends', icon: Calendar },
  ];

  return (
    <motion.div
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-['JetBrains_Mono']">
          <TrendingUp className="text-[#E84142]" size={24} />
          Performance Metrics
        </h3>

        <div className="flex bg-white/5 rounded-lg p-1">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all font-['JetBrains_Mono'] ${
                selectedMetric === metric.id
                  ? 'bg-[#E84142] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <metric.icon size={16} />
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {selectedMetric === 'productivity' && (
        <motion.div
          className="flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productivityData.map((item, index) => (
              <motion.div
                key={item.name}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[item]}>
                      <RadialBar 
                        dataKey="value" 
                        cornerRadius={10} 
                        fill={item.color}
                        background={{ fill: '#374151' }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{item.value}%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-white font-['JetBrains_Mono']">{item.name}</h4>
                <p className="text-sm text-gray-400 mt-1 font-['JetBrains_Mono']">
                  {item.name === 'Productivity' && 'Tasks completed efficiently'}
                  {item.name === 'Quality' && 'Code review scores'}
                  {item.name === 'Consistency' && 'Daily activity streak'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedMetric === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 space-y-4 overflow-y-auto"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className={`p-4 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/5 border-white/10'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${achievement.color} flex items-center justify-center ${
                  !achievement.unlocked && 'opacity-50'
                }`}>
                  <achievement.icon size={24} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold font-['JetBrains_Mono'] ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </h4>
                    {achievement.unlocked && (
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2 font-['JetBrains_Mono']">{achievement.description}</p>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-green-400 to-green-500' 
                          : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400 font-['JetBrains_Mono']">
                      {achievement.progress}% Complete
                    </span>
                    {achievement.unlocked && (
                      <span className="text-xs text-green-400 font-semibold font-['JetBrains_Mono']">
                        Unlocked!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedMetric === 'trends' && (
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white mb-2 font-['JetBrains_Mono']">Weekly Performance Trend</h4>
            <p className="text-sm text-gray-400 font-['JetBrains_Mono']">Track your performance metrics over the past week</p>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyTrend}>
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="#E84142" 
                strokeWidth={3}
                dot={{ fill: '#E84142', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#9B2CFF" 
                strokeWidth={3}
                dot={{ fill: '#9B2CFF', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="consistency" 
                stroke="#00D09C" 
                strokeWidth={3}
                dot={{ fill: '#00D09C', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E84142] rounded-full"></div>
              <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Productivity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#9B2CFF] rounded-full"></div>
              <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00D09C] rounded-full"></div>
              <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Consistency</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PerformanceMetrics;
