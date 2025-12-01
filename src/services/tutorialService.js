/**
 * Tutorial Service
 * Handle tutorials/learning materials
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const tutorialService = {
  /**
   * Get all tutorials
   */
  getTutorials: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.TUTORIALS_LIST);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get tutorial detail by ID
   * @param {string|number} id - Tutorial ID
   */
  getTutorialDetail: async (id) => {
    try {
      const url = API_ENDPOINTS.TUTORIAL_DETAIL.replace(':id', id);
      const response = await api. get(url);
      return response.data;
    } catch (error) {
      throw error. response?.data || error;
    }
  },
};

export default tutorialService;