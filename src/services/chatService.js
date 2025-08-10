import api from './api';

/**
 * AI Chat Assistant Service
 * Handles standard AI chat operations and deep search functionality
 */
export const chatService = {
  // Standard AI Chat Assistant
  assistant: {
    /**
     * Ask GitStake AI Assistant
     * @param {Object} requestData - Chat request data
     * @param {string} requestData.message - User message
     * @param {Object} requestData.context - Additional context
     * @param {string} requestData.sessionId - Chat session ID
     * @param {Array} requestData.history - Chat history
     */
    askAssistant: async (requestData) => {
      const { message, context, sessionId, history } = requestData;
      
      if (!message) {
        throw new Error('Message is required');
      }
      
      const payload = {
        message,
        ...(context && { context }),
        ...(sessionId && { sessionId }),
        ...(history && { history })
      };
      
      try {
        const response = await api.post('/chat/ask', payload);
        // Return the full response data structure
        return response.data;
      } catch (error) {
        throw new Error(`Failed to get AI response: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get AI service health status
     */
    getHealthStatus: async () => {
      try {
        const response = await api.get('/chat/health');
        return response.data;
      } catch (error) {
        throw new Error(`Failed to get health status: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Deep Search AI (Web-Enhanced)
  deepSearch: {
    /**
     * Perform general web search with AI response
     * @param {Object} searchData - Search parameters
     * @param {string} searchData.query - Search query
     * @param {Object} searchData.filters - Search filters
     * @param {number} searchData.maxResults - Maximum results to return
     * @param {boolean} searchData.includeImages - Include image results
     * @param {string} searchData.language - Search language
     */
    generalSearch: async (searchData) => {
      const { query, filters, maxResults, includeImages, language } = searchData;
      
      if (!query) {
        throw new Error('Search query is required');
      }
      
      const payload = {
        query,
        ...(filters && { filters }),
        ...(maxResults && { maxResults }),
        ...(includeImages !== undefined && { includeImages }),
        ...(language && { language })
      };
      
      try {
        const response = await api.post('/deep-search/search', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to perform search: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Search development topics with context
     * @param {Object} searchData - Development search parameters
     * @param {string} searchData.topic - Development topic
     * @param {Array} searchData.technologies - Related technologies
     * @param {string} searchData.difficulty - Difficulty level
     * @param {boolean} searchData.includeExamples - Include code examples
     * @param {string} searchData.framework - Specific framework
     */
    developmentSearch: async (searchData) => {
      const { topic, technologies, difficulty, includeExamples, framework } = searchData;
      
      if (!topic) {
        throw new Error('Development topic is required');
      }
      
      const payload = {
        topic,
        ...(technologies && { technologies }),
        ...(difficulty && { difficulty }),
        ...(includeExamples !== undefined && { includeExamples }),
        ...(framework && { framework })
      };
      
      try {
        const response = await api.post('/deep-search/development', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to search development topics: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Search programming language information
     * @param {Object} searchData - Language search parameters
     * @param {string} searchData.language - Programming language
     * @param {Array} searchData.concepts - Specific concepts to search
     * @param {string} searchData.version - Language version
     * @param {boolean} searchData.includeBestPractices - Include best practices
     * @param {string} searchData.useCase - Specific use case
     */
    languageSearch: async (searchData) => {
      const { language, concepts, version, includeBestPractices, useCase } = searchData;
      
      if (!language) {
        throw new Error('Programming language is required');
      }
      
      const payload = {
        language,
        ...(concepts && { concepts }),
        ...(version && { version }),
        ...(includeBestPractices !== undefined && { includeBestPractices }),
        ...(useCase && { useCase })
      };
      
      try {
        const response = await api.post('/deep-search/language', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to search language information: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Search GitHub and open source topics
     * @param {Object} searchData - GitHub search parameters
     * @param {string} searchData.query - Search query
     * @param {Array} searchData.topics - GitHub topics
     * @param {string} searchData.license - License type
     * @param {number} searchData.minStars - Minimum stars
     * @param {string} searchData.language - Programming language
     * @param {boolean} searchData.activeOnly - Only active repositories
     */
    githubSearch: async (searchData) => {
      const { query, topics, license, minStars, language, activeOnly } = searchData;
      
      if (!query) {
        throw new Error('Search query is required');
      }
      
      const payload = {
        query,
        ...(topics && { topics }),
        ...(license && { license }),
        ...(minStars && { minStars }),
        ...(language && { language }),
        ...(activeOnly !== undefined && { activeOnly })
      };
      
      try {
        const response = await api.post('/deep-search/github', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to search GitHub topics: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get deep search service health status
     */
    getHealthStatus: async () => {
      try {
        const response = await api.get('/deep-search/health');
        return response.data;
      } catch (error) {
        throw new Error(`Failed to get deep search health status: ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

export default chatService;