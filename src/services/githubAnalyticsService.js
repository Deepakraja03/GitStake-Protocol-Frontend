import api from './api';

/**
 * GitHub Advanced Analytics Service
 * Handles complex analytics, search, organizations, and gists
 */
export const githubAnalyticsService = {
  // Advanced Analytics
  analytics: {
    /**
     * Get code complexity analysis for a user
     * @param {string} username - GitHub username
     * @param {Object} params - Analysis parameters
     */
    getComplexityAnalysis: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { period, repositories, metrics } = params;
      const queryParams = new URLSearchParams({
        ...(period && { period }),
        ...(repositories && { repositories: repositories.join(',') }),
        ...(metrics && { metrics: metrics.join(',') })
      });
      
      try {
        const response = await api.get(`/github/analytics/${username}/complexity?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch complexity analysis: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get activity patterns and trends
     * @param {string} username - GitHub username
     * @param {Object} params - Analysis parameters
     */
    getActivityAnalysis: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { timeframe, granularity, includeWeekends } = params;
      const queryParams = new URLSearchParams({
        ...(timeframe && { timeframe }),
        ...(granularity && { granularity }),
        ...(includeWeekends !== undefined && { includeWeekends: includeWeekends.toString() })
      });
      
      try {
        const response = await api.get(`/github/analytics/${username}/activity?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch activity analysis: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get collaboration metrics
     * @param {string} username - GitHub username
     * @param {Object} params - Analysis parameters
     */
    getCollaborationMetrics: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { includeOrgs, minContributions, period } = params;
      const queryParams = new URLSearchParams({
        ...(includeOrgs !== undefined && { includeOrgs: includeOrgs.toString() }),
        ...(minContributions && { minContributions: minContributions.toString() }),
        ...(period && { period })
      });
      
      try {
        const response = await api.get(`/github/analytics/${username}/collaboration?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch collaboration metrics: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get code quality assessment
     * @param {string} username - GitHub username
     * @param {Object} params - Analysis parameters
     */
    getQualityAssessment: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { languages, includeTests, minStars } = params;
      const queryParams = new URLSearchParams({
        ...(languages && { languages: languages.join(',') }),
        ...(includeTests !== undefined && { includeTests: includeTests.toString() }),
        ...(minStars && { minStars: minStars.toString() })
      });
      
      try {
        const response = await api.get(`/github/analytics/${username}/quality?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch quality assessment: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get historical trend analysis
     * @param {string} username - GitHub username
     * @param {Object} params - Analysis parameters
     */
    getTrendAnalysis: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { startDate, endDate, metrics, smoothing } = params;
      const queryParams = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(metrics && { metrics: metrics.join(',') }),
        ...(smoothing && { smoothing })
      });
      
      try {
        const response = await api.get(`/github/analytics/${username}/trends?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch trend analysis: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Search & Discovery
  search: {
    /**
     * Search repositories with advanced filters
     * @param {Object} searchParams - Search parameters
     */
    searchRepositories: async (searchParams) => {
      const { 
        q, 
        sort, 
        order, 
        page = 1, 
        per_page = 30,
        language,
        stars,
        forks,
        size,
        pushed,
        created,
        updated
      } = searchParams;
      
      if (!q) throw new Error('Search query is required');
      
      const queryParams = new URLSearchParams({
        q,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(sort && { sort }),
        ...(order && { order }),
        ...(language && { language }),
        ...(stars && { stars }),
        ...(forks && { forks }),
        ...(size && { size }),
        ...(pushed && { pushed }),
        ...(created && { created }),
        ...(updated && { updated })
      });
      
      try {
        const response = await api.get(`/github/search/repositories?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to search repositories: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Search users with filters
     * @param {Object} searchParams - Search parameters
     */
    searchUsers: async (searchParams) => {
      const { 
        q, 
        sort, 
        order, 
        page = 1, 
        per_page = 30,
        type,
        location,
        language,
        created,
        followers,
        repos
      } = searchParams;
      
      if (!q) throw new Error('Search query is required');
      
      const queryParams = new URLSearchParams({
        q,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(sort && { sort }),
        ...(order && { order }),
        ...(type && { type }),
        ...(location && { location }),
        ...(language && { language }),
        ...(created && { created }),
        ...(followers && { followers }),
        ...(repos && { repos })
      });
      
      try {
        const response = await api.get(`/github/search/users?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to search users: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Search code across repositories
     * @param {Object} searchParams - Search parameters
     */
    searchCode: async (searchParams) => {
      const { 
        q, 
        sort, 
        order, 
        page = 1, 
        per_page = 30,
        language,
        size,
        path,
        filename,
        extension,
        user,
        repo
      } = searchParams;
      
      if (!q) throw new Error('Search query is required');
      
      const queryParams = new URLSearchParams({
        q,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(sort && { sort }),
        ...(order && { order }),
        ...(language && { language }),
        ...(size && { size }),
        ...(path && { path }),
        ...(filename && { filename }),
        ...(extension && { extension }),
        ...(user && { user }),
        ...(repo && { repo })
      });
      
      try {
        const response = await api.get(`/github/search/code?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to search code: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Organizations
  organizations: {
    /**
     * Get organization details
     * @param {string} org - Organization name
     */
    getOrganization: async (org) => {
      if (!org) throw new Error('Organization name is required');
      
      try {
        const response = await api.get(`/github/orgs/${org}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch organization: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get organization repositories
     * @param {string} org - Organization name
     * @param {Object} params - Query parameters
     */
    getOrganizationRepos: async (org, params = {}) => {
      if (!org) throw new Error('Organization name is required');
      
      const { type = 'all', sort, direction, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        type,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(sort && { sort }),
        ...(direction && { direction })
      });
      
      try {
        const response = await api.get(`/github/orgs/${org}/repos?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch organization repos: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get organization members
     * @param {string} org - Organization name
     * @param {Object} params - Query parameters
     */
    getOrganizationMembers: async (org, params = {}) => {
      if (!org) throw new Error('Organization name is required');
      
      const { filter = 'all', role, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        filter,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(role && { role })
      });
      
      try {
        const response = await api.get(`/github/orgs/${org}/members?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch organization members: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Gists
  gists: {
    /**
     * Get user gists
     * @param {string} username - GitHub username
     * @param {Object} params - Query parameters
     */
    getUserGists: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { since, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(since && { since })
      });
      
      try {
        const response = await api.get(`/github/gists/${username}?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch user gists: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get specific gist details
     * @param {string} gistId - Gist ID
     */
    getGist: async (gistId) => {
      if (!gistId) throw new Error('Gist ID is required');
      
      try {
        const response = await api.get(`/github/gists/${gistId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch gist: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // System
  system: {
    /**
     * Get GitHub API rate limit status
     */
    getRateLimit: async () => {
      try {
        const response = await api.get('/github/rate-limit');
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch rate limit: ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

export default githubAnalyticsService;