/**
 * Quiz Service
 * Handle quiz/assessment operations
 */

import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const quizService = {
  /**
   * Get questions untuk tutorial tertentu
   */
  getQuestions: async (tutorialId) => {
    try {
      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get assessment by assessmentId (opsional)
   */
  getAssessmentById: async (assessmentId) => {
    try {
      const url = API_ENDPOINTS.ASSESSMENT_BY_ID(assessmentId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Submit quiz answers
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      const cleanAssessmentId = assessmentId.includes(":")
        ? assessmentId.split(":")[1]
        : assessmentId;
      const url = `/submit/tutorial/${tutorialId}/assessment/${cleanAssessmentId}`;
      const payload = { answers };
      const response = await api.post(url, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reset progress
   */
  resetProgress: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PROGRESS_RESET);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default quizService;