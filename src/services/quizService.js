/**
 * Quiz Service
 * Handle quiz/assessment operations
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const quizService = {
  /**
   * Get questions untuk tutorial tertentu
   */
  getQuestions: async (tutorialId) => {
    try {
      console.log('Fetching questions for tutorial:', tutorialId);
      
      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      console.log('Questions URL:', url);
      
      const response = await api.get(url);
      console.log('Questions response:', response. data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error. message);
      throw error. response?.data || error;
    }
  },

  /**
   * Submit quiz answers
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      console.log('📤 SUBMITTING ANSWERS');
      console.log('   tutorialId:', tutorialId, typeof tutorialId);
      console. log('   assessmentId:', assessmentId, typeof assessmentId);
      console.log('   answers count:', answers.length);

      // ✅ EXTRACT assessment ID tanpa prefix
      // assessmentId = "assessment:_J2LYB" → "_J2LYB"
      const cleanAssessmentId = assessmentId.includes(':') 
        ? assessmentId.split(':')[1] 
        : assessmentId;
      
      console.log('   cleanAssessmentId:', cleanAssessmentId);

      const url = `/submit/tutorial/${tutorialId}/assessment/${cleanAssessmentId}`;
      console.log('📍 Generated URL:', url);

      const payload = { answers };
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      console.log('🚀 Sending POST request...');
      const response = await api.post(url, payload);
      
      console.log('✅ SUBMIT SUCCESS!');
      console.log('   Response:', JSON.stringify(response. data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ SUBMIT FAILED! ');
      console.error('   Status:', error.response?.status);
      console.error('   URL:', error.config?.url);
      console.error('   Error Data:', JSON.stringify(error.response?.data, null, 2));
      
      throw error.response?.data || error;
    }
  },

  /**
   * Reset progress
   */
  resetProgress: async () => {
    try {
      console.log('Resetting progress.. .');
      
      const response = await api.get(API_ENDPOINTS.PROGRESS_RESET);
      console.log('Reset response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error resetting progress:', error.message);
      throw error.response?.data || error;
    }
  },
};

export default quizService;