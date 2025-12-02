/**
 * Quiz Service
 * Handle quiz/assessment operations
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const quizService = {
  /**
   * Get questions untuk tutorial tertentu
   * @param {number} tutorialId - Tutorial ID
   */
  getQuestions: async (tutorialId) => {
    try {
      console.log('Fetching questions for tutorial:', tutorialId);
      
      // ✅ Gunakan ASSESSMENT endpoint dengan tutorial ID
      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      console.log('Questions URL:', url);
      
      const response = await api.get(url);
      console.log('Questions response:', response. data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error. message);
      throw error. response?.  data || error;
    }
  },

  /**
   * Submit quiz answers
   * @param {string|number} tutorialId - Tutorial ID
   * @param {string} assessmentId - Assessment ID
   * @param {array} answers - Array of answers
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      console.log('Submitting answers:', { tutorialId, assessmentId, answers });
      
      const url = API_ENDPOINTS.  SUBMIT_ASSESSMENT(tutorialId, assessmentId);
      console.log('Submit URL:', url);
      
      const response = await api.  post(url, { answers });
      console.log('Submit response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error submitting answers:', error.message);
      throw error.response?. data || error;
    }
  },

  /**
   * Reset progress
   */
  resetProgress: async () => {
    try {
      console.  log('Resetting progress.. .');
      
      const response = await api.  get(API_ENDPOINTS.  PROGRESS_RESET);
      console.  log('Reset response:', response.data);
      
      return response.  data;
    } catch (error) {
      console. error('Error resetting progress:', error.message);
      throw error. response?. data || error;
    }
  },
};

export default quizService;