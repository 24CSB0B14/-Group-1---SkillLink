import axios from 'axios';

// Create an axios instance with default configuration
const API_BASE_URL = '/api/v1'; // Use relative path to leverage Vite proxy

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Token is handled via cookies, so no need to manually add it
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses
    if (error.response?.status === 401) {
      // Let the application handle the redirect
    }
    return Promise.reject(error);
  }
);

export default api;