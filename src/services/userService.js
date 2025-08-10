import api from './api';

/**
 * User Analytics & Management Service
 * Handles all user-related operations including analytics, profiles, and management
 */
export const userService = {
  /**
   * Get all analyzed users with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.filter - Filter criteria
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc/desc)
   */
  getAllUsers: async (params = {}) => {
    const { page = 1, limit = 10, filter, sort, order } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filter && { filter }),
      ...(sort && { sort }),
      ...(order && { order })
    });
    
    try {
      const response = await api.get(`/users?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Get multi-metric leaderboard with developer levels
   * @param {Object} params - Query parameters
   * @param {string} params.metric - Metric to sort by (default: proficiencyScore)
   * @param {number} params.limit - Number of users to return (default: 10)
   * @param {string} params.level - Filter by developer level
   */
  getLeaderboard: async (params = {}) => {
    const { metric = 'proficiencyScore', limit = 10, level } = params;
    const queryParams = new URLSearchParams({
      metric,
      limit: limit.toString(),
      ...(level && { level })
    });
    
    try {
      const response = await api.get(`/users/leaderboard?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch leaderboard: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Get complete user profile with detailed analytics
   * @param {string} username - GitHub username
   */
  getUserProfile: async (username) => {
    if (!username) {
      throw new Error('Username is required');
    }
    
    try {
      const response = await api.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Get analytics summary with insights for a user
   * @param {string} username - GitHub username
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period for analytics
   * @param {boolean} params.includeInsights - Include AI insights
   */
  getUserAnalytics: async (username, params = {}) => {
    if (!username) {
      throw new Error('Username is required');
    }
    
    const { period, includeInsights } = params;
    const queryParams = new URLSearchParams({
      ...(period && { period }),
      ...(includeInsights !== undefined && { includeInsights: includeInsights.toString() })
    });
    
    try {
      const response = await api.get(`/users/${username}/analytics?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user analytics: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Perform comprehensive GitHub user analysis
   * @param {Object} data - Analysis parameters
   * @param {string} data.username - GitHub username
   * @param {boolean} data.forceRefresh - Force refresh of cached data
   * @param {Array} data.metrics - Specific metrics to analyze
   */
  analyzeUser: async (data) => {
    if (!data.username) {
      throw new Error('Username is required for analysis');
    }
    
    try {
      const response = await api.post('/users/analyze', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to analyze user: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Refresh user analytics with change detection
   * @param {string} username - GitHub username
   * @param {Object} options - Update options
   * @param {boolean} options.detectChanges - Enable change detection
   * @param {Array} options.updateFields - Specific fields to update
   */
  updateUserAnalytics: async (username, options = {}) => {
    if (!username) {
      throw new Error('Username is required');
    }
    
    try {
      const response = await api.put(`/users/${username}/update`, options);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user analytics: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Remove user data from the system
   * @param {string} username - GitHub username
   * @param {Object} options - Deletion options
   * @param {boolean} options.hardDelete - Permanently delete data
   * @param {string} options.reason - Reason for deletion
   */
  deleteUser: async (username, options = {}) => {
    if (!username) {
      throw new Error('Username is required');
    }
    
    try {
      const response = await api.delete(`/users/${username}`, { data: options });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  }
};

export default userService;