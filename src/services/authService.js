/**
 * Auth Service
 * Handle authentication (login, register, logout)
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/config';

// Create axios instance untuk auth
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors. request.use((config) => {
  const token = sessionStorage.getItem(STORAGE_KEYS.authToken);
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
      console.log('Register attempt:', { name, username, passwordLength: password.length });
      
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        name,
        username,
        password,
      });
      
      console.log('Register response:', response.data);
      
      // Register response might not include token, user should login after
      // But if token exists, save it
      if (response.data.user?. token) {
        sessionStorage. setItem(STORAGE_KEYS.authToken, response.data. user.token);
        sessionStorage.setItem(STORAGE_KEYS.user, JSON. stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console. error('Register error:', error. response?.data);
      throw error. response?.data || error;
    }
  },

  /**
   * Login user
   */
  login: async (username, password) => {
    try {
      console.log('Login attempt:', { username, passwordLength: password.length });
      
      const response = await api. post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      
      console.log('Login response:', response.data);
      
      // ✅ TOKEN IS INSIDE response.data. user. token
      if (response.data.user?.token) {
        const token = response.data.user. token;
        sessionStorage.setItem(STORAGE_KEYS. authToken, token);
        sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.data.user));
        
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
    sessionStorage.removeItem(STORAGE_KEYS. authToken);
    sessionStorage. removeItem(STORAGE_KEYS.user);
    console.log('User logged out');
  },

  /**
   * Get token from sessionStorage
   */
  getToken: () => {
    return sessionStorage.getItem(STORAGE_KEYS.authToken);
  },

  /**
   * Get stored user from sessionStorage
   */
  getUser: () => {
    const user = sessionStorage.getItem(STORAGE_KEYS.user);
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