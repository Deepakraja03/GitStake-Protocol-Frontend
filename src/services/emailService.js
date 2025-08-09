import api from './api';

/**
 * Email Notification System Service
 * Handles all email operations including sending and previewing templates
 */
export const emailService = {
  // Send Email Operations
  send: {
    /**
     * Send welcome registration email
     * @param {Object} emailData - Email data
     * @param {string} emailData.email - Recipient email
     * @param {string} emailData.username - User's username
     * @param {string} emailData.firstName - User's first name
     * @param {Object} emailData.additionalData - Additional template data
     */
    sendRegistrationEmail: async (emailData) => {
      const { email, username, firstName, additionalData } = emailData;
      
      if (!email) {
        throw new Error('Email address is required');
      }
      
      if (!username) {
        throw new Error('Username is required');
      }
      
      const payload = {
        email,
        username,
        ...(firstName && { firstName }),
        ...(additionalData && { ...additionalData })
      };
      
      try {
        const response = await api.post('/email/send-registration', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to send registration email: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Send level up achievement notification
     * @param {Object} emailData - Email data
     * @param {string} emailData.email - Recipient email
     * @param {string} emailData.username - User's username
     * @param {number} emailData.newLevel - New level achieved
     * @param {number} emailData.previousLevel - Previous level
     * @param {Object} emailData.achievements - Achievement details
     * @param {Array} emailData.rewards - Rewards earned
     */
    sendLevelUpEmail: async (emailData) => {
      const { email, username, newLevel, previousLevel, achievements, rewards } = emailData;
      
      if (!email || !username || newLevel === undefined) {
        throw new Error('Email, username, and new level are required');
      }
      
      const payload = {
        email,
        username,
        newLevel,
        ...(previousLevel !== undefined && { previousLevel }),
        ...(achievements && { achievements }),
        ...(rewards && { rewards })
      };
      
      try {
        const response = await api.post('/email/send-level-up', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to send level up email: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Send profile analysis completion email
     * @param {Object} emailData - Email data
     * @param {string} emailData.email - Recipient email
     * @param {string} emailData.username - User's username
     * @param {Object} emailData.analysisResults - Analysis results summary
     * @param {Array} emailData.insights - Key insights
     * @param {Object} emailData.recommendations - Recommendations
     */
    sendOnboardingEmail: async (emailData) => {
      const { email, username, analysisResults, insights, recommendations } = emailData;
      
      if (!email || !username) {
        throw new Error('Email and username are required');
      }
      
      const payload = {
        email,
        username,
        ...(analysisResults && { analysisResults }),
        ...(insights && { insights }),
        ...(recommendations && { recommendations })
      };
      
      try {
        const response = await api.post('/email/send-onboarding', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to send onboarding email: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Send leaderboard achievement notification
     * @param {Object} emailData - Email data
     * @param {string} emailData.email - Recipient email
     * @param {string} emailData.username - User's username
     * @param {number} emailData.rank - Current rank
     * @param {number} emailData.previousRank - Previous rank
     * @param {string} emailData.category - Leaderboard category
     * @param {Object} emailData.stats - User statistics
     */
    sendLeaderboardEmail: async (emailData) => {
      const { email, username, rank, previousRank, category, stats } = emailData;
      
      if (!email || !username || rank === undefined) {
        throw new Error('Email, username, and rank are required');
      }
      
      const payload = {
        email,
        username,
        rank,
        ...(previousRank !== undefined && { previousRank }),
        ...(category && { category }),
        ...(stats && { stats })
      };
      
      try {
        const response = await api.post('/email/send-leaderboard', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to send leaderboard email: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Preview Email Templates
  preview: {
    /**
     * Preview registration email template
     * @param {Object} previewData - Preview data
     * @param {string} previewData.username - Sample username
     * @param {string} previewData.firstName - Sample first name
     * @param {Object} previewData.customData - Custom template data
     */
    previewRegistrationEmail: async (previewData = {}) => {
      const { username = 'sampleuser', firstName = 'John', customData } = previewData;
      
      const queryParams = new URLSearchParams({
        username,
        firstName,
        ...(customData && { customData: JSON.stringify(customData) })
      });
      
      try {
        const response = await api.get(`/email/preview/registration?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to preview registration email: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Preview level up email template
     * @param {Object} previewData - Preview data
     * @param {string} previewData.username - Sample username
     * @param {number} previewData.newLevel - Sample new level
     * @param {number} previewData.previousLevel - Sample previous level
     */
    previewLevelUpEmail: async (previewData = {}) => {
      const { username = 'sampleuser', newLevel = 5, previousLevel = 4 } = previewData;
      
      const queryParams = new URLSearchParams({
        username,
        newLevel: newLevel.toString(),
        previousLevel: previousLevel.toString()
      });
      
      try {
        const response = await api.get(`/email/preview/level-up?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to preview level up email: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Preview onboarding email template
     * @param {Object} previewData - Preview data
     * @param {string} previewData.username - Sample username
     * @param {Object} previewData.sampleAnalysis - Sample analysis data
     */
    previewOnboardingEmail: async (previewData = {}) => {
      const { username = 'sampleuser', sampleAnalysis } = previewData;
      
      const queryParams = new URLSearchParams({
        username,
        ...(sampleAnalysis && { sampleAnalysis: JSON.stringify(sampleAnalysis) })
      });
      
      try {
        const response = await api.get(`/email/preview/onboarding?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to preview onboarding email: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Preview leaderboard email template
     * @param {Object} previewData - Preview data
     * @param {string} previewData.username - Sample username
     * @param {number} previewData.rank - Sample rank
     * @param {string} previewData.category - Sample category
     */
    previewLeaderboardEmail: async (previewData = {}) => {
      const { username = 'sampleuser', rank = 10, category = 'overall' } = previewData;
      
      const queryParams = new URLSearchParams({
        username,
        rank: rank.toString(),
        category
      });
      
      try {
        const response = await api.get(`/email/preview/leaderboard?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to preview leaderboard email: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Utility Functions
  utils: {
    /**
     * Validate email address format
     * @param {string} email - Email to validate
     */
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Format email data for template
     * @param {Object} rawData - Raw email data
     * @param {string} templateType - Template type
     */
    formatEmailData: (rawData, templateType) => {
      const baseData = {
        timestamp: new Date().toISOString(),
        templateType
      };
      
      switch (templateType) {
        case 'registration':
          return {
            ...baseData,
            email: rawData.email,
            username: rawData.username,
            firstName: rawData.firstName || rawData.username,
            welcomeMessage: `Welcome to GitStake, ${rawData.firstName || rawData.username}!`
          };
          
        case 'level-up':
          return {
            ...baseData,
            email: rawData.email,
            username: rawData.username,
            newLevel: rawData.newLevel,
            previousLevel: rawData.previousLevel,
            levelUpMessage: `Congratulations! You've reached Level ${rawData.newLevel}!`
          };
          
        case 'onboarding':
          return {
            ...baseData,
            email: rawData.email,
            username: rawData.username,
            analysisComplete: true,
            nextSteps: rawData.recommendations || []
          };
          
        case 'leaderboard':
          return {
            ...baseData,
            email: rawData.email,
            username: rawData.username,
            rank: rawData.rank,
            category: rawData.category,
            achievement: `You're ranked #${rawData.rank} in ${rawData.category}!`
          };
          
        default:
          return { ...baseData, ...rawData };
      }
    }
  }
};

export default emailService;