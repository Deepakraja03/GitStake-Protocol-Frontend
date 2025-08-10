import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaGithub, FaUser, FaChevronDown, FaSignOutAlt, FaUnlink } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import GithubProvider from './Github';

const AuthStatus = ({ showDetails = false, className = "" }) => {
  const { 
    user,
    walletConnected, 
    githubConnected, 
    authenticationComplete,
    walletAddress,
    chainName,
    disconnectWallet,
    disconnectGitHub,
    disconnectAll,
    getAuthStatus,
    getMissingAuth
  } = useAuthContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const authStatus = getAuthStatus();
  const missingAuth = getMissingAuth();

  const getStatusColor = () => {
    if (authenticationComplete) return 'text-green-400';
    if (walletConnected || githubConnected) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusText = () => {
    if (authenticationComplete) return 'Fully Connected';
    if (walletConnected && !githubConnected) return 'Wallet Only';
    if (!walletConnected && githubConnected) return 'GitHub Only';
    return 'Connect';
  };

  const getStatusIcon = () => {
    if (authenticationComplete) return '🟢';
    if (walletConnected || githubConnected) return '🟡';
    return '🔴';
  };

  if (!showDetails) {
    // Compact status indicator
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm">{getStatusIcon()}</span>
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    );
  }

  // Detailed status with dropdown
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
      >
        <span className="text-sm">{getStatusIcon()}</span>
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        <FaChevronDown className={`text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-50"
          >
            <div className="p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaUser className="text-blue-400" />
                Authentication Status
              </h3>

              {/* Wallet Status */}
              <div className="mb-4">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  walletConnected 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-gray-800/50 border-gray-600/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <FaWallet className={walletConnected ? 'text-green-400' : 'text-gray-400'} />
                    <div>
                      <span className="text-white text-sm">Wallet</span>
                      {walletConnected && walletAddress && (
                        <div className="text-xs text-gray-400">
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          {chainName && <span className="ml-2">({chainName})</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {walletConnected ? (
                      <>
                        <span className="text-green-400 text-xs">✓</span>
                        <button
                          onClick={disconnectWallet}
                          className="text-red-400 hover:text-red-300 text-xs"
                          title="Disconnect Wallet"
                        >
                          <FaUnlink />
                        </button>
                      </>
                    ) : (
                      <ConnectButton.Custom>
                        {({ openConnectModal, mounted }) => {
                          if (!mounted) return null;
                          return (
                            <button
                              onClick={openConnectModal}
                              className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 border border-blue-400/30 rounded"
                            >
                              Connect
                            </button>
                          );
                        }}
                      </ConnectButton.Custom>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub Status */}
              <div className="mb-4">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  githubConnected 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-gray-800/50 border-gray-600/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <FaGithub className={githubConnected ? 'text-green-400' : 'text-gray-400'} />
                    <div>
                      <span className="text-white text-sm">GitHub</span>
                      {githubConnected && user?.username && (
                        <div className="text-xs text-gray-400">
                          @{user.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {githubConnected ? (
                      <>
                        <span className="text-green-400 text-xs">✓</span>
                        <button
                          onClick={disconnectGitHub}
                          className="text-red-400 hover:text-red-300 text-xs"
                          title="Disconnect GitHub"
                        >
                          <FaUnlink />
                        </button>
                      </>
                    ) : (
                      <div className="text-xs">
                        <GithubProvider className="text-xs px-2 py-1 border border-gray-400/30 rounded" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Authentication Alert */}
              {missingAuth.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-xs">
                    Missing: {missingAuth.join(', ')} authentication
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {authenticationComplete && (
                  <button
                    onClick={disconnectAll}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg text-xs transition-colors"
                  >
                    <FaSignOutAlt />
                    Disconnect All
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthStatus;
