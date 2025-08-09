import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaUsers, FaGift, FaChartLine, FaFire } from 'react-icons/fa';

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const totalMilSecDur = duration;
    const incrementTime = (totalMilSecDur / end) * 1;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return count;
};

const StatCard = ({ icon: Icon, label, value, unit, color, trend, delay }) => (
  <motion.div
    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden group"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${color}`}></div>

    {/* Icon */}
    <motion.div
      className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mx-auto mb-6`}
      whileHover={{ rotate: 5, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Icon className="text-2xl text-white" />
    </motion.div>

    {/* Value */}
    <motion.div
      className="text-4xl font-bold mb-2"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.2 }}
    >
      <AnimatedCounter value={value} />
      <span className="text-2xl ml-1 text-gray-400">{unit}</span>
    </motion.div>

    {/* Label */}
    <p className="text-gray-400 mb-4">{label}</p>

    {/* Trend */}
    {trend && (
      <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
        <FaChartLine />
        <span>+{trend}% this week</span>
      </div>
    )}

    {/* Decorative elements */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full"></div>
    <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full"></div>
  </motion.div>
);

const LiveStats = () => {
  const [liveStats, setLiveStats] = useState({
    staked: 125847,
    developers: 2847,
    rewards: 89234,
    challenges: 156
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        staked: prev.staked + Math.floor(Math.random() * 50),
        developers: prev.developers + Math.floor(Math.random() * 3),
        rewards: prev.rewards + Math.floor(Math.random() * 25),
        challenges: prev.challenges + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: FaCoins,
      label: 'Total AVAX Staked',
      value: liveStats.staked,
      unit: '',
      color: 'bg-gradient-to-r from-[#E84142] to-[#9B2CFF]',
      trend: 12.5,
      delay: 0.1
    },
    {
      icon: FaUsers,
      label: 'Active Developers',
      value: liveStats.developers,
      unit: '',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: 8.3,
      delay: 0.2
    },
    {
      icon: FaGift,
      label: 'Rewards Distributed',
      value: liveStats.rewards,
      unit: 'AVAX',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: 15.7,
      delay: 0.3
    },
    {
      icon: FaFire,
      label: 'Active Challenges',
      value: liveStats.challenges,
      unit: '',
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      trend: 5.2,
      delay: 0.4
    }
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
            <FaChartLine className="text-[#E84142]" />
            <span>Live Statistics</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Platform
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E84142] to-[#9B2CFF] bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time data showing the growth and activity of our developer community.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-2">0%</div>
                <div className="text-gray-400">Platform Fees</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;