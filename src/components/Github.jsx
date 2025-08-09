import { useState } from 'react';
import { FaGithub, FaSpinner } from 'react-icons/fa';
import { signInWithGitHub, signOutUser } from "../../firebase.config";
import { useAuthContext } from '../context/AuthContext';

export default function GithubProvider({ onSuccess, onError, className = "" }) {
  const [loading, setLoading] = useState(false);
  const { user, setUser, setIsAuthenticated } = useAuthContext();

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGitHub();

      // Store user data and GitHub access token
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        username: result.profile?.login,
        githubAccessToken: result.accessToken,
        isNewUser: result.isNewUser
      };

      // Update auth context
      setUser(userData);
      setIsAuthenticated(true);

      // Store in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('githubAccessToken', result.accessToken);

      console.log('GitHub authentication successful:', userData);

      if (onSuccess) {
        onSuccess(userData);
      }
    } catch (error) {
      console.error('GitHub authentication failed:', error);

      let errorMessage = 'Authentication failed';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Authentication cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups for this site.';
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userData');
      localStorage.removeItem('githubAccessToken');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-300">
            {user.displayName || user.username}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleGitHubSignIn}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 px-4 py-2
        bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600
        text-white rounded-lg font-medium transition-all duration-200
        ${loading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${className}
      `}
    >
      {loading ? (
        <FaSpinner className="w-4 h-4 animate-spin" />
      ) : (
        <FaGithub className="w-4 h-4" />
      )}
      <span>
        {loading ? 'Connecting...' : 'Connect GitHub'}
      </span>
    </button>
  );
}