import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Wallet, 
  GitBranch, 
  Trophy, 
  Settings, 
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Bell,
  Shield
} from 'lucide-react';

const QuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const quickActions = [
    {
      id: 'stake',
      title: 'Stake AVAX',
      description: 'Stake your tokens to earn rewards',
      icon: Wallet,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      action: () => console.log('Stake AVAX'),
    },
    {
      id: 'connect-github',
      title: 'Connect GitHub',
      description: 'Link your GitHub account',
      icon: GitBranch,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      action: () => console.log('Connect GitHub'),
    },
    {
      id: 'join-challenge',
      title: 'Join Challenge',
      description: 'Participate in coding challenges',
      icon: Trophy,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      action: () => console.log('Join Challenge'),
    },
    {
      id: 'claim-rewards',
      title: 'Claim Rewards',
      description: 'Claim your earned rewards',
      icon: Download,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      action: () => console.log('Claim Rewards'),
    },
  ];

  const utilityActions = [
    {
      id: 'export-data',
      title: 'Export Data',
      icon: Upload,
      action: () => console.log('Export Data'),
    },
    {
      id: 'refresh',
      title: 'Refresh Dashboard',
      icon: RefreshCw,
      action: () => window.location.reload(),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      action: () => console.log('Settings'),
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      action: () => console.log('Security'),
    },
  ];

  return (
    <motion.div
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-['JetBrains_Mono']">
          <Plus className="text-[#E84142]" size={24} />
          Quick Actions
        </h3>
        
        <div className="flex items-center gap-2">
          <motion.button
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={20} />
            {notifications > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {notifications}
              </motion.div>
            )}
          </motion.button>
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus size={20} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Main Quick Actions */}
      <div className="flex-1 flex flex-col">
        <div className="space-y-3 mb-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={action.action}
              className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} className="text-white" />
                </div>

                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white group-hover:text-[#E84142] transition-colors font-['JetBrains_Mono']">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-400 font-['JetBrains_Mono']">{action.description}</p>
                </div>

                <ExternalLink size={16} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>

      {/* Utility Actions - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 pt-4"
          >
            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider font-['JetBrains_Mono']">
              Utilities
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {utilityActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  onClick={action.action}
                  className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <action.icon 
                      size={20} 
                      className="text-gray-400 group-hover:text-white transition-colors" 
                    />
                    <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-['JetBrains_Mono']">
                      {action.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Recent Activity Indicator */}
        <motion.div
          className=" px-3 py-1 rounded-lg bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1">
              <p className="text-sm text-white font-medium font-['JetBrains_Mono']">System Status: All Good</p>
              <p className="text-xs text-gray-400 font-['JetBrains_Mono']">Last updated 2 minutes ago</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className=" grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white font-['JetBrains_Mono']">24/7</div>
            <div className="text-xs text-gray-400 font-['JetBrains_Mono']">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400 font-['JetBrains_Mono']">Active</div>
            <div className="text-xs text-gray-400 font-['JetBrains_Mono']">Status</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;
