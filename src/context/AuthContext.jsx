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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Wallet connection state
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  // GitHub authentication state
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();

  // Authentication states
  const [walletConnected, setWalletConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [authenticationComplete, setAuthenticationComplete] = useState(false);
  const [autoAuthInitiated, setAutoAuthInitiated] = useState(false);

  // Effect to handle wallet connection state
  useEffect(() => {
    setWalletConnected(isConnected);
  }, [isConnected]);

  // Effect to handle GitHub authentication state
  useEffect(() => {
    const githubToken = localStorage.getItem("githubAccessToken");
    setGithubConnected(!!firebaseUser && !!githubToken);
  }, [firebaseUser]);

  // Auto-authentication initialization effect
  useEffect(() => {
    if (!loading && !autoAuthInitiated) {
      setAutoAuthInitiated(true);

      // Check if user has partial authentication and should be prompted
      const hasPartialAuth = isConnected || !!firebaseUser;
      const needsCompletion = hasPartialAuth && !authenticationComplete;

      if (needsCompletion) {
        // Store a flag to show auth prompts
        localStorage.setItem('showAuthPrompts', 'true');
      }
    }
  }, [loading, autoAuthInitiated, isConnected, firebaseUser, authenticationComplete]);

  // Main authentication effect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const githubToken = localStorage.getItem("githubAccessToken");

    // Create comprehensive user object
    let mergedUser = null;

    if (firebaseUser) {
      // Firebase user is authenticated (GitHub)
      mergedUser = {
        ...firebaseUser,
        githubAccessToken: githubToken,
        walletAddress: address,
        walletConnected: isConnected,
        chainId: chain?.id,
        chainName: chain?.name,
        ...(userData ? JSON.parse(userData) : {}),
      };
    } else if (token && userData) {
      // Fallback to traditional auth
      const storedUser = JSON.parse(userData);
      mergedUser = {
        ...storedUser,
        walletAddress: address,
        walletConnected: isConnected,
        chainId: chain?.id,
        chainName: chain?.name,
      };
    } else if (isConnected) {
      // Only wallet connected, no GitHub auth
      mergedUser = {
        walletAddress: address,
        walletConnected: isConnected,
        chainId: chain?.id,
        chainName: chain?.name,
      };
    }

    setUser(mergedUser);
    setIsAuthenticated(!!mergedUser);

    // Check if both authentications are complete
    const bothConnected = isConnected && !!firebaseUser && !!githubToken;
    setAuthenticationComplete(bothConnected);

    setLoading(firebaseLoading);
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
      disconnect();
      setWalletConnected(false);

      // Update user object to remove wallet info
      if (user) {
        const updatedUser = { ...user };
        delete updatedUser.walletAddress;
        delete updatedUser.walletConnected;
        delete updatedUser.chainId;
        delete updatedUser.chainName;
        setUser(updatedUser);
      }

      setAuthenticationComplete(false);
    } catch (error) {
      console.error("Wallet disconnect error:", error);
    }
  };

  const disconnectGitHub = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('userData');
      localStorage.removeItem('githubAccessToken');

      setGithubConnected(false);

      // Update user object to remove GitHub info
      if (user) {
        const updatedUser = { ...user };
        delete updatedUser.uid;
        delete updatedUser.email;
        delete updatedUser.displayName;
        delete updatedUser.photoURL;
        delete updatedUser.username;
        delete updatedUser.githubAccessToken;
        setUser(updatedUser);
      }

      setAuthenticationComplete(false);
    } catch (error) {
      console.error("GitHub disconnect error:", error);
    }
  };

  const disconnectAll = async () => {
    await Promise.all([
      disconnectWallet(),
      disconnectGitHub(),
      logout()
    ]);
  };

  const value = {
    // User data and states
    user,
    loading,
    isAuthenticated,

    // Authentication states
    walletConnected,
    githubConnected,
    authenticationComplete,

    // Wallet info
    walletAddress: address,
    chainId: chain?.id,
    chainName: chain?.name,

    // Authentication methods
    login,
    register,
    logout,
    disconnectWallet,
    disconnectGitHub,
    disconnectAll,

    // GitHub methods
    analyzeGitHubUser,
    getUserAnalytics,

    // Utility methods
    setUser,
    setIsAuthenticated,

    // Helper methods for route protection
    requiresWallet: () => walletConnected,
    requiresGitHub: () => githubConnected,
    requiresBoth: () => authenticationComplete,

    // Authentication status helpers
    getAuthStatus: () => ({
      wallet: walletConnected,
      github: githubConnected,
      complete: authenticationComplete,
      user: !!user
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
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
