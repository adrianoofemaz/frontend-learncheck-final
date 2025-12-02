/**
 * User Service
 * Handle user profile, preferences
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { STORAGE_KEYS } from '../constants/config';

export const userService = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user preferences
   */
  getPreferences: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PREFERENCES);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user preferences
   * @param {object} preferences - { theme, font_size, font, layout_width }
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.patch(
        API_ENDPOINTS.USER_PREFERENCES,
        preferences
      );
      
      // Update sessionStorage
      sessionStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(response.data. preference)
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;