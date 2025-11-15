import api from './api';

// Bid service to handle bid related API calls
const bidService = {
  // Place a bid on a job
  placeBid: async (jobId, bidData) => {
    try {
      const response = await api.post(`/bids/create`, { jobId, ...bidData });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all bids for a job
  getBidsForJob: async (jobId) => {
    try {
      const response = await api.get(`/bids/job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bids:", error);
      if (error.response) {
        // Server responded with error status
        throw error.response.data || error;
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        throw new Error(error.message || "Failed to fetch bids");
      }
    }
  },

  // Get bid by ID
  getBidById: async (bidId) => {
    try {
      const response = await api.get(`/bids/${bidId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update bid
  updateBid: async (bidId, bidData) => {
    try {
      const response = await api.patch(`/bids/${bidId}`, bidData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete bid
  deleteBid: async (bidId) => {
    try {
      const response = await api.delete(`/bids/${bidId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accept a bid
  acceptBid: async (bidId) => {
    try {
      const response = await api.post(`/bids/accept`, { bidId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default bidService;