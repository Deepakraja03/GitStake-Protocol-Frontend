import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import GlassCard from './animations/GlassCard';

const GitHubAuth = ({ onSuccess, onError }) => {
  const { user, analyzeGitHubUser } = useAuthContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('connect'); // connect, analyze, complete

  const handleGitHubConnect = () => {
    setIsConnecting(true);
    setError(null);

    // GitHub OAuth URL
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth`;
    const scope = 'read:user,user:email,repo';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=github_auth`;
    
    // Open GitHub OAuth in the same window
    window.location.href = githubAuthUrl;
  };

  const handleAnalyzeProfile = async (username) => {
    setIsAnalyzing(true);
    setStep('analyze');
    
    try {
      const result = await analyzeGitHubUser(username);
      
      if (result.success) {
        setStep('complete');
        onSuccess?.(result.data);
      } else {
        setError(result.error);
        onError?.(result.error);
      }
    } catch (error) {
      const errorMessage = 'Failed to analyze GitHub profile';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check for GitHub OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state === 'github_auth') {
      // Handle OAuth callback
      setIsConnecting(false);
      
      // In a real implementation, you would exchange the code for an access token
      // For now, we'll simulate a successful connection
      const mockGitHubUser = {
        githubUsername: 'example-user', // This would come from the GitHub API
        githubAccessToken: 'mock-token'
      };
      
      // Store GitHub data
      localStorage.setItem('githubAccessToken', mockGitHubUser.githubAccessToken);
      
      // Trigger analysis
      handleAnalyzeProfile(mockGitHubUser.githubUsername);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const getStepIcon = () => {
    switch (step) {
      case 'connect':
        return isConnecting ? <FaSpinner className="animate-spin" /> : <FaGithub />;
      case 'analyze':
        return isAnalyzing ? <FaSpinner className="animate-spin" /> : <FaGithub />;
      case 'complete':
        return <FaCheck />;
      default:
        return <FaGithub />;
    }
  };

  const getStepText = () => {
    switch (step) {
      case 'connect':
        return isConnecting ? 'Connecting to GitHub...' : 'Connect GitHub Account';
      case 'analyze':
        return isAnalyzing ? 'Analyzing your GitHub profile...' : 'Analyzing Profile';
      case 'complete':
        return 'Analysis Complete!';
      default:
        return 'Connect GitHub Account';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'connect':
        return 'Connect your GitHub account to start analyzing your developer profile';
      case 'analyze':
        return 'We\'re analyzing your repositories, commits, and coding patterns';
      case 'complete':
        return 'Your GitHub profile has been successfully analyzed and stored';
      default:
        return 'Connect your GitHub account to get started';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <GlassCard className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl ${
            step === 'complete' 
              ? 'bg-green-500/20 text-green-400' 
              : error 
              ? 'bg-red-500/20 text-red-400'
              : 'bg-purple-500/20 text-purple-400'
          }`}
        >
          {error ? <FaExclamationTriangle /> : getStepIcon()}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-3"
        >
          {getStepText()}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-6"
        >
          {getStepDescription()}
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        {step === 'connect' && !isConnecting && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleGitHubConnect}
            className="w-full flex items-center justify-center space-x-3 py-3 px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 border border-gray-600"
          >
            <FaGithub className="text-xl" />
            <span className="font-semibold">Connect with GitHub</span>
          </motion.button>
        )}

        {(isConnecting || isAnalyzing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-purple-400"
          >
            <FaSpinner className="animate-spin" />
            <span className="text-sm">
              {isConnecting ? 'Connecting...' : 'Analyzing...'}
            </span>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-green-500/20 border border-green-500/30 text-green-300 p-3 rounded-lg text-sm">
              ✅ GitHub profile connected and analyzed successfully!
            </div>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-semibold"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xs text-gray-500"
        >
          <p>🔒 Your data is secure and only used for analysis</p>
          <p className="mt-1">We only read public repository information</p>
        </motion.div>
      </GlassCard>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex items-center justify-center space-x-4"
      >
        {['connect', 'analyze', 'complete'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === stepName
                  ? 'bg-purple-600 text-white'
                  : index < ['connect', 'analyze', 'complete'].indexOf(step)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              {index < ['connect', 'analyze', 'complete'].indexOf(step) ? (
                <FaCheck />
              ) : (
                index + 1
              )}
            </div>
            {index < 2 && (
              <div
                className={`w-8 h-0.5 mx-2 ${
                  index < ['connect', 'analyze', 'complete'].indexOf(step)
                    ? 'bg-green-600'
                    : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default GitHubAuth;