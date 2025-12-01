/**
 * Quiz Service
 * Handle quiz/assessment operations
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const quizService = {
  /**
   * Get all questions/assessments
   */
  getQuestions: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.QUESTIONS_LIST);
      return response.data;
    } catch (error) {
      throw error.response?. data || error;
    }
  },

  /**
   * Submit quiz answers
   * @param {string|number} tutorialId - Tutorial ID
   * @param {string} assessmentId - Assessment ID
   * @param {array} answers - Array of answers { soal_id, correct }
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      const url = API_ENDPOINTS.SUBMIT_ASSESSMENT
        .replace(':tutorialId', tutorialId)
        .replace(':assessmentId', assessmentId);
      
      const response = await api.post(url, { answers });
      return response.data;
    } catch (error) {
      throw error.response?. data || error;
    }
  },

  /**
   * Reset progress
   */
  resetProgress: async () => {
    try {
      const response = await api. get(API_ENDPOINTS.PROGRESS_RESET);
      return response. data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default quizService;