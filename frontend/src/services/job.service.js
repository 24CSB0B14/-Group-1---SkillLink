import api from './api';

// Job service to handle job related API calls
const jobService = {
  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs/create', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all jobs
  getAllJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get job by ID
  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update job
  updateJob: async (id, jobData) => {
    try {
      const response = await api.patch(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete job
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search jobs
  searchJobs: async (query) => {
    try {
      const response = await api.get(`/jobs/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get jobs by client
  getJobsByClient: async () => {
    try {
      const response = await api.get(`/jobs/my-jobs`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default jobService;