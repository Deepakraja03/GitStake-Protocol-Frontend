import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode, FaStar, FaGitAlt, FaUsers, FaFire } from 'react-icons/fa';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${color}`}>
      <Icon className="text-xl text-white" />
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

const ContributionHeatmap = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate GitHub-like contribution data - using useMemo to prevent regeneration
  const { contributionData, monthPositions } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() + 1); // Start from exactly 365 days ago
    
    // Start from the Sunday of the week containing one year ago
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks = [];
    const monthPos = [];
    let currentDate = new Date(startDate);
    let weekIndex = 0;
    let lastMonth = -1;
    
    // Generate exactly 53 weeks of data
    for (let w = 0; w < 53; w++) {
      const week = [];
      
      for (let day = 0; day < 7; day++) {
        // Use deterministic seed for consistent data
        const dayOfYear = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const seed = (dayOfYear + 1) * 0.1234567;
        const intensity = (Math.sin(seed) * Math.cos(seed * 0.7) + 1) / 2;
        
        let count = 0;
        if (intensity > 0.9) count = Math.floor(intensity * 25) + 10;
        else if (intensity > 0.75) count = Math.floor(intensity * 15) + 5;
        else if (intensity > 0.55) count = Math.floor(intensity * 8) + 2;
        else if (intensity > 0.35) count = 1;
        
        week.push({
          date: new Date(currentDate),
          count,
          id: `${w}-${day}`,
          level: count === 0 ? 0 : count < 3 ? 1 : count < 8 ? 2 : count < 15 ? 3 : 4
        });
        
        // Check for month change - only add label if it's a new month and there's enough space
        if (day === 0 && currentDate.getMonth() !== lastMonth && w < 50) {
          monthPos.push({
            month: currentDate.toLocaleDateString('en', { month: 'short' }),
            position: w
          });
          lastMonth = currentDate.getMonth();
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(week);
    }
    
    return { contributionData: weeks, monthPositions: monthPos };
  }, []);

  // GitHub's exact color scheme
  const getColor = (level) => {
    switch (level) {
      case 0: return '#161b22'; // No contributions
      case 1: return '#0e4429'; // Low contributions  
      case 2: return '#006d32'; // Medium-low contributions
      case 3: return '#26a641'; // Medium-high contributions
      case 4: return '#39d353'; // High contributions
      default: return '#161b22';
    }
  };

  const handleMouseEnter = (day, e) => {
    setHoveredDay(day);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="relative">
      <div className="w-full max-w-4xl mx-auto">
        {/* GitHub exact layout structure */}
        <div className="flex">
          {/* Empty space for day labels */}
          <div className="w-8 h-4"></div>

          {/* Month labels row - GitHub style */}
          <div className="flex flex-1">
            {contributionData.map((week, weekIndex) => {
              const monthLabel = monthPositions.find(m => m.position === weekIndex);
              return (
                <div key={weekIndex} className="flex-1 text-xs text-gray-500 text-left min-w-0">
                  {monthLabel && weekIndex >= 2 ? monthLabel.month : ''}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex mt-1">
          {/* Day labels column - GitHub exact positioning */}
          <div className="w-8 pr-2 text-right flex-shrink-0">
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}></div>
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}>Mon</div>
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}></div>
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}>Wed</div>
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}></div>
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}>Fri</div>
            <div className="text-xs text-gray-500 leading-3" style={{ height: '13px' }}></div>
          </div>

          {/* Contribution grid - GitHub exact styling */}
          <div className="flex gap-1 flex-1 justify-between">
            {contributionData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.id}
                    className="rounded-sm cursor-pointer relative"
                    style={{
                      width: '11px',
                      height: '11px',
                      backgroundColor: getColor(day.level),
                      border: day.level === 0 ? '1px solid #30363d' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.target.getBoundingClientRect();
                      setHoveredDay(day);
                      setMousePosition({
                        x: rect.left + rect.width / 2,
                        y: rect.top
                      });
                    }}
                    onMouseLeave={handleMouseLeave}
                    title={`${day.count} contributions on ${day.date.toDateString()}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GitHub-style tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-xs rounded-md px-2 py-1 pointer-events-none shadow-lg border border-gray-600 whitespace-nowrap"
          style={{
            left: mousePosition.x - 50, // Center the tooltip over the square
            top: mousePosition.y - 40,  // Position above the square
            transform: 'translateX(-50%)', // Center horizontally
          }}
        >
          {hoveredDay.count === 0 ? 'No contributions' : `${hoveredDay.count} contribution${hoveredDay.count !== 1 ? 's' : ''}`} on{' '}
          {hoveredDay.date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      )}
    </div>
  );
};

const GitHubPreview = () => {
  const stats = [
    { icon: FaCode, label: 'Total Commits', value: '2,847', color: 'bg-gradient-to-r from-blue-500 to-blue-600', delay: 0.1 },
    { icon: FaGitAlt, label: 'Pull Requests', value: '156', color: 'bg-gradient-to-r from-green-500 to-green-600', delay: 0.2 },
    { icon: FaStar, label: 'Stars Earned', value: '1,234', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', delay: 0.3 },
    { icon: FaUsers, label: 'Contributors', value: '89', color: 'bg-gradient-to-r from-purple-500 to-purple-600', delay: 0.4 },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
            <FaGithub className="text-[#E84142]" />
            <span>GitHub Integration</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Track Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E84142] to-[#9B2CFF] bg-clip-text text-transparent">
              Development Journey
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect your GitHub account and watch your contributions transform into rewards.
            Every commit, pull request, and collaboration earns you AVAX tokens.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* GitHub Contribution Graph */}
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Contribution Activity</h3>
              <p className="text-gray-400">Your coding journey visualized</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="rounded-sm border border-gray-600/20" style={{ width: '12px', height: '12px', backgroundColor: '#161b22' }}></div>
                <div className="rounded-sm border border-gray-600/20" style={{ width: '12px', height: '12px', backgroundColor: '#0e4429' }}></div>
                <div className="rounded-sm border border-gray-600/20" style={{ width: '12px', height: '12px', backgroundColor: '#006d32' }}></div>
                <div className="rounded-sm border border-gray-600/20" style={{ width: '12px', height: '12px', backgroundColor: '#26a641' }}></div>
                <div className="rounded-sm border border-gray-600/20" style={{ width: '12px', height: '12px', backgroundColor: '#39d353' }}></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <ContributionHeatmap />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">365</div>
              <div className="text-gray-400 text-sm">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">47</div>
              <div className="text-gray-400 text-sm">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">89</div>
              <div className="text-gray-400 text-sm">Longest Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-xl text-white font-semibold cursor-pointer hover:scale-105 transition-transform">
            <FaFire />
            <span>Connect GitHub & Start Earning</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubPreview;