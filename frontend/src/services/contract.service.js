import api from './api';

const contractService = {
  // Create contract
  createContract: async (contractData) => {
    try {
      const response = await api.post('/contracts/create', contractData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's contracts
  getUserContracts: async (status) => {
    try {
      const url = status ? `/contracts/my-contracts?status=${status}` : '/contracts/my-contracts';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get contract by ID
  getContractById: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get contract by job ID
  getContractByJobId: async (jobId) => {
    try {
      const response = await api.get(`/contracts/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update contract status
  updateContractStatus: async (contractId, status) => {
    try {
      const response = await api.patch(`/contracts/${contractId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add milestone
  addMilestone: async (contractId, milestoneData) => {
    try {
      const response = await api.post(`/contracts/${contractId}/milestones`, milestoneData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Complete milestone
  completeMilestone: async (contractId, milestoneIndex) => {
    try {
      const response = await api.patch(`/contracts/${contractId}/milestones/${milestoneIndex}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default contractService;
