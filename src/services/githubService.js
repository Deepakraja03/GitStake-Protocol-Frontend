import api from './api';

/**
 * GitHub API Integration Service
 * Complete Octokit coverage for GitHub API operations
 */
export const githubService = {
  // User Analytics (Main Dashboard Data)
  getUserAnalytics: async (username) => {
    if (!username) throw new Error('Username is required');

    try {
      const response = await api.get(`/users/${username}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw new Error(`Failed to fetch analytics: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get user repositories
  getUserRepositories: async (username, params = {}) => {
    if (!username) throw new Error('Username is required');

    try {
      const queryParams = new URLSearchParams({
        type: 'owner',
        sort: 'updated',
        per_page: 30,
        page: 1,
        ...params
      }).toString();
      const response = await api.get(`/github/repos/${username}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      throw new Error(`Failed to fetch repositories: ${error.response?.data?.message || error.message}`);
    }
  },

  // Profile & Social Operations
  profile: {
    /**
     * Get complete GitHub profile
     * @param {string} username - GitHub username
     */
    getProfile: async (username) => {
      if (!username) throw new Error('Username is required');

      try {
        const response = await api.get(`/github/profile/${username}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get user activity events
     * @param {string} username - GitHub username
     * @param {Object} params - Query parameters
     */
    getEvents: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');

      const { page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({ page: page.toString(), per_page: per_page.toString() });

      try {
        const response = await api.get(`/github/profile/${username}/events?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch events: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get followers list
     * @param {string} username - GitHub username
     * @param {Object} params - Pagination parameters
     */
    getFollowers: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');

      const { page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({ page: page.toString(), per_page: per_page.toString() });

      try {
        const response = await api.get(`/github/profile/${username}/followers?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch followers: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get following list
     * @param {string} username - GitHub username
     * @param {Object} params - Pagination parameters
     */
    getFollowing: async (username, params = {}) => {
      if (!username) throw new Error('Username is required');

      const { page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({ page: page.toString(), per_page: per_page.toString() });

      try {
        const response = await api.get(`/github/profile/${username}/following?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch following: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Repository Management
  repositories: {
    /**
     * Get user repositories with filters
     * @param {string} username - GitHub username
     * @param {Object} filters - Repository filters
     */
    getUserRepos: async (username, filters = {}) => {
      if (!username) throw new Error('Username is required');
      
      const { type, sort, direction, page = 1, per_page = 30 } = filters;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(type && { type }),
        ...(sort && { sort }),
        ...(direction && { direction })
      });
      
      try {
        const response = await api.get(`/github/repos/${username}?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch repositories: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get detailed repository information
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     */
    getRepository: async (owner, repo) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch repository: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get repository commits with stats
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     */
    getCommits: async (owner, repo, params = {}) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      const { sha, path, author, since, until, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(sha && { sha }),
        ...(path && { path }),
        ...(author && { author }),
        ...(since && { since }),
        ...(until && { until })
      });
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/commits?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch commits: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get repository contributors
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     */
    getContributors: async (owner, repo, params = {}) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      const { anon, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(anon && { anon: anon.toString() })
      });
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/contributors?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch contributors: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get programming languages used in repository
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     */
    getLanguages: async (owner, repo) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/languages`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch languages: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get repository statistics
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     */
    getStats: async (owner, repo) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/stats`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch stats: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Pull Requests & Issues
  pullRequests: {
    /**
     * Get pull requests with details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     */
    getPullRequests: async (owner, repo, params = {}) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      const { state = 'open', head, base, sort, direction, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        state,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(head && { head }),
        ...(base && { base }),
        ...(sort && { sort }),
        ...(direction && { direction })
      });
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/pulls?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch pull requests: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get specific pull request details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} pullNumber - Pull request number
     */
    getPullRequest: async (owner, repo, pullNumber) => {
      if (!owner || !repo || !pullNumber) throw new Error('Owner, repo, and pull number are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/pulls/${pullNumber}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch pull request: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get pull request commits
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} pullNumber - Pull request number
     */
    getPullRequestCommits: async (owner, repo, pullNumber) => {
      if (!owner || !repo || !pullNumber) throw new Error('Owner, repo, and pull number are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/pulls/${pullNumber}/commits`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch PR commits: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get pull request file changes
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} pullNumber - Pull request number
     */
    getPullRequestFiles: async (owner, repo, pullNumber) => {
      if (!owner || !repo || !pullNumber) throw new Error('Owner, repo, and pull number are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/pulls/${pullNumber}/files`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch PR files: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  issues: {
    /**
     * Get repository issues
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     */
    getIssues: async (owner, repo, params = {}) => {
      if (!owner || !repo) throw new Error('Owner and repo are required');
      
      const { milestone, state = 'open', assignee, creator, mentioned, labels, sort, direction, since, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        state,
        page: page.toString(),
        per_page: per_page.toString(),
        ...(milestone && { milestone }),
        ...(assignee && { assignee }),
        ...(creator && { creator }),
        ...(mentioned && { mentioned }),
        ...(labels && { labels }),
        ...(sort && { sort }),
        ...(direction && { direction }),
        ...(since && { since })
      });
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/issues?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch issues: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get specific issue details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} issueNumber - Issue number
     */
    getIssue: async (owner, repo, issueNumber) => {
      if (!owner || !repo || !issueNumber) throw new Error('Owner, repo, and issue number are required');
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/issues/${issueNumber}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch issue: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get issue comments
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} issueNumber - Issue number
     * @param {Object} params - Query parameters
     */
    getIssueComments: async (owner, repo, issueNumber, params = {}) => {
      if (!owner || !repo || !issueNumber) throw new Error('Owner, repo, and issue number are required');
      
      const { since, page = 1, per_page = 30 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(since && { since })
      });
      
      try {
        const response = await api.get(`/github/repos/${owner}/${repo}/issues/${issueNumber}/comments?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch issue comments: ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

export default githubService;