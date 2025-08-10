import api from './api';

/**
 * Leaderboard Service
 * Handles all leaderboard-related API calls
 */
export const leaderboardService = {
  /**
   * Get leaderboard data with multi-metric support
   * @param {Object} params - Query parameters
   * @param {string} params.metric - Ranking metric (proficiencyScore, totalCommits, repoCount, totalPRs, streak.longest, innovationScore, collaborationScore)
   * @param {number} params.limit - Number of results to return (default: 10)
   * @param {number} params.page - Page number for pagination (default: 1)
   * @returns {Promise<Object>} Leaderboard data with rankings
   */
  getLeaderboard: async (params = {}) => {
    try {
      const {
        metric = 'proficiencyScore',
        limit = 10,
        page = 1
      } = params;

      const queryParams = new URLSearchParams({
        metric,
        limit: limit.toString(),
        page: page.toString()
      }).toString();

      const response = await api.get(`/api/users/leaderboard?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error(`Failed to fetch leaderboard: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Get user's rank in a specific metric
   * @param {string} username - GitHub username
   * @param {string} metric - Ranking metric
   * @returns {Promise<Object>} User's rank and position
   */
  getUserRank: async (username, metric = 'proficiencyScore') => {
    try {
      const response = await api.get(`/users/${username}/rank?metric=${metric}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw new Error(`Failed to fetch user rank: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Get leaderboard for multiple metrics at once
   * @param {Array<string>} metrics - Array of metrics to fetch
   * @param {number} limit - Number of results per metric
   * @returns {Promise<Object>} Multi-metric leaderboard data
   */
  getMultiMetricLeaderboard: async (metrics = ['proficiencyScore', 'totalCommits', 'repoCount'], limit = 10) => {
    try {
      const promises = metrics.map(metric =>
        leaderboardService.getLeaderboard({ metric, limit })
      );

      const results = await Promise.all(promises);

      // Combine results into a structured object
      const combinedData = {};
      metrics.forEach((metric, index) => {
        combinedData[metric] = results[index];
      });

      return {
        success: true,
        data: combinedData,
        message: 'Multi-metric leaderboard retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching multi-metric leaderboard:', error);
      throw new Error(`Failed to fetch multi-metric leaderboard: ${error.message}`);
    }
  },

  /**
   * Get leaderboard statistics and metadata
   * @returns {Promise<Object>} Leaderboard statistics
   */
  getLeaderboardStats: async () => {
    try {
      const response = await api.get('/users/leaderboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard stats:', error);
      throw new Error(`Failed to fetch leaderboard stats: ${error.response?.data?.message || error.message}`);
    }
  }
};

export default leaderboardService;