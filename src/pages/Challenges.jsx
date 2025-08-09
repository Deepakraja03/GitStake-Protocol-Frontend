import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaPlay, FaCheck, FaTimes, FaFire, FaCrown } from 'react-icons/fa';
import MonacoEditor from 'react-monaco-editor';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';
import ProgressRing from '../components/animations/ProgressRing';

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
    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
      isSelected 
        ? 'border-blue-500 bg-blue-500/10' 
        : 'border-white/10 bg-white/5 hover:bg-white/10'
    }`}
    onClick={() => onSelect(challenge)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-white font-semibold">{challenge.title}</h3>
      <div className="flex items-center space-x-2">
        {challenge.type === 'boss' && <FaCrown className="text-yellow-400" />}
        <span className={`px-2 py-1 rounded text-xs ${
          challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {challenge.difficulty}
        </span>
      </div>
    </div>
    <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-blue-400 font-semibold">{challenge.reward} AVAX</span>
      <div className="flex items-center space-x-1">
        <FaFire className="text-orange-400" />
        <span className="text-white text-sm">{challenge.xp} XP</span>
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
      <GlassCard className="p-4 relative">
        <ReactiveBackground 
          success={backgroundState === 'success'}
          error={backgroundState === 'error'}
        />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
          <motion.button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay />
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
        <div className="mt-4 space-y-2">
          <h4 className="text-white font-semibold">Test Results:</h4>
          {testResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center space-x-2 p-2 rounded ${
                result.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {result.passed ? <FaCheck /> : <FaTimes />}
              <span className="text-sm">{result.description}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Boss Battle */}
      <GlassCard className="p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Boss Battle</h3>
        
        <div className="mb-6">
          <BossAvatar state={bossState} health={bossHealth} />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Boss Health</span>
            <span className="text-white font-bold">{Math.round(bossHealth)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${bossHealth}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Challenge Description</p>
            <p className="text-white">{challenge.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Reward</p>
              <p className="text-blue-400 font-bold">{challenge.reward} AVAX</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">XP</p>
              <p className="text-orange-400 font-bold">{challenge.xp} XP</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const Challenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filter, setFilter] = useState('all');
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const challenges = [
    {
      id: 1,
      title: 'Array Manipulation Master',
      description: 'Implement efficient array sorting and filtering algorithms',
      difficulty: 'easy',
      type: 'regular',
      reward: 10,
      xp: 100,
      language: 'javascript',
      starterCode: `function sortAndFilter(arr, condition) {
  // Your code here
  return [];
}`,
      tests: [
        { description: 'Should sort numbers in ascending order', passed: false },
        { description: 'Should filter even numbers', passed: false },
        { description: 'Should handle empty arrays', passed: false },
      ]
    },
    {
      id: 2,
      title: 'The Recursive Dragon',
      description: 'Defeat the dragon using recursive algorithms',
      difficulty: 'hard',
      type: 'boss',
      reward: 50,
      xp: 500,
      language: 'javascript',
      starterCode: `function defeatDragon(dragonHealth, attackPower) {
  // Use recursion to defeat the dragon
  return 0;
}`,
      tests: [
        { description: 'Should calculate correct number of attacks', passed: false },
        { description: 'Should handle edge cases', passed: false },
        { description: 'Should use recursion', passed: false },
        { description: 'Should optimize for large numbers', passed: false },
      ]
    },
    {
      id: 3,
      title: 'String Wizard',
      description: 'Master string manipulation and pattern matching',
      difficulty: 'medium',
      type: 'regular',
      reward: 25,
      xp: 250,
      language: 'javascript',
      starterCode: `function stringMagic(text, pattern) {
  // Your magical string manipulation here
  return '';
}`,
      tests: [
        { description: 'Should find all pattern matches', passed: false },
        { description: 'Should handle case sensitivity', passed: false },
        { description: 'Should return correct format', passed: false },
      ]
    }
  ];

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'boss') return challenge.type === 'boss';
    return challenge.difficulty === filter;
  });

  const handleChallengeComplete = (challenge) => {
    setCompletedChallenges(prev => [...prev, challenge.id]);
    setSelectedChallenge(null);
    // Here you would typically call an API to record the completion
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="Code Challenges & Boss Battles" speed={80} />
          </h1>
          <p className="text-gray-400">Test your skills and earn rewards</p>
        </motion.div>

        {selectedChallenge ? (
          <div className="space-y-6">
            <motion.button
              onClick={() => setSelectedChallenge(null)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              ← Back to Challenges
            </motion.button>
            
            <Arena 
              challenge={selectedChallenge} 
              onComplete={handleChallengeComplete}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {['all', 'easy', 'medium', 'hard', 'boss'].map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </motion.button>
              ))}
            </motion.div>

            {/* Challenge Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
    </div>
  );
};

export default Challenges;
