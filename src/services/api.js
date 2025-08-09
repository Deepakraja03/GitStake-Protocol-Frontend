import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Analytics API
export const userAPI = {
  getAllUsers: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getUser: (username) => api.get(`/users/${username}`),
  getUserAnalytics: (username) => api.get(`/users/${username}/analytics`),
  analyzeUser: (username) => api.post('/users/analyze', { username }),
  updateUser: (username) => api.put(`/users/${username}/update`),
  deleteUser: (username) => api.delete(`/users/${username}`),
};

// GitHub API Integration
export const githubAPI = {
  getProfile: (username) => api.get(`/github/profile/${username}`),
  getEvents: (username) => api.get(`/github/profile/${username}/events`),
  getFollowers: (username) => api.get(`/github/profile/${username}/followers`),
  getRepos: (username) => api.get(`/github/repos/${username}`),
  getRepo: (owner, repo) => api.get(`/github/repos/${owner}/${repo}`),
  getCommits: (owner, repo) => api.get(`/github/repos/${owner}/${repo}/commits`),
  getPulls: (owner, repo) => api.get(`/github/repos/${owner}/${repo}/pulls`),
  getIssues: (owner, repo) => api.get(`/github/repos/${owner}/${repo}/issues`),
  getComplexity: (username) => api.get(`/github/analytics/${username}/complexity`),
  getActivity: (username) => api.get(`/github/analytics/${username}/activity`),
  getCollaboration: (username) => api.get(`/github/analytics/${username}/collaboration`),
  getQuality: (username) => api.get(`/github/analytics/${username}/quality`),
  getTrends: (username) => api.get(`/github/analytics/${username}/trends`),
  searchRepos: (query) => api.get(`/github/search/repositories?q=${query}`),
  searchUsers: (query) => api.get(`/github/search/users?q=${query}`),
  searchCode: (query) => api.get(`/github/search/code?q=${query}`),
  getRateLimit: () => api.get('/github/rate-limit'),
};

// AI Chat Assistant
export const chatAPI = {
  askAssistant: (message, context) => api.post('/chat/ask', { message, context }),
  getHealth: () => api.get('/chat/health'),
};

// Email Notifications
export const emailAPI = {
  sendRegistration: (email, data) => api.post('/email/send-registration', { email, ...data }),
  sendLevelUp: (email, data) => api.post('/email/send-level-up', { email, ...data }),
  sendOnboarding: (email, data) => api.post('/email/send-onboarding', { email, ...data }),
  sendLeaderboard: (email, data) => api.post('/email/send-leaderboard', { email, ...data }),
  previewTemplate: (template) => api.get(`/email/preview/${template}`),
};

// Authentication
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export default api;