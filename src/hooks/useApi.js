import { useState, useEffect } from 'react';
import { userAPI, githubAPI, chatAPI, emailAPI, authAPI } from '../services';

// Generic API hook
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

// User Analytics Hooks
export const useUsers = (page = 1, limit = 10) => {
  return useApi(() => userAPI.getAllUsers(page, limit), [page, limit]);
};

export const useLeaderboard = () => {
  return useApi(() => userAPI.getLeaderboard());
};

export const useUser = (username) => {
  return useApi(() => userAPI.getUser(username), [username]);
};

export const useUserAnalytics = (username) => {
  return useApi(() => userAPI.getUserAnalytics(username), [username]);
};

// GitHub API Hooks
export const useGitHubProfile = (username) => {
  return useApi(() => githubAPI.getProfile(username), [username]);
};

export const useGitHubEvents = (username) => {
  return useApi(() => githubAPI.getEvents(username), [username]);
};

export const useGitHubRepos = (username) => {
  return useApi(() => githubAPI.getRepos(username), [username]);
};

export const useGitHubComplexity = (username) => {
  return useApi(() => githubAPI.getComplexity(username), [username]);
};

export const useGitHubActivity = (username) => {
  return useApi(() => githubAPI.getActivity(username), [username]);
};

export const useGitHubQuality = (username) => {
  return useApi(() => githubAPI.getQuality(username), [username]);
};

export const useGitHubTrends = (username) => {
  return useApi(() => githubAPI.getTrends(username), [username]);
};

// Chat Assistant Hook
export const useChatHealth = () => {
  return useApi(() => chatAPI.getHealth());
};

// Custom hooks for mutations
export const useAnalyzeUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeUser = async (username) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.analyzeUser(username);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeUser, loading, error };
};

export const useChatAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askAssistant = async (message, context = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatAPI.askAssistant(message, context);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { askAssistant, loading, error };
};

export const useAuthAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.logout();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, error };
};