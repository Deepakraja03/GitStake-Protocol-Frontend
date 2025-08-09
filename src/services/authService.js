import api from './api';

/**
 * Authentication Service
 * Handles all authentication operations including login, registration, and session management
 */
export const authService = {
  // Authentication Operations
  auth: {
    /**
     * User authentication/login
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email or username
     * @param {string} credentials.password - User password
     * @param {boolean} credentials.rememberMe - Remember user session
     * @param {string} credentials.twoFactorCode - Two-factor authentication code
     */
    login: async (credentials) => {
      const { email, password, rememberMe, twoFactorCode } = credentials;
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const payload = {
        email,
        password,
        ...(rememberMe !== undefined && { rememberMe }),
        ...(twoFactorCode && { twoFactorCode })
      };
      
      try {
        const response = await api.post('/auth/login', payload);
        
        // Store authentication token if login successful
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Store refresh token if provided
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
        }
        
        return response.data;
      } catch (error) {
        throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * User registration
     * @param {Object} userData - Registration data
     * @param {string} userData.username - Unique username
     * @param {string} userData.email - User email
     * @param {string} userData.password - User password
     * @param {string} userData.confirmPassword - Password confirmation
     * @param {string} userData.firstName - First name
     * @param {string} userData.lastName - Last name
     * @param {string} userData.githubUsername - GitHub username
     * @param {boolean} userData.acceptTerms - Terms acceptance
     */
    register: async (userData) => {
      const { 
        username, 
        email, 
        password, 
        confirmPassword, 
        firstName, 
        lastName, 
        githubUsername, 
        acceptTerms 
      } = userData;
      
      // Validation
      if (!username || !email || !password) {
        throw new Error('Username, email, and password are required');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!acceptTerms) {
        throw new Error('You must accept the terms and conditions');
      }
      
      const payload = {
        username,
        email,
        password,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(githubUsername && { githubUsername }),
        acceptTerms
      };
      
      try {
        const response = await api.post('/auth/register', payload);
        
        // Auto-login after successful registration
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (error) {
        throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * User logout
     * @param {Object} options - Logout options
     * @param {boolean} options.allDevices - Logout from all devices
     * @param {boolean} options.clearLocalData - Clear all local storage data
     */
    logout: async (options = {}) => {
      const { allDevices, clearLocalData = true } = options;
      
      const payload = {
        ...(allDevices !== undefined && { allDevices })
      };
      
      try {
        // Call logout endpoint
        await api.post('/auth/logout', payload);
        
        return { success: true, message: 'Logged out successfully' };
      } catch (error) {
        // Even if API call fails, clear local storage
        console.warn('Logout API call failed:', error.message);
        return { success: false, message: 'Logout completed locally' };
      } finally {
        // Always clear local storage on logout
        if (clearLocalData) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userPreferences');
        }
      }
    }
  },

  // Session Management
  session: {
    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      return !!(token && user);
    },

    /**
     * Get current user data
     */
    getCurrentUser: () => {
      try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    },

    /**
     * Get authentication token
     */
    getToken: () => {
      return localStorage.getItem('authToken');
    },

    /**
     * Refresh authentication token
     * @param {string} refreshToken - Refresh token (optional, will use stored token if not provided)
     */
    refreshToken: async (refreshToken) => {
      const token = refreshToken || localStorage.getItem('refreshToken');
      
      if (!token) {
        throw new Error('No refresh token available');
      }
      
      try {
        const response = await api.post('/auth/refresh', { refreshToken: token });
        
        // Update stored tokens
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        return response.data;
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        throw new Error(`Token refresh failed: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Validate current session
     */
    validateSession: async () => {
      try {
        const response = await api.get('/auth/validate');
        return response.data;
      } catch (error) {
        throw new Error(`Session validation failed: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Password Management
  password: {
    /**
     * Request password reset
     * @param {string} email - User email
     */
    requestPasswordReset: async (email) => {
      if (!email) {
        throw new Error('Email is required');
      }
      
      try {
        const response = await api.post('/auth/password-reset-request', { email });
        return response.data;
      } catch (error) {
        throw new Error(`Password reset request failed: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Reset password with token
     * @param {Object} resetData - Reset data
     * @param {string} resetData.token - Reset token
     * @param {string} resetData.newPassword - New password
     * @param {string} resetData.confirmPassword - Password confirmation
     */
    resetPassword: async (resetData) => {
      const { token, newPassword, confirmPassword } = resetData;
      
      if (!token || !newPassword || !confirmPassword) {
        throw new Error('Token, new password, and confirmation are required');
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      try {
        const response = await api.post('/auth/password-reset', {
          token,
          newPassword
        });
        return response.data;
      } catch (error) {
        throw new Error(`Password reset failed: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Change password (authenticated user)
     * @param {Object} passwordData - Password change data
     * @param {string} passwordData.currentPassword - Current password
     * @param {string} passwordData.newPassword - New password
     * @param {string} passwordData.confirmPassword - Password confirmation
     */
    changePassword: async (passwordData) => {
      const { currentPassword, newPassword, confirmPassword } = passwordData;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('Current password, new password, and confirmation are required');
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      try {
        const response = await api.put('/auth/change-password', {
          currentPassword,
          newPassword
        });
        return response.data;
      } catch (error) {
        throw new Error(`Password change failed: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Profile Management
  profile: {
    /**
     * Update user profile
     * @param {Object} profileData - Profile update data
     * @param {string} profileData.firstName - First name
     * @param {string} profileData.lastName - Last name
     * @param {string} profileData.email - Email address
     * @param {string} profileData.githubUsername - GitHub username
     * @param {Object} profileData.preferences - User preferences
     */
    updateProfile: async (profileData) => {
      if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error('Profile data is required');
      }
      
      try {
        const response = await api.put('/auth/profile', profileData);
        
        // Update stored user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (error) {
        throw new Error(`Profile update failed: ${error.response?.data?.message || error.message}`);
      }
    },

    /**
     * Delete user account
     * @param {Object} deleteData - Account deletion data
     * @param {string} deleteData.password - Current password for confirmation
     * @param {string} deleteData.reason - Reason for deletion
     * @param {boolean} deleteData.deleteAllData - Delete all associated data
     */
    deleteAccount: async (deleteData) => {
      const { password, reason, deleteAllData } = deleteData;
      
      if (!password) {
        throw new Error('Password confirmation is required');
      }
      
      const payload = {
        password,
        ...(reason && { reason }),
        ...(deleteAllData !== undefined && { deleteAllData })
      };
      
      try {
        const response = await api.delete('/auth/account', { data: payload });
        
        // Clear all local data after successful deletion
        localStorage.clear();
        
        return response.data;
      } catch (error) {
        throw new Error(`Account deletion failed: ${error.response?.data?.message || error.message}`);
      }
    }
  },

  // Utility Functions
  utils: {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     */
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     */
    validatePassword: (password) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      const score = [
        password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      ].filter(Boolean).length;
      
      return {
        isValid: score >= 3,
        score,
        requirements: {
          minLength: password.length >= minLength,
          hasUpperCase,
          hasLowerCase,
          hasNumbers,
          hasSpecialChar
        }
      };
    },

    /**
     * Check if token is expired
     * @param {string} token - JWT token
     */
    isTokenExpired: (token) => {
      if (!token) return true;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
      } catch (error) {
        return true;
      }
    }
  }
};

export default authService;