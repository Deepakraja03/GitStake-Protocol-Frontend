import { useAuthContext } from '../context/AuthContext';
import { useAccount } from 'wagmi';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

const AuthDebug = ({ pageName = "Unknown" }) => {
  const {
    walletConnected,
    githubConnected,
    authenticationComplete,
    user,
    loading,
    getDebugInfo,
    refreshAuthState,
    disconnectAll
  } = useAuthContext();

  // Direct access to underlying states for comparison
  const { address, isConnected, chain } = useAccount();
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  
  const debugInfo = getDebugInfo();
  const storedGithubToken = localStorage.getItem("githubAccessToken");

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold text-yellow-400 mb-2">🐛 Auth Debug - {pageName}</div>
      
      <div className="space-y-1">
        <div className="text-green-400">Context States:</div>
        <div>• Wallet: {walletConnected ? '✅' : '❌'} ({walletConnected.toString()})</div>
        <div>• GitHub: {githubConnected ? '✅' : '❌'} ({githubConnected.toString()})</div>
        <div>• Complete: {authenticationComplete ? '✅' : '❌'} ({authenticationComplete.toString()})</div>
        <div>• Loading: {loading ? '⏳' : '✅'} ({loading.toString()})</div>
        
        <div className="text-blue-400 mt-2">Raw States:</div>
        <div>• Wagmi Connected: {isConnected ? '✅' : '❌'} ({isConnected.toString()})</div>
        <div>• Address: {address ? '✅' : '❌'} ({!!address})</div>
        <div>• Firebase User: {firebaseUser ? '✅' : '❌'} ({!!firebaseUser})</div>
        <div>• Firebase Loading: {firebaseLoading ? '⏳' : '✅'} ({firebaseLoading.toString()})</div>
        <div>• GitHub Token: {storedGithubToken ? '✅' : '❌'} ({!!storedGithubToken})</div>
        
        <div className="text-purple-400 mt-2">Computed:</div>
        <div>• Should Wallet: {(!!isConnected && !!address).toString()}</div>
        <div>• Should GitHub: {(!!firebaseUser && !!storedGithubToken).toString()}</div>
        <div>• Should Complete: {(!!isConnected && !!address && !!firebaseUser && !!storedGithubToken).toString()}</div>
        
        {user && (
          <div className="text-orange-400 mt-2">
            <div>User Type: {user.authType || 'unknown'}</div>
          </div>
        )}

        <div className="mt-3 flex gap-1">
          <button
            onClick={refreshAuthState}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
          >
            Refresh
          </button>
          <button
            onClick={disconnectAll}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
