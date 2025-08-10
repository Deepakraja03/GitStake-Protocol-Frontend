import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sword, Play, Check, X, Flame, Trophy, Target, Code, Zap } from 'lucide-react';
import MonacoEditor from 'react-monaco-editor';
import CountUp from 'react-countup';
import { useAuthContext as useAuth } from '../context/AuthContext';
import { useUserAnalytics } from '../hooks/useApi';
import AuthDebug from '../components/AuthDebug';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#E84142] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white font-['JetBrains_Mono'] text-lg">Loading Challenges...</p>
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

const BossAvatar = ({ state = 'idle', health = 100 }) => {
  const getAvatarEmoji = () => {
    if (health <= 0) return '💀';
    if (health <= 25) return '😵';
    if (health <= 50) return '😰';
    if (health <= 75) return '😠';
    return '👹';
  };

  const getAvatarColor = () => {
    if (health <= 0) return 'text-gray-500';
    if (health <= 25) return 'text-red-600';
    if (health <= 50) return 'text-orange-500';
    if (health <= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      className={`text-8xl ${getAvatarColor()}`}
      animate={{
        scale: state === 'damaged' ? [1, 1.2, 1] : 1,
        rotate: state === 'damaged' ? [0, -10, 10, 0] : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      {getAvatarEmoji()}
    </motion.div>
  );
};

const ReactiveBackground = ({ success = false, error = false }) => {
  return (
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{
        background: success 
          ? 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 70%)'
          : error
          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 70%)'
          : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)'
      }}
      transition={{ duration: 0.5 }}
    />
  );
};

const ChallengeCard = ({ challenge, onSelect, isSelected }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-xl ${
      isSelected
        ? 'border-[#E84142] bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10'
        : 'hover:border-white/20 hover:bg-white/10'
    }`}
    onClick={() => onSelect(challenge)}
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold text-lg font-['JetBrains_Mono']">{challenge.title}</h3>
      <div className="flex items-center space-x-2">
        {challenge.type === 'boss' && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
            <Sword size={16} className="text-white" />
          </div>
        )}
        {challenge.type === 'weekly' && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <Calendar size={16} className="text-white" />
          </div>
        )}
        <span className={`px-3 py-1 rounded-lg text-xs font-medium font-['JetBrains_Mono'] ${
          challenge.type === 'boss'
            ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30'
            : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30'
        }`}>
          {challenge.type === 'boss' ? 'Boss Battle' : 'Weekly Challenge'}
        </span>
      </div>
    </div>
    <p className="text-gray-400 text-sm mb-4 font-['JetBrains_Mono']">{challenge.description}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Trophy className="text-yellow-400" size={16} />
        <span className="text-yellow-400 font-semibold font-['JetBrains_Mono']">{challenge.reward} AVAX</span>
      </div>
      <div className="flex items-center space-x-2">
        <Zap className="text-orange-400" size={16} />
        <span className="text-orange-400 font-semibold font-['JetBrains_Mono']">{challenge.xp} XP</span>
      </div>
    </div>
  </motion.div>
);

const Arena = ({ challenge, onComplete }) => {
  const [code, setCode] = useState(challenge.starterCode || '');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bossHealth, setBossHealth] = useState(100);
  const [bossState, setBossState] = useState('idle');
  const [backgroundState, setBackgroundState] = useState('idle');

  const runTests = async () => {
    setIsRunning(true);
    setBackgroundState('idle');
    
    // Simulate test execution
    const results = challenge.tests.map((test, index) => {
      const passed = Math.random() > 0.3; // Simulate test results
      return { ...test, passed, index };
    });
    
    // Animate test results
    for (let i = 0; i < results.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTestResults(prev => [...prev.slice(0, i), results[i]]);
      
      if (results[i].passed) {
        setBossHealth(prev => Math.max(0, prev - (100 / results.length)));
        setBossState('damaged');
        setBackgroundState('success');
        setTimeout(() => {
          setBossState('idle');
          setBackgroundState('idle');
        }, 500);
      } else {
        setBackgroundState('error');
        setTimeout(() => setBackgroundState('idle'), 500);
      }
    }
    
    setIsRunning(false);
    
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      setBossHealth(0);
      setTimeout(() => onComplete(challenge), 1000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Code Editor */}
      <ModernCard className="relative">
        <ReactiveBackground
          success={backgroundState === 'success'}
          error={backgroundState === 'error'}
        />

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white font-['JetBrains_Mono']">{challenge.title}</h3>
          <motion.button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 font-['JetBrains_Mono'] shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={16} />
            <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
          </motion.button>
        </div>
        
        <div className="h-96 border border-white/10 rounded-lg overflow-hidden">
          <MonacoEditor
            width="100%"
            height="100%"
            language={challenge.language || 'javascript'}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
        
        {/* Test Results */}
        <div className="mt-6 space-y-3">
          <h4 className="text-white font-semibold font-['JetBrains_Mono']">Test Results:</h4>
          {testResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                result.passed
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}
            >
              {result.passed ? <Check size={16} /> : <X size={16} />}
              <span className="text-sm font-['JetBrains_Mono']">{result.description}</span>
            </motion.div>
          ))}
        </div>
      </ModernCard>

      {/* Boss Battle */}
      <ModernCard className="text-center">
        <h3 className="text-xl font-semibold text-white mb-6 font-['JetBrains_Mono']">Boss Battle</h3>

        <div className="mb-8">
          <BossAvatar state={bossState} health={bossHealth} />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 font-['JetBrains_Mono']">Boss Health</span>
            <span className="text-white font-bold font-['JetBrains_Mono']">{Math.round(bossHealth)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-4 border border-white/10">
            <motion.div
              className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full shadow-lg"
              initial={{ width: '100%' }}
              animate={{ width: `${bossHealth}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-400 text-sm mb-2 font-['JetBrains_Mono']">Challenge Description</p>
            <p className="text-white font-['JetBrains_Mono']">{challenge.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-yellow-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">Reward</p>
              <p className="text-yellow-400 font-bold font-['JetBrains_Mono']">{challenge.reward} AVAX</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-center mb-2">
                <Zap className="text-orange-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">XP</p>
              <p className="text-orange-400 font-bold font-['JetBrains_Mono']">{challenge.xp} XP</p>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

const Challenges = () => {
  const { user } = useAuth();
  const { data: userAnalytics } = useUserAnalytics(user?.username);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filter, setFilter] = useState('weekly');
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userLevel = userAnalytics?.level || 1;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Generate challenges based on user level
  const generateWeeklyChallenges = (level) => {
    const baseReward = Math.max(10, level * 2);
    const baseXP = Math.max(100, level * 20);

    return [
      {
        id: `weekly-${level}-1`,
        title: `Level ${level} Array Challenge`,
        description: `Solve array manipulation problems suitable for level ${level} developers`,
        type: 'weekly',
        reward: baseReward,
        xp: baseXP,
        language: 'javascript',
        starterCode: `function arrayChallenge(arr) {
  // Your level ${level} solution here
  return [];
}`,
        tests: [
          { description: 'Should handle basic array operations', passed: false },
          { description: 'Should optimize for performance', passed: false },
          { description: 'Should handle edge cases', passed: false },
        ]
      },
      {
        id: `weekly-${level}-2`,
        title: `Level ${level} String Processor`,
        description: `Advanced string processing challenge for level ${level}`,
        type: 'weekly',
        reward: baseReward + 5,
        xp: baseXP + 50,
        language: 'javascript',
        starterCode: `function processString(text) {
  // Level ${level} string processing
  return '';
}`,
        tests: [
          { description: 'Should process strings correctly', passed: false },
          { description: 'Should handle special characters', passed: false },
          { description: 'Should be efficient', passed: false },
        ]
      }
    ];
  };

  const generateBossBattles = (level) => {
    const nextLevel = level + 1;
    const bossReward = Math.max(50, nextLevel * 10);
    const bossXP = Math.max(500, nextLevel * 50);

    return [
      {
        id: `boss-${nextLevel}`,
        title: `The Level ${nextLevel} Guardian`,
        description: `Defeat this boss to advance to level ${nextLevel}! This challenge tests advanced concepts.`,
        type: 'boss',
        reward: bossReward,
        xp: bossXP,
        language: 'javascript',
        starterCode: `function defeatGuardian(challenge) {
  // Prove you're ready for level ${nextLevel}
  return solution;
}`,
        tests: [
          { description: 'Should demonstrate advanced problem solving', passed: false },
          { description: 'Should handle complex algorithms', passed: false },
          { description: 'Should optimize for scalability', passed: false },
          { description: 'Should show mastery of concepts', passed: false },
        ]
      }
    ];
  };

  const weeklyChallenges = generateWeeklyChallenges(userLevel);
  const bossBattles = generateBossBattles(userLevel);
  const allChallenges = [...weeklyChallenges, ...bossBattles];

  const filteredChallenges = allChallenges.filter(challenge => {
    if (filter === 'weekly') return challenge.type === 'weekly';
    if (filter === 'boss') return challenge.type === 'boss';
    return true; // Show all if no specific filter
  });

  const handleChallengeComplete = (challenge) => {
    setCompletedChallenges(prev => [...prev, challenge.id]);
    setSelectedChallenge(null);

    // Show success message based on challenge type
    if (challenge.type === 'boss') {
      // Boss battle completed - user should level up
      console.log(`Boss battle completed! Ready to advance to level ${userLevel + 1}`);
    } else {
      // Weekly challenge completed
      console.log(`Weekly challenge completed! Earned ${challenge.reward} AVAX and ${challenge.xp} XP`);
    }

    // Here you would typically call an API to record the completion and update user progress
  };

  // Stats data for the overview
  const statsData = [
    { icon: Target, title: 'Current Level', value: userLevel, subtitle: 'Your progress', delay: 0.2 },
    { icon: Trophy, title: 'Completed', value: completedChallenges.length, subtitle: 'Challenges done', delay: 0.3 },
    { icon: Flame, title: 'Weekly Streak', value: 7, subtitle: 'Days active', delay: 0.4 },
    { icon: Zap, title: 'Total XP', value: userLevel * 1000, subtitle: 'Experience points', delay: 0.5 },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center">
              <Code size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4 font-['JetBrains_Mono']">
            Challenges
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['JetBrains_Mono']">
            Level-based challenges tailored to your skills and boss battles to advance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {selectedChallenge ? (
          <div className="space-y-6">
            <motion.button
              onClick={() => setSelectedChallenge(null)}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-['JetBrains_Mono'] shadow-lg"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ← Back to Challenges
            </motion.button>

            <Arena
              challenge={selectedChallenge}
              onComplete={handleChallengeComplete}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filter Buttons */}
            <ModernCard delay={0.6}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <motion.button
                    onClick={() => setFilter('weekly')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 font-['JetBrains_Mono'] ${
                      filter === 'weekly'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar size={20} />
                    <span>Weekly Challenge</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setFilter('boss')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 font-['JetBrains_Mono'] ${
                      filter === 'boss'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sword size={20} />
                    <span>Boss Battle</span>
                  </motion.button>
                </div>

                {/* User Level Info */}
                <div className="text-center md:text-right">
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono']">
                    Current Level: <span className="text-blue-400 font-semibold">{userLevel}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1 font-['JetBrains_Mono']">
                    {filter === 'weekly'
                      ? `Weekly challenges are tailored to your current level (${userLevel})`
                      : `Boss battles will help you advance to level ${userLevel + 1}`
                    }
                  </p>
                </div>
              </div>
            </ModernCard>

            {/* Challenge Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <ChallengeCard
                    challenge={challenge}
                    onSelect={setSelectedChallenge}
                    isSelected={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
      <AuthDebug pageName="Challenges" />
    </div>
  );
};

export default Challenges;
