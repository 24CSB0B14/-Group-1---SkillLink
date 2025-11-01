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
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job:", error);
      if (error.response) {
        // Server responded with error status
        throw error.response.data || error;
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        throw new Error(error.message || "Failed to fetch job details");
      }
    }
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.patch(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete job
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
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