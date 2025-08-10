import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaGithub, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import { useFullAuth, useWalletAuth, useGitHubAuth } from '../hooks/useAutoAuth';
import AuthStatus from '../components/AuthStatus';
import AuthBanner from '../components/AuthBanner';
import GlassCard from '../components/animations/GlassCard';

const AuthTest = () => {
  const navigate = useNavigate();
  const [testMode, setTestMode] = useState('full'); // 'full', 'wallet', 'github'
  const [testResults, setTestResults] = useState([]);

  const {
    user,
    walletConnected,
    githubConnected,
    authenticationComplete,
    walletAddress,
    chainName,
    getAuthStatus,
    getMissingAuth,
    disconnectWallet,
    disconnectGitHub,
    disconnectAll,
    shouldShowAuthPrompts,
    clearAuthPrompts,
    initializeAuth
  } = useAuthContext();

  // Test different auth requirements
  const fullAuth = useFullAuth({ autoRedirect: false });
  const walletAuth = useWalletAuth({ autoRedirect: false });
  const githubAuth = useGitHubAuth({ autoRedirect: false });

  const runTests = () => {
    const results = [];
    const authStatus = getAuthStatus();
    const missingAuth = getMissingAuth();

    // Test 1: Context State
    results.push({
      test: 'Context State',
      status: user ? 'PASS' : 'FAIL',
      details: `User object: ${user ? 'Present' : 'Missing'}`
    });

    // Test 2: Wallet Connection
    results.push({
      test: 'Wallet Connection',
      status: walletConnected ? 'PASS' : 'FAIL',
      details: walletConnected 
        ? `Connected: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)} (${chainName})`
        : 'Connect'
    });

    // Test 3: GitHub Authentication
    results.push({
      test: 'GitHub Authentication',
      status: githubConnected ? 'PASS' : 'FAIL',
      details: githubConnected 
        ? `Connected: ${user?.username || user?.displayName}`
        : 'Connect'
    });

    // Test 4: Complete Authentication
    results.push({
      test: 'Complete Authentication',
      status: authenticationComplete ? 'PASS' : 'FAIL',
      details: authenticationComplete 
        ? 'Both wallet and GitHub connected'
        : `Missing: ${missingAuth.join(', ')}`
    });

    // Test 5: Auto-Auth Hooks
    results.push({
      test: 'Full Auth Hook',
      status: fullAuth.isAuthenticated ? 'PASS' : 'FAIL',
      details: `Requires both: ${fullAuth.isAuthenticated ? 'Satisfied' : 'Not satisfied'}`
    });

    results.push({
      test: 'Wallet Auth Hook',
      status: walletAuth.isAuthenticated ? 'PASS' : 'FAIL',
      details: `Requires wallet: ${walletAuth.isAuthenticated ? 'Satisfied' : 'Not satisfied'}`
    });

    results.push({
      test: 'GitHub Auth Hook',
      status: githubAuth.isAuthenticated ? 'PASS' : 'FAIL',
      details: `Requires GitHub: ${githubAuth.isAuthenticated ? 'Satisfied' : 'Not satisfied'}`
    });

    // Test 6: Persistence
    const hasStoredData = !!(localStorage.getItem('userData') || localStorage.getItem('githubAccessToken'));
    results.push({
      test: 'Data Persistence',
      status: hasStoredData ? 'PASS' : 'FAIL',
      details: hasStoredData ? 'Auth data stored in localStorage' : 'No stored auth data'
    });

    // Test 7: Auth Prompts
    results.push({
      test: 'Auth Prompts System',
      status: shouldShowAuthPrompts() ? 'ACTIVE' : 'INACTIVE',
      details: shouldShowAuthPrompts() ? 'Prompts enabled' : 'Prompts disabled'
    });

    setTestResults(results);
  };

  const testRouteProtection = (route) => {
    navigate(route);
  };

  const resetAuth = async () => {
    await disconnectAll();
    clearAuthPrompts();
    localStorage.clear();
    setTestResults([]);
  };

  const initAuth = () => {
    const result = initializeAuth();
    if (result) {
      alert('Authentication flow initialized!');
    } else {
      alert('Authentication already complete!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Authentication System Test
          </h1>
          <p className="text-gray-300">
            Test the complete authentication flow including wallet connection, GitHub auth, and route protection
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Authentication Status */}
          <GlassCard>
            <h2 className="text-2xl font-semibold text-white mb-4">Current Status</h2>
            <AuthStatus showDetails={true} className="mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className={`p-3 rounded-lg border ${
                walletConnected ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <FaWallet className={walletConnected ? 'text-green-400' : 'text-red-400'} />
                  <span className="text-white">Wallet</span>
                  {walletConnected ? <FaCheck className="text-green-400" /> : <FaTimes className="text-red-400" />}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg border ${
                githubConnected ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <FaGithub className={githubConnected ? 'text-green-400' : 'text-red-400'} />
                  <span className="text-white">GitHub</span>
                  {githubConnected ? <FaCheck className="text-green-400" /> : <FaTimes className="text-red-400" />}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg border ${
                authenticationComplete ? 'bg-green-900/20 border-green-500/30' : 'bg-yellow-900/20 border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <FaCheck className={authenticationComplete ? 'text-green-400' : 'text-yellow-400'} />
                  <span className="text-white">Complete</span>
                  {authenticationComplete ? <FaCheck className="text-green-400" /> : <FaTimes className="text-yellow-400" />}
                </div>
              </div>
            </div>

            <AuthBanner requireBoth={true} className="mb-4" />
          </GlassCard>

          {/* Test Controls */}
          <GlassCard>
            <h2 className="text-2xl font-semibold text-white mb-4">Test Controls</h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={runTests}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
        
                Run Tests
              </button>
              
              <button
                onClick={initAuth}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FaArrowRight />
                Initialize Auth
              </button>
              
              <button
                onClick={resetAuth}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FaTimes />
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => testRouteProtection('/dashboard')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                Test Dashboard (Full)
              </button>
              <button
                onClick={() => testRouteProtection('/stake')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                Test Stake (Wallet)
              </button>
              <button
                onClick={() => testRouteProtection('/challenges')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                Test Challenges (GitHub)
              </button>
              <button
                onClick={() => testRouteProtection('/auth-flow')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                Test Auth Flow
              </button>
            </div>
          </GlassCard>

          {/* Test Results */}
          {testResults.length > 0 && (
            <GlassCard>
              <h2 className="text-2xl font-semibold text-white mb-4">Test Results</h2>
              
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'PASS' 
                        ? 'bg-green-900/20 border-green-500/30'
                        : result.status === 'FAIL'
                        ? 'bg-red-900/20 border-red-500/30'
                        : 'bg-yellow-900/20 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{result.test}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        result.status === 'PASS' ? 'bg-green-600' :
                        result.status === 'FAIL' ? 'bg-red-600' : 'bg-yellow-600'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm mt-1 opacity-80 text-gray-300">{result.details}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Debug Information */}
          <GlassCard>
            <h2 className="text-2xl font-semibold text-white mb-4">Debug Information</h2>
            <pre className="bg-black/30 p-4 rounded-lg text-sm text-gray-300 overflow-auto">
              {JSON.stringify({
                authStatus: getAuthStatus(),
                missingAuth: getMissingAuth(),
                user: user ? {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  username: user.username,
                  walletAddress: user.walletAddress,
                  hasGithubToken: !!user.githubAccessToken
                } : null,
                localStorage: {
                  userData: !!localStorage.getItem('userData'),
                  githubToken: !!localStorage.getItem('githubAccessToken'),
                  authToken: !!localStorage.getItem('authToken'),
                  showPrompts: localStorage.getItem('showAuthPrompts')
                },
                hooks: {
                  fullAuth: fullAuth.isAuthenticated,
                  walletAuth: walletAuth.isAuthenticated,
                  githubAuth: githubAuth.isAuthenticated
                }
              }, null, 2)}
            </pre>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
