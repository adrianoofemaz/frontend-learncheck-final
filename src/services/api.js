/**
 * Axios Instance & Interceptors
 */

import axios from 'axios';
import { APP_CONFIG } from '../constants/config';

// Create axios instance
const api = axios.create({
  baseURL: APP_CONFIG.api.baseURL,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Add Authorization token ke setiap request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONFIG.storage.authToken);
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
 * Response Interceptor
 * Handle errors, 401 responses, dll
 */
api. interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?. status === 401) {
      // Token expired atau invalid
      localStorage.removeItem(APP_CONFIG. storage.authToken);
      localStorage.removeItem(APP_CONFIG. storage.user);
      window. location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
