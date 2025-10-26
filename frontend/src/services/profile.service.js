import api from './api';

// Profile service to handle profile related API calls
const profileService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/profile/getProfile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.patch('/profile/updateProfile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Note: The following methods are not implemented in the backend
  // We'll comment them out for now until backend implementation is added
  
  // Get freelancer profile by ID
  // getFreelancerProfile: async (id) => {
  //   try {
  //     const response = await api.get(`/profile/freelancer/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },

  // Get client profile by ID
  // getClientProfile: async (id) => {
  //   try {
  //     const response = await api.get(`/profile/client/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },
};

export default profileService;