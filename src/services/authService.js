/**
 * Auth Service
 * Handle authentication (login, register, logout)
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { APP_CONFIG } from '../constants/config';

// Create axios instance untuk auth
const API_BASE_URL = 'https://api.capstone.web.id'; // ← PRODUCTION API

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors. request.use((config) => {
  const token = localStorage.getItem(APP_CONFIG.storage.authToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  /**
   * Register new user
   */
  register: async (username, password, name) => {
    try {
      console.log('Register attempt:', { name, username, passwordLength: password. length });
      
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        name,
        username,
        password,
      });
      
      console.log('Register response:', response. data);
      
      // Register response might not include token, user should login after
      // But if token exists, save it
      if (response.data.user?.token) {
        localStorage.setItem(APP_CONFIG. storage.authToken, response.data.user.token);
        localStorage.setItem(APP_CONFIG. storage.user, JSON.stringify(response.data.user));
      }
      
      return response. data;
    } catch (error) {
      console.error('Register error:', error. response?.data);
      throw error.response?.data || error;
    }
  },

  /**
   * Login user
   */
  login: async (username, password) => {
    try {
      console.log('Login attempt:', { username, passwordLength: password.length });
      
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      
      console. log('Login response:', response.data);
      
      // ✅ TOKEN IS INSIDE response. data. user.token
      if (response.data.user?.token) {
        const token = response.data.user.token;
        localStorage.setItem(APP_CONFIG. storage.authToken, token);
        localStorage.setItem(APP_CONFIG.storage.user, JSON. stringify(response.data.user));
        
        console.log('Token saved:', token. substring(0, 20) + '...');
      } else {
        console.warn('No token in response! ');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error. response?.data);
      throw error.response?.data || error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(APP_CONFIG.storage.authToken);
    localStorage.removeItem(APP_CONFIG.storage.user);
    console.log('User logged out');
  },

  /**
   * Get token from localStorage
   */
  getToken: () => {
    return localStorage.getItem(APP_CONFIG.storage.authToken);
  },

  /**
   * Get stored user from localStorage
   */
  getUser: () => {
    const user = localStorage.getItem(APP_CONFIG.storage.user);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!authService.getToken();
  },
};

export default authService;