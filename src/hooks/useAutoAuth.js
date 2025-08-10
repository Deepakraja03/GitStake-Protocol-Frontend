import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * Hook to manage automatic authentication flow
 * - Redirects to auth flow if user needs authentication
 * - Handles auto-initiation of GitHub auth
 * - Manages authentication state persistence
 */
export const useAutoAuth = (options = {}) => {
  const {
    requireWallet = false,
    requireGitHub = false,
    requireBoth = false,
    autoRedirect = true,
    redirectTo = '/auth-flow',
    skipRoutes = ['/auth', '/auth-flow', '/github-test', '/'],
    showPrompt = true
  } = options;

  const {
    walletConnected,
    githubConnected,
    authenticationComplete,
    loading,
    user,
    getMissingAuth
  } = useAuthContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [authPrompted, setAuthPrompted] = useState(false);

  // Determine what authentication is needed
  const needsWallet = requireWallet || requireBoth;
  const needsGitHub = requireGitHub || requireBoth;
  const hasRequiredWallet = !needsWallet || walletConnected;
  const hasRequiredGitHub = !needsGitHub || githubConnected;
  const isFullyAuthenticated = hasRequiredWallet && hasRequiredGitHub;

  // Check if current route should be skipped
  const shouldSkipRoute = skipRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  // Auto-redirect effect
  useEffect(() => {
    if (loading || hasRedirected || shouldSkipRoute) return;

    if (autoRedirect && !isFullyAuthenticated) {
      setHasRedirected(true);
      navigate(redirectTo, { 
        state: { 
          from: location.pathname,
          requireWallet: needsWallet,
          requireGitHub: needsGitHub,
          requireBoth
        }
      });
    }
  }, [
    loading,
    isFullyAuthenticated,
    autoRedirect,
    hasRedirected,
    shouldSkipRoute,
    navigate,
    redirectTo,
    location.pathname,
    needsWallet,
    needsGitHub,
    requireBoth
  ]);

  // Auto-prompt for GitHub authentication
  useEffect(() => {
    if (loading || authPrompted || shouldSkipRoute) return;

    // If wallet is connected but GitHub is not, and we need GitHub
    if (walletConnected && !githubConnected && (needsGitHub || requireBoth) && showPrompt) {
      setAuthPrompted(true);
      
      // Show a toast or notification about GitHub auth
      if (window.confirm('Connect your GitHub account to access all features?')) {
        navigate('/auth-flow');
      }
    }
  }, [
    loading,
    walletConnected,
    githubConnected,
    needsGitHub,
    requireBoth,
    showPrompt,
    authPrompted,
    shouldSkipRoute,
    navigate
  ]);

  // Persist authentication state
  useEffect(() => {
    if (user && authenticationComplete) {
      localStorage.setItem('lastAuthCheck', Date.now().toString());
      localStorage.setItem('authComplete', 'true');
    }
  }, [user, authenticationComplete]);

  // Check for stale authentication
  useEffect(() => {
    const lastAuthCheck = localStorage.getItem('lastAuthCheck');
    const authComplete = localStorage.getItem('authComplete');
    
    if (lastAuthCheck && authComplete) {
      const timeSinceLastCheck = Date.now() - parseInt(lastAuthCheck);
      const oneHour = 60 * 60 * 1000;
      
      // If it's been more than an hour, re-check authentication
      if (timeSinceLastCheck > oneHour) {
        localStorage.removeItem('authComplete');
        if (!loading && !authenticationComplete && autoRedirect && !shouldSkipRoute) {
          navigate(redirectTo);
        }
      }
    }
  }, [loading, authenticationComplete, autoRedirect, shouldSkipRoute, navigate, redirectTo]);

  return {
    // Authentication states
    isAuthenticated: isFullyAuthenticated,
    walletConnected,
    githubConnected,
    authenticationComplete,
    loading,
    
    // Requirements check
    needsWallet,
    needsGitHub,
    hasRequiredWallet,
    hasRequiredGitHub,
    
    // Missing authentication
    missingAuth: getMissingAuth(),
    
    // User data
    user,
    
    // Control flags
    hasRedirected,
    authPrompted,
    shouldSkipRoute,
    
    // Helper methods
    checkAuth: () => isFullyAuthenticated,
    getAuthStatus: () => ({
      wallet: walletConnected,
      github: githubConnected,
      complete: authenticationComplete,
      required: {
        wallet: needsWallet,
        github: needsGitHub,
        both: requireBoth
      }
    }),
    
    // Manual redirect
    redirectToAuth: () => {
      navigate(redirectTo, {
        state: {
          from: location.pathname,
          requireWallet: needsWallet,
          requireGitHub: needsGitHub,
          requireBoth
        }
      });
    }
  };
};

/**
 * Hook for pages that require full authentication (wallet + GitHub)
 */
export const useFullAuth = (options = {}) => {
  return useAutoAuth({
    requireBoth: true,
    ...options
  });
};

/**
 * Hook for pages that require only wallet connection
 */
export const useWalletAuth = (options = {}) => {
  return useAutoAuth({
    requireWallet: true,
    ...options
  });
};

/**
 * Hook for pages that require only GitHub authentication
 */
export const useGitHubAuth = (options = {}) => {
  return useAutoAuth({
    requireGitHub: true,
    ...options
  });
};

export default useAutoAuth;
