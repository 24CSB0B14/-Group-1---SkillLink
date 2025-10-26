import api from './api';

const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all users
  getAllUsers: async (params) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all disputes
  getAllDisputes: async (status) => {
    try {
      const url = status ? `/admin/disputes?status=${status}` : '/admin/disputes';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all transactions
  getAllTransactions: async () => {
    try {
      const response = await api.get('/admin/transactions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminService;
