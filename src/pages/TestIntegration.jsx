import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { userService } from '../services/userService';
import { questService } from '../services/questService';
import { chatService } from '../services/chatService';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';

const TestIntegration = () => {
  const [tests, setTests] = useState([
    { name: 'User Analysis', status: 'idle', result: null },
    { name: 'Quest Generation', status: 'idle', result: null },
    { name: 'Chat Assistant', status: 'idle', result: null },
    { name: 'Deep Search', status: 'idle', result: null }
  ]);

  const updateTestStatus = (index, status, result = null) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, result } : test
    ));
  };

  const runTest = async (testIndex) => {
    updateTestStatus(testIndex, 'running');

    try {
      switch (testIndex) {
        case 0: // User Analysis
          const analysisResult = await userService.analyzeUser({ 
            username: 'octocat' // GitHub's mascot account
          });
          updateTestStatus(testIndex, 'success', analysisResult);
          break;

        case 1: // Quest Generation
          const questResult = await questService.generation.generateQuest({
            level: 3,
            technologies: ['JavaScript', 'React'],
            difficulty: 'intermediate'
          });
          updateTestStatus(testIndex, 'success', questResult);
          break;

        case 2: // Chat Assistant
          const chatResult = await chatService.assistant.askAssistant({
            message: 'Hello, can you help me with GitStake?',
            context: { platform: 'GitStake', test: true }
          });
          updateTestStatus(testIndex, 'success', chatResult);
          break;

        case 3: // Deep Search
          const searchResult = await chatService.deepSearch.generalSearch({
            query: 'React best practices',
            maxResults: 3
          });
          updateTestStatus(testIndex, 'success', searchResult);
          break;

        default:
          throw new Error('Unknown test');
      }
    } catch (error) {
      updateTestStatus(testIndex, 'error', error.message);
    }
  };

  const runAllTests = async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <FaSpinner className="animate-spin text-blue-400" />;
      case 'success':
        return <FaCheck className="text-green-400" />;
      case 'error':
        return <FaTimes className="text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'border-blue-400 bg-blue-400/10';
      case 'success':
        return 'border-green-400 bg-green-400/10';
      case 'error':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="API Integration Test" speed={80} />
          </h1>
          <p className="text-gray-400">Test the GitStake backend integration</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <button
            onClick={runAllTests}
            disabled={tests.some(test => test.status === 'running')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaPlay />
            <span>Run All Tests</span>
          </button>
        </motion.div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className={`p-6 border-2 ${getStatusColor(test.status)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{test.name}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(test.status)}
                    <button
                      onClick={() => runTest(index)}
                      disabled={test.status === 'running'}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors disabled:opacity-50"
                    >
                      Test
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-semibold ${
                      test.status === 'success' ? 'text-green-400' :
                      test.status === 'error' ? 'text-red-400' :
                      test.status === 'running' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>

                  {test.result && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-xs mb-2">Response:</p>
                      <div className="bg-black/20 rounded p-2 text-xs text-gray-300 max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">
                          {typeof test.result === 'string' 
                            ? test.result 
                            : JSON.stringify(test.result, null, 2)
                          }
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* API Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Configuration</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">API Base URL:</span>
                <span className="text-white font-mono">
                  {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-white">
                  {import.meta.env.MODE}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GitHub Client ID:</span>
                <span className="text-white font-mono">
                  {import.meta.env.VITE_GITHUB_CLIENT_ID ? '✓ Configured' : '✗ Missing'}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>1. Ensure your backend server is running on the configured API base URL</p>
              <p>2. Make sure all required environment variables are set</p>
              <p>3. Click "Run All Tests" to verify the integration</p>
              <p>4. Check individual test results for detailed information</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default TestIntegration;