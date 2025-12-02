/**
 * Auth Service
 * Handle authentication (login, register, logout)
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { APP_CONFIG } from '../constants/config';

export const authService = {
  /**
   * Register new user
   */
  register: async (email, password, name) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        email,
        password,
        name,
      });
      
      // Save token & user to localStorage
      localStorage.setItem(APP_CONFIG. storage.authToken, response.data.token);
      localStorage.setItem(APP_CONFIG.storage.user, JSON.stringify(response.data.user));
      
      return response. data;
    } catch (error) {
      throw error. response?.data || error;
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS. LOGIN, {
        email,
        password,
      });
      
      // Save token & user to localStorage
      localStorage.setItem(APP_CONFIG.storage.authToken, response.data.token);
      localStorage.setItem(APP_CONFIG.storage.user, JSON. stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw error.response?. data || error; 
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(APP_CONFIG. storage.authToken);
    localStorage.removeItem(APP_CONFIG. storage.user);
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
};

export default authService;