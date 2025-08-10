import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWallet, FaGithub, FaLock, FaArrowRight } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import GithubProvider from './Github';

const ProtectedRoute = ({ 
  children, 
  requireWallet = false, 
  requireGitHub = false, 
  requireBoth = false,
  redirectTo = '/auth',
  showAuthPrompt = true 
}) => {
  const { 
    walletConnected, 
    githubConnected, 
    authenticationComplete,
    getMissingAuth,
    loading 
  } = useAuthContext();
  
  const navigate = useNavigate();

  // Determine what's required
  const needsWallet = requireWallet || requireBoth;
  const needsGitHub = requireGitHub || requireBoth;
  
  // Check if user meets requirements
  const hasWallet = !needsWallet || walletConnected;
  const hasGitHub = !needsGitHub || githubConnected;
  const isAuthorized = hasWallet && hasGitHub;

  useEffect(() => {
    if (!loading && !isAuthorized && !showAuthPrompt) {
      navigate(redirectTo);
    }
  }, [loading, isAuthorized, showAuthPrompt, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized && showAuthPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="mb-6">
            <FaLock className="mx-auto text-4xl text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-300">
              This page requires additional authentication to access.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {/* Wallet Connection Status */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              hasWallet 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                <FaWallet className={hasWallet ? 'text-green-400' : 'text-red-400'} />
                <span className="text-white">Wallet Connection</span>
              </div>
              {hasWallet ? (
                <span className="text-green-400 text-sm">✓ Connected</span>
              ) : (
                <span className="text-red-400 text-sm">✗ Required</span>
              )}
            </div>

            {/* GitHub Authentication Status */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              hasGitHub 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                <FaGithub className={hasGitHub ? 'text-green-400' : 'text-red-400'} />
                <span className="text-white">GitHub Authentication</span>
              </div>
              {hasGitHub ? (
                <span className="text-green-400 text-sm">✓ Connected</span>
              ) : (
                <span className="text-red-400 text-sm">✗ Required</span>
              )}
            </div>
          </div>

          {/* Authentication Actions */}
          <div className="space-y-3">
            {!hasWallet && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Connect your wallet:</p>
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    if (!ready) {
                      return <div className="h-10 bg-gray-700 rounded-lg animate-pulse" />;
                    }

                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div className="text-green-400 text-sm">
                        ✅ Wallet Connected: {account.displayName}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            )}

            {!hasGitHub && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Connect your GitHub:</p>
                <GithubProvider 
                  className="w-full"
                  onSuccess={() => {
                    // The context will automatically update
                  }}
                />
              </div>
            )}

            {isAuthorized && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => window.location.reload()}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <FaArrowRight />
              </motion.button>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }

  return children;
};

// Convenience components for specific protection types
export const WalletProtectedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireWallet={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const GitHubProtectedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireGitHub={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const FullyProtectedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireBoth={true} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
