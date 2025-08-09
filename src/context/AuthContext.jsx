import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

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
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();

  useEffect(() => {
    // Check for existing auth data
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const githubToken = localStorage.getItem("githubAccessToken");

    if (firebaseUser) {
      // Firebase user is authenticated
      const mergedUser = {
        ...firebaseUser,
        githubAccessToken: githubToken,
        ...(userData ? JSON.parse(userData) : {}),
      };
      setUser(mergedUser);
      setIsAuthenticated(true);
    } else if (token && userData) {
      // Fallback to traditional auth
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(firebaseLoading);
  }, [firebaseUser, firebaseLoading]);

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
      await authService.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    analyzeGitHubUser,
    getUserAnalytics,
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
