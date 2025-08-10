import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useAccount } from 'wagmi';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import GithubProvider from '../components/Github';

const AuthStateTest = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Get all auth states
  const authContext = useAuthContext();
  const wagmiAccount = useAccount();
  const firebaseAuth = useFirebaseAuth();
  
  // Force re-render every second to see real-time changes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    walletConnected,
    githubConnected,
    authenticationComplete,
    user,
    loading,
    getDebugInfo,
    refreshAuthState,
    disconnectAll
  } = authContext;

  const debugInfo = getDebugInfo();
  const storedGithubToken = localStorage.getItem("githubAccessToken");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔍 Authentication State Test
          </h1>
          <p className="text-gray-300">
            Real-time authentication state monitoring (Updates: {refreshCount})
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current States */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Current Authentication States</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${
                walletConnected ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
              }`}>
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${walletConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {walletConnected ? '✅' : '❌'}
                  </div>
                  <div className="text-white font-semibold">Wallet Connected</div>
                  <div className="text-sm text-gray-400">{walletConnected.toString()}</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                githubConnected ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
              }`}>
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${githubConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {githubConnected ? '✅' : '❌'}
                  </div>
                  <div className="text-white font-semibold">GitHub Connected</div>
                  <div className="text-sm text-gray-400">{githubConnected.toString()}</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                authenticationComplete ? 'bg-green-900/20 border-green-500/30' : 'bg-yellow-900/20 border-yellow-500/30'
              }`}>
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${authenticationComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                    {authenticationComplete ? '🎉' : '⏳'}
                  </div>
                  <div className="text-white font-semibold">Auth Complete</div>
                  <div className="text-sm text-gray-400">{authenticationComplete.toString()}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={refreshAuthState}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                🔄 Refresh State
              </button>
              <button
                onClick={disconnectAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                🔌 Disconnect All
              </button>
            </div>
          </div>

          {/* Authentication Actions */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Authentication Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Wallet Connection</h3>
                <ConnectButton />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">GitHub Authentication</h3>
                <GithubProvider />
              </div>
            </div>
          </div>

          {/* Raw State Comparison */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Raw State Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">Context States</h3>
                <div className="space-y-2 text-sm">
                  <div>Wallet Connected: <span className="text-yellow-300">{walletConnected.toString()}</span></div>
                  <div>GitHub Connected: <span className="text-yellow-300">{githubConnected.toString()}</span></div>
                  <div>Auth Complete: <span className="text-yellow-300">{authenticationComplete.toString()}</span></div>
                  <div>Loading: <span className="text-yellow-300">{loading.toString()}</span></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Raw Sources</h3>
                <div className="space-y-2 text-sm">
                  <div>Wagmi Connected: <span className="text-yellow-300">{wagmiAccount.isConnected.toString()}</span></div>
                  <div>Wagmi Address: <span className="text-yellow-300">{!!wagmiAccount.address}</span></div>
                  <div>Firebase User: <span className="text-yellow-300">{!!firebaseAuth.user}</span></div>
                  <div>Firebase Loading: <span className="text-yellow-300">{firebaseAuth.loading.toString()}</span></div>
                  <div>GitHub Token: <span className="text-yellow-300">{!!storedGithubToken}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Expected vs Actual */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Expected vs Actual</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-white">Expected Wallet Connected:</span>
                <span className="text-yellow-300">{(!!wagmiAccount.isConnected && !!wagmiAccount.address).toString()}</span>
                <span className="text-white">Actual:</span>
                <span className={walletConnected === (!!wagmiAccount.isConnected && !!wagmiAccount.address) ? 'text-green-400' : 'text-red-400'}>
                  {walletConnected.toString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-white">Expected GitHub Connected:</span>
                <span className="text-yellow-300">{(!!firebaseAuth.user && !!storedGithubToken).toString()}</span>
                <span className="text-white">Actual:</span>
                <span className={githubConnected === (!!firebaseAuth.user && !!storedGithubToken) ? 'text-green-400' : 'text-red-400'}>
                  {githubConnected.toString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-white">Expected Auth Complete:</span>
                <span className="text-yellow-300">{(!!wagmiAccount.isConnected && !!wagmiAccount.address && !!firebaseAuth.user && !!storedGithubToken).toString()}</span>
                <span className="text-white">Actual:</span>
                <span className={authenticationComplete === (!!wagmiAccount.isConnected && !!wagmiAccount.address && !!firebaseAuth.user && !!storedGithubToken) ? 'text-green-400' : 'text-red-400'}>
                  {authenticationComplete.toString()}
                </span>
              </div>
            </div>
          </div>

          {/* Debug Information */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Debug Information</h2>
            <pre className="bg-black/30 p-4 rounded-lg text-sm text-gray-300 overflow-auto">
              {JSON.stringify({
                contextStates: {
                  walletConnected,
                  githubConnected,
                  authenticationComplete,
                  loading,
                  userType: user?.authType
                },
                rawSources: {
                  wagmiConnected: wagmiAccount.isConnected,
                  wagmiAddress: !!wagmiAccount.address,
                  firebaseUser: !!firebaseAuth.user,
                  firebaseLoading: firebaseAuth.loading,
                  githubToken: !!storedGithubToken
                },
                debugInfo,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthStateTest;
