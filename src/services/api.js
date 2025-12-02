/**
 * API Service
 * Axios instance dengan interceptor
 */

import axios from 'axios';
import { APP_CONFIG } from '../constants/config';
import authService from './authService';

const api = axios.create({
  baseURL: APP_CONFIG.api.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request. use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console. log('Added auth token to request headers', token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and logout
api.interceptors.response. use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      authService.logout();
      window.location.href = '/login';
    }
    return Promise. reject(error);
  }
);

export default api;