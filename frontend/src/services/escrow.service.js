import api from './api';

// Escrow service to handle escrow related API calls
const escrowService = {
  // Fund escrow
  fundEscrow: async (jobId, amount) => {
    try {
      const response = await api.post('/escrow/fund', { jobId, amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Release escrow
  releaseEscrow: async (escrowId) => {
    try {
      const response = await api.put(`/escrow/${escrowId}/release`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Raise dispute
  raiseDispute: async (escrowId, reason) => {
    try {
      const response = await api.post(`/escrow/${escrowId}/dispute`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refund client
  refundClient: async (escrowId) => {
    try {
      const response = await api.put(`/escrow/${escrowId}/refund`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get escrow details
  getEscrowDetails: async (escrowId) => {
    try {
      const response = await api.get(`/escrow/${escrowId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default escrowService;