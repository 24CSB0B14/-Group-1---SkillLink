import api from './api';

// Dispute service to handle dispute related API calls
const disputeService = {
  // Create a dispute
  createDispute: async (escrowId, reason) => {
    try {
      const response = await api.post('/disputes/create', { escrowId, reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all disputes (admin)
  getAllDisputes: async () => {
    try {
      const response = await api.get('/disputes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get dispute by ID
  getDisputeById: async (disputeId) => {
    try {
      const response = await api.get(`/disputes/${disputeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resolve dispute (admin)
  resolveDispute: async (disputeId, decision, resolutionNotes) => {
    try {
      const response = await api.put(`/disputes/${disputeId}/resolve`, { decision, resolutionNotes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get disputes by user
  getDisputesByUser: async (userId) => {
    try {
      const response = await api.get(`/disputes/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default disputeService;