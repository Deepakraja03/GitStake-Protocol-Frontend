import React, { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useDisconnect } from 'wagmi';
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { signOutUser } from "../../firebase.config";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Core state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Wallet connection state from wagmi
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  // GitHub authentication state from Firebase
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();

  // Derived authentication states (computed from core states)
  const [walletConnected, setWalletConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [authenticationComplete, setAuthenticationComplete] = useState(false);

  // Internal state management
  const [stateInitialized, setStateInitialized] = useState(false);

  // Centralized authentication state management effect
  useEffect(() => {
    console.log('🔄 Auth State Update:', {
      isConnected,
      address: address?.slice(0, 6) + '...',
      firebaseUser: !!firebaseUser,
      firebaseLoading,
      chain: chain?.name,
      timestamp: new Date().toISOString()
    });

    // Don't update state while Firebase is still loading
    if (firebaseLoading) {
      console.log('⏳ Firebase still loading, skipping state update');
      setLoading(true);
      return;
    }

    // Get stored authentication data
    const storedToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");
    const storedGithubToken = localStorage.getItem("githubAccessToken");

    // Determine wallet connection state
    const currentWalletConnected = !!isConnected && !!address;

    // Determine GitHub connection state
    const currentGithubConnected = !!firebaseUser && !!storedGithubToken;

    // Determine if authentication is complete
    const currentAuthComplete = currentWalletConnected && currentGithubConnected;

    // Update authentication states
    setWalletConnected(currentWalletConnected);
    setGithubConnected(currentGithubConnected);
    setAuthenticationComplete(currentAuthComplete);

    // Create comprehensive user object
    let mergedUser = null;

    if (firebaseUser && storedGithubToken) {
      // GitHub authenticated user
      mergedUser = {
        ...firebaseUser,
        githubAccessToken: storedGithubToken,
        walletAddress: address,
        walletConnected: currentWalletConnected,
        chainId: chain?.id,
        chainName: chain?.name,
        authType: 'github',
        ...(storedUserData ? JSON.parse(storedUserData) : {}),
      };
    } else if (storedToken && storedUserData) {
      // Traditional auth user
      const storedUser = JSON.parse(storedUserData);
      mergedUser = {
        ...storedUser,
        walletAddress: address,
        walletConnected: currentWalletConnected,
        chainId: chain?.id,
        chainName: chain?.name,
        authType: 'traditional',
      };
    } else if (currentWalletConnected) {
      // Wallet-only user
      mergedUser = {
        walletAddress: address,
        walletConnected: currentWalletConnected,
        chainId: chain?.id,
        chainName: chain?.name,
        authType: 'wallet-only',
      };
    }

    // Update user state
    setUser(mergedUser);
    setIsAuthenticated(!!mergedUser);

    // Handle authentication prompts
    const hasPartialAuth = currentWalletConnected || currentGithubConnected;
    const needsCompletion = hasPartialAuth && !currentAuthComplete;

    if (needsCompletion) {
      localStorage.setItem('showAuthPrompts', 'true');
    } else if (currentAuthComplete) {
      localStorage.removeItem('showAuthPrompts');
    }

    // Mark as initialized and not loading
    setStateInitialized(true);
    setLoading(false);

    console.log('✅ Auth State Updated:', {
      walletConnected: currentWalletConnected,
      githubConnected: currentGithubConnected,
      authComplete: currentAuthComplete,
      userType: mergedUser?.authType || 'none',
      timestamp: new Date().toISOString()
    });

    // Validate state consistency
    const expectedWallet = !!isConnected && !!address;
    const expectedGithub = !!firebaseUser && !!storedGithubToken;
    const expectedComplete = expectedWallet && expectedGithub;

    if (currentWalletConnected !== expectedWallet ||
        currentGithubConnected !== expectedGithub ||
        currentAuthComplete !== expectedComplete) {
      console.warn('⚠️ State inconsistency detected:', {
        wallet: { current: currentWalletConnected, expected: expectedWallet },
        github: { current: currentGithubConnected, expected: expectedGithub },
        complete: { current: currentAuthComplete, expected: expectedComplete }
      });
    }

  }, [firebaseUser, firebaseLoading, address, isConnected, chain]);

  const login = async (credentials) => {
    try {
      const response = await authService.auth.login(credentials);

      setUser(response.user);
      setIsAuthenticated(true);

      return { success: true, user: response.user };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.auth.register(userData);

      setUser(response.user);
      setIsAuthenticated(true);

      return { success: true, user: response.user };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const analyzeGitHubUser = async (username) => {
    try {
      setLoading(true);
      const response = await userService.analyzeUser({ username });

      // Update user data with analysis results
      if (user && user.githubUsername === username) {
        const updatedUser = { ...user, ...response };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      }

      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message || "Analysis failed" };
    } finally {
      setLoading(false);
    }
  };

  const getUserAnalytics = async (username) => {
    try {
      const response = await userService.getUserAnalytics(username);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch analytics",
      };
    }
  };

  const logout = async () => {
    try {
      // Logout from traditional auth
      await authService.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setWalletConnected(false);
      setGithubConnected(false);
      setAuthenticationComplete(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      console.log('🔌 Disconnecting wallet...');
      disconnect();

      // The main useEffect will handle state updates automatically
      // when isConnected becomes false

    } catch (error) {
      console.error("Wallet disconnect error:", error);
    }
  };

  const disconnectGitHub = async () => {
    try {
      console.log('🔌 Disconnecting GitHub...');

      // Sign out from Firebase
      await signOutUser();

      // Clear stored data
      localStorage.removeItem('userData');
      localStorage.removeItem('githubAccessToken');

      // The main useEffect will handle state updates automatically
      // when firebaseUser becomes null

    } catch (error) {
      console.error("GitHub disconnect error:", error);
    }
  };

  const disconnectAll = async () => {
    try {
      console.log('🔌 Disconnecting all authentication...');

      // Clear all stored data first
      localStorage.removeItem('userData');
      localStorage.removeItem('githubAccessToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('showAuthPrompts');
      localStorage.removeItem('lastAuthCheck');
      localStorage.removeItem('authComplete');

      // Reset all states immediately
      setUser(null);
      setIsAuthenticated(false);
      setWalletConnected(false);
      setGithubConnected(false);
      setAuthenticationComplete(false);
      setLoading(false);

      // Disconnect wallet and GitHub (these will trigger the useEffect to update states)
      await Promise.all([
        signOutUser().catch(console.error),
        disconnect()
      ]);

      console.log('✅ All authentication disconnected');

    } catch (error) {
      console.error("Disconnect all error:", error);
    }
  };

  // Force refresh authentication state
  const refreshAuthState = () => {
    console.log('🔄 Force refreshing auth state...');

    // Get current values
    const currentWalletConnected = !!isConnected && !!address;
    const currentGithubConnected = !!firebaseUser && !!localStorage.getItem("githubAccessToken");
    const currentAuthComplete = currentWalletConnected && currentGithubConnected;

    // Force update states
    setWalletConnected(currentWalletConnected);
    setGithubConnected(currentGithubConnected);
    setAuthenticationComplete(currentAuthComplete);

    console.log('✅ Auth state refreshed:', {
      wallet: currentWalletConnected,
      github: currentGithubConnected,
      complete: currentAuthComplete
    });
  };

  const value = {
    // Core user data and states
    user,
    loading,
    isAuthenticated,

    // Authentication states (always current and synchronized)
    walletConnected,
    githubConnected,
    authenticationComplete,

    // Wallet info (directly from wagmi)
    walletAddress: address,
    chainId: chain?.id,
    chainName: chain?.name,
    isWalletConnected: isConnected, // Direct wagmi state

    // Firebase info
    firebaseUser,
    firebaseLoading,

    // Authentication methods
    login,
    register,
    logout,
    disconnectWallet,
    disconnectGitHub,
    disconnectAll,
    refreshAuthState,

    // GitHub methods
    analyzeGitHubUser,
    getUserAnalytics,

    // Utility methods (use with caution - prefer letting useEffect handle state)
    setUser,
    setIsAuthenticated,

    // Helper methods for route protection
    requiresWallet: () => walletConnected,
    requiresGitHub: () => githubConnected,
    requiresBoth: () => authenticationComplete,

    // Authentication status helpers (always current)
    getAuthStatus: () => ({
      wallet: walletConnected,
      github: githubConnected,
      complete: authenticationComplete,
      user: !!user,
      loading,
      initialized: stateInitialized
    }),

    // Check what's missing for complete auth
    getMissingAuth: () => {
      const missing = [];
      if (!walletConnected) missing.push('wallet');
      if (!githubConnected) missing.push('github');
      return missing;
    },

    // Auto-authentication helpers
    shouldShowAuthPrompts: () => {
      return localStorage.getItem('showAuthPrompts') === 'true';
    },

    clearAuthPrompts: () => {
      localStorage.removeItem('showAuthPrompts');
    },

    // Initialize authentication flow
    initializeAuth: () => {
      if (!authenticationComplete) {
        localStorage.setItem('showAuthPrompts', 'true');
        return true;
      }
      return false;
    },

    // Debug helpers
    getDebugInfo: () => ({
      walletConnected,
      githubConnected,
      authenticationComplete,
      isConnected,
      firebaseUser: !!firebaseUser,
      firebaseLoading,
      address,
      chain: chain?.name,
      userType: user?.authType,
      localStorage: {
        userData: !!localStorage.getItem('userData'),
        githubToken: !!localStorage.getItem('githubAccessToken'),
        authToken: !!localStorage.getItem('authToken'),
        showPrompts: localStorage.getItem('showAuthPrompts')
      }
    })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
