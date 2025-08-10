import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaGithub, FaCheck, FaArrowRight, FaHome } from 'react-icons/fa';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuthContext } from '../context/AuthContext';
import GithubProvider from './Github';
import TypingText from './animations/TypingText';
import GlassCard from './animations/GlassCard';

const AuthFlow = ({ 
  onComplete, 
  redirectTo = '/dashboard',
  showSkip = false,
  title = "Welcome to GitStake Protocol",
  subtitle = "Connect your wallet and GitHub to get started"
}) => {
  const { 
    walletConnected, 
    githubConnected, 
    authenticationComplete,
    user 
  } = useAuthContext();
  
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = [
    {
      id: 'wallet',
      title: 'Connect Wallet',
      description: 'Connect your wallet to interact with the protocol',
      icon: FaWallet,
      required: true,
      completed: walletConnected
    },
    {
      id: 'github',
      title: 'Connect GitHub',
      description: 'Link your GitHub account to track contributions',
      icon: FaGithub,
      required: true,
      completed: githubConnected
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'You\'re ready to start using GitStake Protocol',
      icon: FaCheck,
      required: false,
      completed: authenticationComplete
    }
  ];

  // Update current step based on authentication status
  useEffect(() => {
    if (!walletConnected) {
      setCurrentStep(0);
    } else if (!githubConnected) {
      setCurrentStep(1);
    } else if (authenticationComplete) {
      setCurrentStep(2);
    }

    // Update completed steps
    const newCompleted = new Set();
    if (walletConnected) newCompleted.add('wallet');
    if (githubConnected) newCompleted.add('github');
    if (authenticationComplete) newCompleted.add('complete');
    setCompletedSteps(newCompleted);
  }, [walletConnected, githubConnected, authenticationComplete]);

  // Auto-complete flow when both are connected
  useEffect(() => {
    if (authenticationComplete && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [authenticationComplete, onComplete]);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate(redirectTo);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
      <GlassCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              <TypingText text={title} />
            </h1>
            <p className="text-gray-300">
              {subtitle}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = completedSteps.has(step.id);
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-400'
                    }
                  `}>
                    {isCompleted ? <FaCheck /> : <Icon />}
                  </div>
                  <span className={`text-xs mt-2 ${
                    isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Wallet Connection Step */}
          {currentStep === 0 && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-300 text-sm">
                  Connect your wallet to interact with smart contracts and earn rewards
                </p>
              </div>

              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  if (!ready) {
                    return <div className="h-12 bg-gray-700 rounded-lg animate-pulse" />;
                  }

                  if (!connected) {
                    return (
                      <motion.button
                        onClick={openConnectModal}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Connect Wallet
                      </motion.button>
                    );
                  }

                  return (
                    <div className="text-center">
                      <div className="text-green-400 mb-2">
                        ✅ Wallet Connected
                      </div>
                      <div className="text-sm text-gray-300">
                        {account.displayName} on {chain.name}
                      </div>
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </motion.div>
          )}

          {/* GitHub Connection Step */}
          {currentStep === 1 && (
            <motion.div
              key="github"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Connect GitHub
                </h3>
                <p className="text-gray-300 text-sm">
                  Link your GitHub account to track contributions and earn rewards
                </p>
              </div>

              {!githubConnected ? (
                <GithubProvider 
                  className="w-full py-3 px-6 text-lg"
                  onSuccess={(userData) => {
                    console.log('GitHub connected:', userData);
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-green-400 mb-2">
                    ✅ GitHub Connected
                  </div>
                  <div className="text-sm text-gray-300">
                    Welcome, {user?.displayName || user?.username}!
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Completion Step */}
          {currentStep === 2 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-3xl text-white" />
                </div>
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  You're All Set! 🎉
                </h3>
                <p className="text-gray-300 mb-6">
                  Your wallet and GitHub are connected. You can now access all features of GitStake Protocol.
                </p>
              </div>

              <motion.button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Continue to Dashboard <FaArrowRight />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip/Home Button */}
        {showSkip && (
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <FaHome /> Skip to Home
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AuthFlow;
