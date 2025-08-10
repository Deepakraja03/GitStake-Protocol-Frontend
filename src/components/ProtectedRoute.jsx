import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Lock, ArrowRight, Shield, CheckCircle, AlertCircle, Home, Sparkles, Code2 } from 'lucide-react';
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
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Beautiful Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,65,66,0.1),transparent_50%)]" />
        </div>

        {/* Loading Animation */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#E84142] rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#9B2CFF] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white font-['Fira_Sans'] animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized && showAuthPrompt) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-6 py-20">
        {/* Beautiful Background matching landing page */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,65,66,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(155,44,255,0.1),transparent_50%)]" />

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-2 h-2 bg-[#E84142] rounded-full"
          />
          <motion.div
            animate={{ y: [10, -10, 10], x: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 w-1 h-1 bg-[#9B2CFF] rounded-full"
          />
          <motion.div
            animate={{ y: [-5, 15, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-white/20 rounded-full"
          />
          <motion.div
            animate={{ y: [5, -15, 5], x: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-2 h-2 bg-[#E84142]/30 rounded-full"
          />

          {/* Additional floating particles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 left-1/4 w-1 h-1 bg-[#9B2CFF]/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#E84142]/20 rounded-full"
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg w-full"
        >
          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 text-center hover:bg-white/[0.03] transition-all duration-500 hover:border-white/[0.08] hover:shadow-2xl hover:shadow-[#E84142]/5">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10 border border-[#E84142]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-[#E84142]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 font-['Fira_Code']">
                Authentication Required
              </h2>
              <p className="text-gray-400 font-['Fira_Sans'] leading-relaxed">
                This page requires additional authentication to access.
              </p>

              {/* Overall Status Summary */}
              <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/[0.05]">
                <div className="text-sm text-gray-300 font-['Fira_Sans']">
                  <span className="text-white">Overall Status: </span>
                  {authenticationComplete ? (
                    <span className="text-green-400">✅ Fully Connected</span>
                  ) : walletConnected && githubConnected ? (
                    <span className="text-green-400">✅ Both Connected</span>
                  ) : walletConnected ? (
                    <span className="text-yellow-400">🟡 Wallet Only</span>
                  ) : githubConnected ? (
                    <span className="text-yellow-400">🟡 GitHub Only</span>
                  ) : (
                    <span className="text-red-400">❌ Not Connected</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Authentication Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              {/* Wallet Connection Status - Show ACTUAL status */}
              <div className={`backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 ${
                walletConnected
                  ? 'bg-green-500/[0.05] border-green-500/20'
                  : 'bg-red-500/[0.05] border-red-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      walletConnected
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      <Wallet size={20} className={walletConnected ? 'text-green-400' : 'text-red-400'} />
                    </div>
                    <div>
                      <span className="text-white font-['Fira_Sans'] font-medium">Wallet Connection</span>
                      <p className="text-xs text-gray-400 font-['Fira_Sans']">
                        {walletConnected
                          ? `Connected: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
                          : 'Not connected to any wallet'
                        }
                      </p>
                      {needsWallet && (
                        <p className="text-xs text-yellow-300 font-['Fira_Sans'] mt-1">
                          ⚠️ Required for this page
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {walletConnected ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : (
                      <AlertCircle size={20} className="text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub Authentication Status - Show ACTUAL status */}
              <div className={`backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 ${
                githubConnected
                  ? 'bg-green-500/[0.05] border-green-500/20'
                  : 'bg-red-500/[0.05] border-red-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      githubConnected
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      <Code2 size={20} className={githubConnected ? 'text-green-400' : 'text-red-400'} />
                    </div>
                    <div>
                      <span className="text-white font-['Fira_Sans'] font-medium">GitHub Authentication</span>
                      <p className="text-xs text-gray-400 font-['Fira_Sans']">
                        {githubConnected
                          ? `Connected: @${user?.username || user?.displayName || 'Unknown'}`
                          : 'Not connected to GitHub'
                        }
                      </p>
                      {needsGitHub && (
                        <p className="text-xs text-yellow-300 font-['Fira_Sans'] mt-1">
                          ⚠️ Required for this page
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {githubConnected ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : (
                      <AlertCircle size={20} className="text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Indicator - Show ACTUAL progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between text-sm text-gray-400 font-['Fira_Sans'] mb-2">
                <span>Current Authentication Status</span>
                <span>{(walletConnected ? 1 : 0) + (githubConnected ? 1 : 0)}/2 Connected</span>
              </div>
              <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#E84142] to-[#9B2CFF] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((walletConnected ? 1 : 0) + (githubConnected ? 1 : 0)) * 50}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Show what's needed for this specific page */}
              <div className="mt-3 text-xs text-gray-400 font-['Fira_Sans']">
                <span>This page requires: </span>
                {needsWallet && needsGitHub && <span className="text-yellow-300">Wallet + GitHub</span>}
                {needsWallet && !needsGitHub && <span className="text-yellow-300">Wallet only</span>}
                {!needsWallet && needsGitHub && <span className="text-yellow-300">GitHub only</span>}
              </div>
            </motion.div>

            {/* Authentication Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {!walletConnected && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 font-['Fira_Sans'] text-left">
                    {needsWallet ? 'Connect your wallet to continue:' : 'Connect your wallet (optional):'}
                  </p>
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, mounted }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      if (!ready) {
                        return (
                          <div className="h-12 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse" />
                        );
                      }

                      if (!connected) {
                        return (
                          <motion.button
                            onClick={openConnectModal}
                            className="w-full bg-gradient-to-r from-[#E84142] to-[#9B2CFF] hover:shadow-lg hover:shadow-[#E84142]/25 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 font-['Fira_Sans'] flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Wallet size={20} />
                            Connect Wallet
                          </motion.button>
                        );
                      }

                      return (
                        <div className="backdrop-blur-xl bg-green-500/[0.05] border border-green-500/20 rounded-xl p-3 text-center">
                          <CheckCircle size={20} className="text-green-400 mx-auto mb-1" />
                          <p className="text-green-400 text-sm font-['Fira_Sans']">
                            Wallet Connected: {account.displayName}
                          </p>
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              )}

              {!githubConnected && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 font-['Fira_Sans'] text-left">
                    {needsGitHub ? 'Connect your GitHub account to continue:' : 'Connect your GitHub account (optional):'}
                  </p>
                  <div className="w-full">
                    <GithubProvider
                      className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 font-['Fira_Sans'] flex items-center justify-center gap-2"
                      onSuccess={() => {
                        // The context will automatically update
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Show success message when user has what they need for this page */}
              {isAuthorized && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-4"
                >
                  {/* Success Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="backdrop-blur-xl bg-green-500/[0.05] border border-green-500/20 rounded-xl p-4"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2"
                    >
                      <CheckCircle size={24} className="text-green-400" />
                    </motion.div>
                    <p className="text-green-400 font-['Fira_Sans'] font-medium">
                      🎉 Authentication Complete!
                    </p>
                    <p className="text-green-300/80 text-sm font-['Fira_Sans'] mt-1">
                      You're ready to explore all features
                    </p>
                  </motion.div>

                  {/* Continue Button */}
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 font-['Fira_Sans'] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/25"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles size={20} className="animate-pulse" />
                    Continue to App
                    <ArrowRight size={20} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 pt-6 border-t border-white/[0.05]"
            >
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white text-sm transition-all duration-300 font-['Fira_Sans'] flex items-center justify-center gap-2 mx-auto group"
              >
                <Home size={16} className="group-hover:scale-110 transition-transform duration-300" />
                Back to Home
              </button>
            </motion.div>
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
