import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaGithub, FaTimes, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import GithubProvider from './Github';

const AuthBanner = ({ 
  requireWallet = false, 
  requireGitHub = false, 
  requireBoth = false,
  dismissible = true,
  persistent = false,
  className = ""
}) => {
  const {
    walletConnected,
    githubConnected,
    authenticationComplete,
    getMissingAuth
  } = useAuthContext();

  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Determine what's needed
  const needsWallet = requireWallet || requireBoth;
  const needsGitHub = requireGitHub || requireBoth;
  const hasWallet = !needsWallet || walletConnected;
  const hasGitHub = !needsGitHub || githubConnected;
  const isComplete = hasWallet && hasGitHub;

  // Don't show if authentication is complete or banner is dismissed
  if (isComplete || (dismissed && !persistent)) {
    return null;
  }

  const missingAuth = getMissingAuth();
  const missingCount = missingAuth.length;

  const getBannerColor = () => {
    if (missingCount === 0) return 'bg-green-900/20 border-green-500/30';
    if (missingCount === 1) return 'bg-yellow-900/20 border-yellow-500/30';
    return 'bg-red-900/20 border-red-500/30';
  };

  const getTextColor = () => {
    if (missingCount === 0) return 'text-green-300';
    if (missingCount === 1) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getIconColor = () => {
    if (missingCount === 0) return 'text-green-400';
    if (missingCount === 1) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMessage = () => {
    if (missingCount === 0) return 'Authentication complete!';
    if (missingCount === 1) {
      const missing = missingAuth[0];
      return `Connect your ${missing} to access all features`;
    }
    return 'Connect your wallet and GitHub to access all features';
  };

  const handleCompleteAuth = () => {
    navigate('/auth-flow');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`
          relative border rounded-lg p-4 mb-4
          ${getBannerColor()}
          ${className}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className={`${getIconColor()} flex-shrink-0`} />
            
            <div className="flex-1">
              <p className={`font-medium ${getTextColor()}`}>
                {getMessage()}
              </p>
              
              {missingCount > 0 && (
                <div className="flex items-center gap-4 mt-2">
                  {/* Wallet Status */}
                  <div className="flex items-center gap-2">
                    <FaWallet className={walletConnected ? 'text-green-400' : 'text-gray-400'} />
                    <span className="text-sm text-gray-300">
                      Wallet {walletConnected ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  {/* GitHub Status */}
                  <div className="flex items-center gap-2">
                    <FaGithub className={githubConnected ? 'text-green-400' : 'text-gray-400'} />
                    <span className="text-sm text-gray-300">
                      GitHub {githubConnected ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            {!walletConnected && needsWallet && (
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                  if (!mounted) return null;
                  return (
                    <button
                      onClick={openConnectModal}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Connect Wallet
                    </button>
                  );
                }}
              </ConnectButton.Custom>
            )}

            {!githubConnected && needsGitHub && (
              <GithubProvider className="px-3 py-1 text-sm" />
            )}

            {/* Complete Auth Button */}
            

            {/* Dismiss Button */}
            {dismissible && !persistent && (
              <button
                onClick={() => setDismissed(true)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Dismiss"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {missingCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Authentication Progress</span>
              <span>{2 - missingCount}/2 Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((2 - missingCount) / 2) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Convenience components
export const WalletAuthBanner = (props) => (
  <AuthBanner requireWallet={true} {...props} />
);

export const GitHubAuthBanner = (props) => (
  <AuthBanner requireGitHub={true} {...props} />
);

export const FullAuthBanner = (props) => (
  <AuthBanner requireBoth={true} {...props} />
);

export default AuthBanner;
