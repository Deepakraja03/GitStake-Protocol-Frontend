import api from './api';

/**
 * Quest System Service
 * Handles all quest-related operations including generation, participation, and rewards
 */
export const questService = {
  // Quest Generation
  generation: {
    /**
     * Generate AI-powered quest for specific level
     * @param {Object} questData - Quest generation parameters
     * @param {number} questData.level - Target level (1-8)
     * @param {Array} questData.technologies - Preferred technologies
     * @param {string} questData.difficulty - Difficulty preference
     * @param {string} questData.category - Quest category
     * @param {Object} questData.constraints - Additional constraints
     */
    generateQuest: async (questData) => {
      const { level, technologies, difficulty, category, constraints } = questData;
      
      if (!level || level < 1 || level > 8) {
        throw new Error('Valid level (1-8) is required');
      }
      
      const payload = {
        level,
        ...(technologies && { technologies }),
        ...(difficulty && { difficulty }),
        ...(category && { category }),
        ...(constraints && { constraints })
      };
      
      try {
        const response = await api.post('/quests/generate', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to generate quest: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Generate weekly quests for all 8 levels
     * @param {Object} generationOptions - Generation options
     * @param {string} generationOptions.theme - Weekly theme
     * @param {Array} generationOptions.excludeCategories - Categories to exclude
     * @param {boolean} generationOptions.balanceDifficulty - Balance difficulty across levels
     */
    generateWeeklyQuests: async (generationOptions = {}) => {
      const { theme, excludeCategories, balanceDifficulty } = generationOptions;
      
      const payload = {
        ...(theme && { theme }),
        ...(excludeCategories && { excludeCategories }),
        ...(balanceDifficulty !== undefined && { balanceDifficulty })
      };
      
      try {
        const response = await api.post('/quests/generate-weekly', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to generate weekly quests: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Quest Management
  management: {
    /**
     * Get active quests with filtering
     * @param {Object} filters - Quest filters
     * @param {string} filters.developerLevel - Filter by developer level
     * @param {string} filters.status - Filter by status
     * @param {string} filters.category - Filter by category
     * @param {number} filters.page - Page number
     * @param {number} filters.limit - Items per page
     */
    getActiveQuests: async (filters = {}) => {
      const { developerLevel, status, category, page = 1, limit = 10 } = filters;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(developerLevel && { developerLevel }),
        ...(status && { status }),
        ...(category && { category })
      });
      
      try {
        const response = await api.get(`/quests/active?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch active quests: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get quest details and problem statement
     * @param {string} questId - Quest ID
     * @param {boolean} includeHints - Include hints in response
     */
    getQuestDetails: async (questId, includeHints = false) => {
      if (!questId) {
        throw new Error('Quest ID is required');
      }
      
      const queryParams = new URLSearchParams({
        ...(includeHints && { includeHints: 'true' })
      });
      
      try {
        const response = await api.get(`/quests/${questId}?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch quest details: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get quest rankings and scores
     * @param {string} questId - Quest ID
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of entries to return
     * @param {string} params.sortBy - Sort criteria
     */
    getQuestLeaderboard: async (questId, params = {}) => {
      if (!questId) {
        throw new Error('Quest ID is required');
      }
      
      const { limit = 50, sortBy = 'score' } = params;
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        sortBy
      });
      
      try {
        const response = await api.get(`/quests/${questId}/leaderboard?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch quest leaderboard: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Quest Participation
  participation: {
    /**
     * Stake user for quest participation
     * @param {string} questId - Quest ID
     * @param {Object} stakeData - Stake information
     * @param {string} stakeData.walletAddress - User's crypto wallet
     * @param {number} stakeData.stakeAmount - Amount to stake
     * @param {string} stakeData.currency - Stake currency
     * @param {string} stakeData.transactionHash - Blockchain transaction hash
     * @param {number} stakeData.blockNumber - Block number
     * @param {Object} stakeData.userInfo - User information
     * @param {string} stakeData.userInfo.username - Username
     * @param {string} stakeData.userInfo.email - User email
     * @param {string} stakeData.userInfo.developerLevel - Developer level
     */
    stakeForQuest: async (questId, stakeData) => {
      if (!questId) {
        throw new Error('Quest ID is required');
      }
      
      const { walletAddress, stakeAmount, currency, transactionHash, blockNumber, userInfo } = stakeData;
      
      if (!walletAddress || !stakeAmount) {
        throw new Error('Wallet address and stake amount are required');
      }
      
      // Validate userInfo fields as required by backend
      if (!userInfo?.username || !userInfo?.email || !userInfo?.developerLevel) {
        throw new Error('Username, email, and developer level are required');
      }
      
      const payload = {
        walletAddress,
        stakeAmount,
        currency: currency || 'AVAX',
        ...(transactionHash && { transactionHash }),
        ...(blockNumber && { blockNumber }),
        username: userInfo.username,
        email: userInfo.email,
        developerLevel: userInfo.developerLevel
      };
      
      try {
        const response = await api.post(`/quests/${questId}/stake`, payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to stake for quest: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Submit solution for evaluation
     * @param {string} questId - Quest ID
     * @param {Object} submissionData - Submission data
     * @param {string} submissionData.solution - Solution code/text
     * @param {string} submissionData.repositoryUrl - Repository URL
     * @param {string} submissionData.description - Solution description
     * @param {Array} submissionData.testResults - Test results
     */
    submitSolution: async (questId, submissionData) => {
      if (!questId) {
        throw new Error('Quest ID is required');
      }
      
      const { solution, repositoryUrl, description, testResults } = submissionData;
      
      if (!solution && !repositoryUrl) {
        throw new Error('Either solution code or repository URL is required');
      }
      
      const payload = {
        ...(solution && { solution }),
        ...(repositoryUrl && { repositoryUrl }),
        ...(description && { description }),
        ...(testResults && { testResults })
      };
      
      try {
        const response = await api.post(`/quests/${questId}/submit`, payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to submit solution: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // User Quest History
  history: {
    /**
     * Get user's quest participation history
     * @param {string} username - Username
     * @param {Object} filters - History filters
     * @param {string} filters.status - Filter by status
     * @param {string} filters.period - Time period
     * @param {number} filters.page - Page number
     * @param {number} filters.limit - Items per page
     */
    getUserHistory: async (username, filters = {}) => {
      if (!username) {
        throw new Error('Username is required');
      }
      
      const { status, period, page = 1, limit = 20 } = filters;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(period && { period })
      });
      
      try {
        const response = await api.get(`/quests/user/${username}/history?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch user history: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Wallet & Rewards
  wallet: {
    /**
     * Update user's crypto wallet address
     * @param {Object} walletData - Wallet information
     * @param {string} walletData.walletAddress - New wallet address
     * @param {string} walletData.walletType - Wallet type (e.g., 'ethereum', 'bitcoin')
     * @param {boolean} walletData.isPrimary - Set as primary wallet
     */
    updateWalletAddress: async (walletData) => {
      const { walletAddress, walletType, isPrimary } = walletData;
      
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }
      
      const payload = {
        walletAddress,
        ...(walletType && { walletType }),
        ...(isPrimary !== undefined && { isPrimary })
      };
      
      try {
        const response = await api.put('/quests/update-wallet', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to update wallet: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get crypto reward rates by level
     * @param {Object} params - Query parameters
     * @param {string} params.currency - Currency type
     * @param {boolean} params.includeHistory - Include historical rates
     */
    getCryptoRates: async (params = {}) => {
      const { currency, includeHistory } = params;
      
      const queryParams = new URLSearchParams({
        ...(currency && { currency }),
        ...(includeHistory !== undefined && { includeHistory: includeHistory.toString() })
      });
      
      try {
        const response = await api.get(`/quests/crypto-rates?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch crypto rates: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Admin Operations
  admin: {
    /**
     * Update quest statuses (admin only)
     * @param {Object} updateData - Update parameters
     * @param {Array} updateData.questIds - Quest IDs to update
     * @param {string} updateData.newStatus - New status
     * @param {string} updateData.reason - Update reason
     */
    updateQuestStatuses: async (updateData) => {
      const { questIds, newStatus, reason } = updateData;
      
      if (!questIds || !questIds.length || !newStatus) {
        throw new Error('Quest IDs and new status are required');
      }
      
      const payload = {
        questIds,
        newStatus,
        ...(reason && { reason })
      };
      
      try {
        const response = await api.put('/quests/update-statuses', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to update quest statuses: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Send quest notifications (admin only)
     * @param {Object} notificationData - Notification parameters
     * @param {Array} notificationData.userIds - Target user IDs
     * @param {string} notificationData.type - Notification type
     * @param {Object} notificationData.content - Notification content
     */
    sendNotifications: async (notificationData) => {
      const { userIds, type, content } = notificationData;
      
      if (!userIds || !userIds.length || !type) {
        throw new Error('User IDs and notification type are required');
      }
      
      const payload = {
        userIds,
        type,
        ...(content && { content })
      };
      
      try {
        const response = await api.post('/quests/send-notifications', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to send notifications: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Auto-generate weekly quests (cron job)
     * @param {Object} cronOptions - Cron job options
     * @param {boolean} cronOptions.force - Force generation even if quests exist
     * @param {string} cronOptions.schedule - Cron schedule
     */
    autoGenerateWeekly: async (cronOptions = {}) => {
      const { force, schedule } = cronOptions;
      
      const payload = {
        ...(force !== undefined && { force }),
        ...(schedule && { schedule })
      };
      
      try {
        const response = await api.post('/quests/auto-generate-weekly', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to auto-generate weekly quests: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Process quest results (admin only)
     * @param {string} questId - Quest ID
     * @param {Object} processingOptions - Processing options
     * @param {boolean} processingOptions.distributeRewards - Distribute rewards
     * @param {boolean} processingOptions.sendNotifications - Send notifications
     */
    processQuestResults: async (questId, processingOptions = {}) => {
      if (!questId) {
        throw new Error('Quest ID is required');
      }
      
      const { distributeRewards, sendNotifications } = processingOptions;
      
      const payload = {
        ...(distributeRewards !== undefined && { distributeRewards }),
        ...(sendNotifications !== undefined && { sendNotifications })
      };
      
      try {
        const response = await api.post(`/quests/${questId}/process-results`, payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to process quest results: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Process all closed quests (admin only)
     * @param {Object} batchOptions - Batch processing options
     * @param {number} batchOptions.batchSize - Number of quests to process
     * @param {boolean} batchOptions.parallel - Process in parallel
     */
    processAllClosedQuests: async (batchOptions = {}) => {
      const { batchSize, parallel } = batchOptions;
      
      const payload = {
        ...(batchSize && { batchSize }),
        ...(parallel !== undefined && { parallel })
      };
      
      try {
        const response = await api.post('/quests/process-all-closed', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to process all closed quests: ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

export default questService;