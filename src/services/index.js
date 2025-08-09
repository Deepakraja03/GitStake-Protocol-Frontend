/**
 * Services Index
 * Central export point for all service modules
 */

// Base API instance
export { default as api } from './api';

// Service modules
export { userService } from './userService';
export { githubService } from './githubService';
export { githubAnalyticsService } from './githubAnalyticsService';
export { chatService } from './chatService';
export { emailService } from './emailService';
export { questService } from './questService';
export { cronService } from './cronService';
export { authService } from './authService';

// Legacy exports for backward compatibility (if needed)
export { userService as userAPI } from './userService';
export { githubService as githubAPI } from './githubService';
export { chatService as chatAPI } from './chatService';
export { emailService as emailAPI } from './emailService';
export { authService as authAPI } from './authService';

/**
 * Service Factory
 * Utility function to get service instances
 */
export const getService = (serviceName) => {
  const services = {
    user: userService,
    github: githubService,
    githubAnalytics: githubAnalyticsService,
    chat: chatService,
    email: emailService,
    quest: questService,
    cron: cronService,
    auth: authService
  };

  return services[serviceName] || null;
};

/**
 * Service Health Check
 * Check health status of all services
 */
export const checkServicesHealth = async () => {
  const healthChecks = [];

  try {
    // Chat service health
    healthChecks.push(
      chatService.assistant.getHealthStatus()
        .then(result => ({ service: 'chat', status: 'healthy', data: result }))
        .catch(error => ({ service: 'chat', status: 'unhealthy', error: error.message }))
    );

    // Deep search health
    healthChecks.push(
      chatService.deepSearch.getHealthStatus()
        .then(result => ({ service: 'deepSearch', status: 'healthy', data: result }))
        .catch(error => ({ service: 'deepSearch', status: 'unhealthy', error: error.message }))
    );

    // GitHub rate limit (as health indicator)
    healthChecks.push(
      githubAnalyticsService.system.getRateLimit()
        .then(result => ({ service: 'github', status: 'healthy', data: result }))
        .catch(error => ({ service: 'github', status: 'unhealthy', error: error.message }))
    );

    const results = await Promise.allSettled(healthChecks);
    return results.map(result => result.value || result.reason);
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

/**
 * Service Configuration
 * Get service configuration and status
 */
export const getServiceConfig = () => {
  return {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
    services: {
      user: 'User Analytics & Management',
      github: 'GitHub API Integration',
      githubAnalytics: 'GitHub Advanced Analytics',
      chat: 'AI Chat Assistant',
      email: 'Email Notification System',
      quest: 'Quest System',
      cron: 'Cron Job Management',
      auth: 'Authentication'
    }
  };
};