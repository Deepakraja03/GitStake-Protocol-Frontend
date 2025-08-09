import api from './api';

/**
 * Cron Job Management Service
 * Handles all cron job operations including status monitoring and control
 */
export const cronService = {
  // Status Operations
  status: {
    /**
     * Get comprehensive cron jobs status
     * @param {Object} options - Status options
     * @param {boolean} options.includeHistory - Include execution history
     * @param {boolean} options.includeNextRun - Include next run times
     * @param {Array} options.jobNames - Specific job names to check
     */
    getCronStatus: async (options = {}) => {
      const { includeHistory, includeNextRun, jobNames } = options;
      
      const queryParams = new URLSearchParams({
        ...(includeHistory !== undefined && { includeHistory: includeHistory.toString() }),
        ...(includeNextRun !== undefined && { includeNextRun: includeNextRun.toString() }),
        ...(jobNames && { jobNames: jobNames.join(',') })
      });
      
      try {
        const response = await api.get(`/cron/status?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch cron status: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get detailed status for a specific cron job
     * @param {string} jobName - Cron job name
     * @param {Object} options - Status options
     * @param {number} options.historyLimit - Limit execution history entries
     * @param {boolean} options.includeErrors - Include error details
     */
    getJobStatus: async (jobName, options = {}) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      const { historyLimit, includeErrors } = options;
      
      const queryParams = new URLSearchParams({
        ...(historyLimit && { historyLimit: historyLimit.toString() }),
        ...(includeErrors !== undefined && { includeErrors: includeErrors.toString() })
      });
      
      try {
        const response = await api.get(`/cron/status/${jobName}?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch job status: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Control Operations
  control: {
    /**
     * Start all cron jobs
     * @param {Object} options - Start options
     * @param {boolean} options.force - Force start even if already running
     * @param {Array} options.excludeJobs - Jobs to exclude from starting
     */
    startAllJobs: async (options = {}) => {
      const { force, excludeJobs } = options;
      
      const payload = {
        ...(force !== undefined && { force }),
        ...(excludeJobs && { excludeJobs })
      };
      
      try {
        const response = await api.post('/cron/start-all', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to start all cron jobs: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Stop all cron jobs
     * @param {Object} options - Stop options
     * @param {boolean} options.graceful - Graceful shutdown
     * @param {number} options.timeout - Timeout in seconds
     * @param {Array} options.excludeJobs - Jobs to exclude from stopping
     */
    stopAllJobs: async (options = {}) => {
      const { graceful, timeout, excludeJobs } = options;
      
      const payload = {
        ...(graceful !== undefined && { graceful }),
        ...(timeout && { timeout }),
        ...(excludeJobs && { excludeJobs })
      };
      
      try {
        const response = await api.post('/cron/stop-all', payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to stop all cron jobs: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Start specific cron job
     * @param {string} jobName - Cron job name
     * @param {Object} options - Start options
     * @param {boolean} options.force - Force start even if already running
     * @param {Object} options.config - Override job configuration
     */
    startJob: async (jobName, options = {}) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      const { force, config } = options;
      
      const payload = {
        ...(force !== undefined && { force }),
        ...(config && { config })
      };
      
      try {
        const response = await api.post(`/cron/start/${jobName}`, payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to start cron job: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Stop specific cron job
     * @param {string} jobName - Cron job name
     * @param {Object} options - Stop options
     * @param {boolean} options.graceful - Graceful shutdown
     * @param {number} options.timeout - Timeout in seconds
     */
    stopJob: async (jobName, options = {}) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      const { graceful, timeout } = options;
      
      const payload = {
        ...(graceful !== undefined && { graceful }),
        ...(timeout && { timeout })
      };
      
      try {
        const response = await api.post(`/cron/stop/${jobName}`, payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to stop cron job: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Manually trigger cron job execution
     * @param {string} jobName - Cron job name
     * @param {Object} options - Trigger options
     * @param {boolean} options.async - Run asynchronously
     * @param {Object} options.parameters - Job parameters
     * @param {boolean} options.skipScheduleCheck - Skip schedule validation
     */
    triggerJob: async (jobName, options = {}) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      const { async, parameters, skipScheduleCheck } = options;
      
      const payload = {
        ...(async !== undefined && { async }),
        ...(parameters && { parameters }),
        ...(skipScheduleCheck !== undefined && { skipScheduleCheck })
      };
      
      try {
        const response = await api.post(`/cron/trigger/${jobName}`, payload);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to trigger cron job: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Job Management
  management: {
    /**
     * Get list of available cron jobs
     * @param {Object} filters - Job filters
     * @param {string} filters.status - Filter by status
     * @param {string} filters.category - Filter by category
     * @param {boolean} filters.includeDisabled - Include disabled jobs
     */
    getJobList: async (filters = {}) => {
      const { status, category, includeDisabled } = filters;
      
      const queryParams = new URLSearchParams({
        ...(status && { status }),
        ...(category && { category }),
        ...(includeDisabled !== undefined && { includeDisabled: includeDisabled.toString() })
      });
      
      try {
        const response = await api.get(`/cron/jobs?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch job list: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get cron job configuration
     * @param {string} jobName - Cron job name
     */
    getJobConfig: async (jobName) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      try {
        const response = await api.get(`/cron/jobs/${jobName}/config`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch job config: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Update cron job configuration
     * @param {string} jobName - Cron job name
     * @param {Object} config - New configuration
     * @param {string} config.schedule - Cron schedule expression
     * @param {boolean} config.enabled - Enable/disable job
     * @param {Object} config.options - Job options
     */
    updateJobConfig: async (jobName, config) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      if (!config || Object.keys(config).length === 0) {
        throw new Error('Configuration is required');
      }
      
      try {
        const response = await api.put(`/cron/jobs/${jobName}/config`, config);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to update job config: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Monitoring & Logs
  monitoring: {
    /**
     * Get cron job execution history
     * @param {string} jobName - Cron job name
     * @param {Object} options - History options
     * @param {number} options.limit - Number of entries to return
     * @param {string} options.startDate - Start date filter
     * @param {string} options.endDate - End date filter
     * @param {string} options.status - Filter by execution status
     */
    getJobHistory: async (jobName, options = {}) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      const { limit = 50, startDate, endDate, status } = options;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(status && { status })
      });
      
      try {
        const response = await api.get(`/cron/jobs/${jobName}/history?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch job history: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get cron job logs
     * @param {string} jobName - Cron job name
     * @param {Object} options - Log options
     * @param {string} options.executionId - Specific execution ID
     * @param {string} options.level - Log level filter
     * @param {number} options.lines - Number of log lines
     */
    getJobLogs: async (jobName, options = {}) => {
      if (!jobName) {
        throw new Error('Job name is required');
      }
      
      const { executionId, level, lines } = options;
      
      const queryParams = new URLSearchParams({
        ...(executionId && { executionId }),
        ...(level && { level }),
        ...(lines && { lines: lines.toString() })
      });
      
      try {
        const response = await api.get(`/cron/jobs/${jobName}/logs?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch job logs: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Get system-wide cron metrics
     * @param {Object} options - Metrics options
     * @param {string} options.period - Time period for metrics
     * @param {Array} options.metrics - Specific metrics to include
     */
    getSystemMetrics: async (options = {}) => {
      const { period, metrics } = options;
      
      const queryParams = new URLSearchParams({
        ...(period && { period }),
        ...(metrics && { metrics: metrics.join(',') })
      });
      
      try {
        const response = await api.get(`/cron/metrics?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch system metrics: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Utility Functions
  utils: {
    /**
     * Validate cron expression
     * @param {string} cronExpression - Cron expression to validate
     */
    validateCronExpression: (cronExpression) => {
      if (!cronExpression) {
        return { valid: false, error: 'Cron expression is required' };
      }
      
      // Basic cron expression validation (5 or 6 fields)
      const parts = cronExpression.trim().split(/\s+/);
      if (parts.length < 5 || parts.length > 6) {
        return { valid: false, error: 'Cron expression must have 5 or 6 fields' };
      }
      
      return { valid: true };
    },

    /**
     * Parse cron expression to human readable format
     * @param {string} cronExpression - Cron expression
     */
    parseCronExpression: (cronExpression) => {
      // This would typically use a cron parser library
      // For now, return basic information
      return {
        expression: cronExpression,
        description: 'Cron expression parsing not implemented in frontend'
      };
    },

    /**
     * Get next execution times for a cron job
     * @param {string} cronExpression - Cron expression
     * @param {number} count - Number of next executions to calculate
     */
    getNextExecutions: async (cronExpression, count = 5) => {
      if (!cronExpression) {
        throw new Error('Cron expression is required');
      }
      
      const queryParams = new URLSearchParams({
        expression: cronExpression,
        count: count.toString()
      });
      
      try {
        const response = await api.get(`/cron/next-executions?${queryParams}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to calculate next executions: ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

export default cronService;