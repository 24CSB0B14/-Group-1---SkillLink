import api from './api';

// Auth service to handle authentication related API calls
const authService = {
  // User signup
  signup: async (userData) => {
    try {
      console.log('Sending signup data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      // Return a more detailed error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', ') || 'Signup failed. Please check your input.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Signup failed. Please try again.');
      }
    }
  },

  // User login
  login: async (credentials) => {
    try {
      console.log('Sending login data:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      // Return a more detailed error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', ') || 'Login failed. Please check your credentials.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  },

  // User logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/current-user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Forgot password
  forgotPassword: async ({ email }) => {
    try {
      const response = await api.post('/auth/forget-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', ') || 'Failed to send reset instructions.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to send reset instructions. Please try again.');
      }
    }
  },

  // Reset password
  resetPassword: async ({ resetToken, newPassword }) => {
    try {
      const response = await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', ') || 'Failed to reset password.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to reset password. Please try again.');
      }
    }
  },
};

export default authService;