import axios from 'axios';

// Create an axios instance with default configuration
const API_BASE_URL = '/api/v1'; // Use relative path to leverage Vite proxy

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    // Handle common error responses
    if (error.response?.status === 401) {
      // Unauthorized - remove token but don't redirect here to avoid loops
      localStorage.removeItem('token');
      // Let the application handle the redirect
    }
    return Promise.reject(error);
  }
);

export default api;