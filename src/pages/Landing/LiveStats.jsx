import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Users, Gift, TrendingUp, Flame } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return; // Only animate once

    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const totalMilSecDur = duration;
    const incrementTime = (totalMilSecDur / end) * 1;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
        setHasAnimated(true);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, hasAnimated]);

  return count;
};

const StatCard = ({ icon: Icon, label, value, unit, color, trend, delay }) => (
  <motion.div
    className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 text-center hover:bg-white/[0.04] transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    {/* Icon */}
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mx-auto mb-4`}>
      <Icon size={24} className="text-white" />
    </div>

    {/* Value */}
    <div className="text-3xl font-bold mb-2 font-['Fira_Code'] text-white">
      <AnimatedCounter value={value} />
      {unit && <span className="text-xl ml-1 text-gray-400">{unit}</span>}
    </div>

    {/* Label */}
    <p className="text-gray-400 mb-3 font-['Fira_Sans'] text-sm">{label}</p>

    {/* Trend */}
    {trend && (
      <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
        <TrendingUp size={12} />
        <span className="font-['Fira_Code']">+{trend}%</span>
      </div>
    )}
  </motion.div>
);

const LiveStats = () => {
  // Static stats - no continuous updates for professional look
  const stats = [
    {
      icon: Coins,
      label: 'Total AVAX Staked',
      value: 125847,
      unit: '',
      color: 'bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20',
      trend: 12.5,
      delay: 0.1
    },
    {
      icon: Users,
      label: 'Active Developers',
      value: 2847,
      unit: '',
      color: 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20',
      trend: 8.3,
      delay: 0.2
    },
    {
      icon: Gift,
      label: 'Rewards Distributed',
      value: 89234,
      unit: 'AVAX',
      color: 'bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20',
      trend: 15.7,
      delay: 0.3
    },
    {
      icon: Flame,
      label: 'Active Challenges',
      value: 156,
      unit: '',
      color: 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20',
      trend: 5.2,
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-sm mb-6">
            <TrendingUp size={16} className="text-[#E84142]" />
            <span className="font-['Fira_Code'] text-gray-300">Platform Statistics</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-['Fira_Code'] text-white">
            Platform Statistics
          </h2>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto font-['Fira_Sans']">
            Key metrics showing the growth and activity of our developer community.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-2 font-['Fira_Code']">99.9%</div>
                <div className="text-gray-400 font-['Fira_Sans'] text-sm">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-2 font-['Fira_Code']">24/7</div>
                <div className="text-gray-400 font-['Fira_Sans'] text-sm">Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-2 font-['Fira_Code']">0%</div>
                <div className="text-gray-400 font-['Fira_Sans'] text-sm">Platform Fees</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;