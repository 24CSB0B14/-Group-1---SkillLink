import api from './api';

const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews/create', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my reviews (reviews I've written)
  getMyReviews: async () => {
    try {
      const response = await api.get('/reviews/my-reviews');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reviews about me
  getReviewsAboutMe: async () => {
    try {
      const response = await api.get('/reviews/about-me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reviews for a user
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reviews by contract
  getReviewByContract: async (contractId) => {
    try {
      const response = await api.get(`/reviews/contract/${contractId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default reviewService;
