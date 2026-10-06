import axios from 'axios';

/**
 * Centralized Axios API Client Instance for FlexFit Backend
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor: Dynamically attach Bearer Token if present in LocalStorage
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Global response error handling
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message from backend
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred'
    };
    return Promise.reject(customError);
  }
);

export default API;
