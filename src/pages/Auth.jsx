import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TypingText from '../components/animations/TypingText';
import GlassCard from '../components/animations/GlassCard';
import GithubProvider from '../components/Github';

const Auth = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [githubLoading, setGithubLoading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const navigate = useNavigate();

  const onboardingSteps = [
    { id: 'wallet', label: 'Connect Wallet', completed: false },
    { id: 'github', label: 'Connect GitHub', completed: false },
    { id: 'intro', label: 'Complete Intro Quest', completed: false },
  ];

  const [steps, setSteps] = useState(onboardingSteps);

  const handleGitHubSuccess = (userData) => {
    console.log('GitHub authentication successful:', userData);
    setSteps(prev => prev.map(step =>
      step.id === 'github' ? { ...step, completed: true } : step
    ));
    setCurrentStep(2);
    setGithubLoading(false);
  };

  const handleGitHubError = (error) => {
    console.error('GitHub authentication failed:', error);
    setGithubLoading(false);
    // You can add error handling UI here
  };

  const completeIntroQuest = () => {
    setSteps(prev => prev.map(step => 
      step.id === 'intro' ? { ...step, completed: true } : step
    ));
    setOnboardingComplete(true);
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GitStake
            </span>
          </motion.h1>
          
          <TypingText
            text="Stake your code, earn your rewards"
            className="text-gray-300 text-lg"
            speed={80}
            startDelay={1000}
          />
        </div>

        <GlassCard className="p-8 space-y-6">
          {/* Onboarding Checklist */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Get Started</h2>
            
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-500 border-green-500' 
                      : currentStep === index 
                        ? 'border-blue-400 bg-blue-400/20' 
                        : 'border-gray-400'
                  }`}
                  whileScale={step.completed ? [1, 1.2, 1] : 1}
                  transition={{ duration: 0.3 }}
                >
                  {step.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <FaCheck className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                
                <span className={`${step.completed ? 'text-green-400' : 'text-gray-300'}`}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Wallet Connect */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, mounted }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      if (connected && !steps[0].completed) {
                        setSteps(prev => prev.map(step => 
                          step.id === 'wallet' ? { ...step, completed: true } : step
                        ));
                        setCurrentStep(1);
                      }

                      return (
                        <div>
                          {(() => {
                            if (!ready) {
                              return (
                                <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse" />
                              );
                            }

                            if (!connected) {
                              return (
                                <motion.button
                                  onClick={openConnectModal}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Connect Wallet
                                </motion.button>
                              );
                            }

                            return (
                              <div className="text-center text-green-400">
                                ✅ Wallet Connected: {account.displayName}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </motion.div>
            )}

            {/* GitHub OAuth */}
            {currentStep === 1 && (
              <motion.div
                key="github"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <GithubProvider
                  onSuccess={handleGitHubSuccess}
                  onError={handleGitHubError}
                  className="w-full py-3 px-6 text-lg"
                />
              </motion.div>
            )}

            {/* Intro Quest */}
            {currentStep === 2 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Complete Your First Quest
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Learn the basics of GitStake and earn your first rewards
                  </p>
                  
                  <motion.button
                    onClick={completeIntroQuest}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Intro Quest
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Animation */}
          <AnimatePresence>
            {onboardingComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0]
                  }}
                  transition={{ duration: 1 }}
                >
                  <FaCheck className="w-8 h-8 text-white" />
                </motion.div>
                
                <TypingText
                  text="Welcome to GitStake! Redirecting to dashboard..."
                  className="text-green-400 text-lg"
                  speed={50}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Auth;
