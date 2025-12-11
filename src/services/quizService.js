/**
 * Quiz Service
 * Handle quiz/assessment operations
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const quizService = {
  /**
   * Get questions untuk tutorial tertentu
   * @param {number|string} tutorialId - Tutorial ID
   * @returns {Promise<Object>} Response data dengan questions
   */
  getQuestions: async (tutorialId) => {
    try {
      // Validasi input
      if (!tutorialId) {
        throw new Error('Tutorial ID is required');
      }

      console.log('🔍 Fetching questions for tutorial:', tutorialId);
      
      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      console.log('📍 Questions URL:', url);
      
      const response = await api.get(url);
      console.log('✅ Questions response:', response.data);
      
      // Validasi response structure
      if (!response.data) {
        throw new Error('Invalid response structure from server');
      }

      // Pastikan data questions ada
      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.warn('⚠️ No questions array in response');
        return {
          data: [],
          assessment_id: response.data.assessment_id || null,
          message: 'No questions available'
        };
      }
      
      return response.data;

    } catch (error) {
      console.error('❌ Error fetching questions:', error.message);
      
      // Enhanced error object
      const enhancedError = {
        message: error.message || 'Failed to fetch questions',
        status: error.response?.status,
        statusText: error.response?.statusText,
        details: error.response?.data?.message || error.response?.data?.error,
        originalError: error
      };

      console.error('📋 Error details:', enhancedError);
      
      throw enhancedError;
    }
  },

  /**
   * Submit quiz answers
   * @param {number|string} tutorialId - Tutorial ID
   * @param {string} assessmentId - Assessment ID (bisa dengan atau tanpa prefix)
   * @param {Array} answers - Array of answer objects
   * @returns {Promise<Object>} Submit result
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      console.log('📤 SUBMITTING ANSWERS');
      console.log('   tutorialId:', tutorialId, typeof tutorialId);
      console.log('   assessmentId:', assessmentId, typeof assessmentId);
      console.log('   answers count:', answers?.length || 0);

      // Validasi input
      if (!tutorialId) {
        throw new Error('Tutorial ID is required');
      }

      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        throw new Error('Answers array is required and cannot be empty');
      }

      // ✅ EXTRACT assessment ID tanpa prefix
      // assessmentId = "assessment:_J2LYB" → "_J2LYB"
      const cleanAssessmentId = assessmentId.includes(':') 
        ? assessmentId.split(':')[1].trim()
        : assessmentId.trim();
      
      console.log('   cleanAssessmentId:', cleanAssessmentId);

      // Validasi cleaned ID
      if (!cleanAssessmentId) {
        throw new Error('Invalid assessment ID after cleaning');
      }

      // Generate URL dengan sanitized IDs
      const url = `/submit/tutorial/${tutorialId}/assessment/${cleanAssessmentId}`;
      console.log('📍 Generated URL:', url);

      // Prepare payload
      const payload = { answers };
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      // Validasi setiap answer object
      const validAnswers = answers.every(answer => 
        answer.hasOwnProperty('question_id') && 
        answer.hasOwnProperty('selected_option')
      );

      if (!validAnswers) {
        console.warn('⚠️ Some answers missing required fields');
      }

      console.log('🚀 Sending POST request...');
      const response = await api.post(url, payload);
      
      console.log('✅ SUBMIT SUCCESS!');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      
      // Validasi response
      if (!response.data) {
        throw new Error('No data in response');
      }
      
      return response.data;

    } catch (error) {
      console.error('❌ SUBMIT FAILED!');
      console.error('   Status:', error.response?.status);
      console.error('   Status Text:', error.response?.statusText);
      console.error('   URL:', error.config?.url);
      console.error('   Method:', error.config?.method);
      console.error('   Error Data:', JSON.stringify(error.response?.data, null, 2));
      
      // Enhanced error object
      const enhancedError = {
        message: error.response?.data?.message || 
                 error.response?.data?.error || 
                 error.message || 
                 'Failed to submit answers',
        status: error.response?.status,
        statusText: error.response?.statusText,
        details: error.response?.data,
        url: error.config?.url,
        originalError: error
      };

      throw enhancedError;
    }
  },

  /**
   * Reset progress
   * @returns {Promise<Object>} Reset result
   */
  resetProgress: async () => {
    try {
      console.log('🔄 Resetting progress...');
      
      const response = await api.get(API_ENDPOINTS.PROGRESS_RESET);
      console.log('✅ Reset response:', response.data);
      
      // Validasi response
      if (!response.data) {
        throw new Error('No data in reset response');
      }
      
      return response.data;

    } catch (error) {
      console.error('❌ Error resetting progress:', error.message);
      
      // Enhanced error object
      const enhancedError = {
        message: error.response?.data?.message || 
                 error.message || 
                 'Failed to reset progress',
        status: error.response?.status,
        statusText: error.response?.statusText,
        details: error.response?.data,
        originalError: error
      };

      console.error('📋 Reset error details:', enhancedError);
      
      throw enhancedError;
    }
  },

  /**
   * Get assessment results/score
   * @param {number|string} tutorialId - Tutorial ID
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object>} Assessment results
   */
  getResults: async (tutorialId, assessmentId) => {
    try {
      console.log('📊 Fetching results for:', { tutorialId, assessmentId });

      if (!tutorialId || !assessmentId) {
        throw new Error('Tutorial ID and Assessment ID are required');
      }

      const cleanAssessmentId = assessmentId.includes(':') 
        ? assessmentId.split(':')[1].trim()
        : assessmentId.trim();

      const url = `/results/tutorial/${tutorialId}/assessment/${cleanAssessmentId}`;
      console.log('📍 Results URL:', url);

      const response = await api.get(url);
      console.log('✅ Results response:', response.data);

      return response.data;

    } catch (error) {
      console.error('❌ Error fetching results:', error.message);
      
      const enhancedError = {
        message: error.response?.data?.message || 
                 error.message || 
                 'Failed to fetch results',
        status: error.response?.status,
        details: error.response?.data,
        originalError: error
      };

      throw enhancedError;
    }
  },

  /**
   * Validate answer format
   * @param {Array} answers - Answers to validate
   * @returns {boolean} Is valid
   */
  validateAnswers: (answers) => {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false;
    }

    return answers.every(answer => {
      return (
        answer &&
        typeof answer === 'object' &&
        (answer.hasOwnProperty('question_id') || answer.hasOwnProperty('questionId')) &&
        (answer.hasOwnProperty('selected_option') || answer.hasOwnProperty('selectedOption'))
      );
    });
  },

  /**
   * Clean assessment ID (remove prefix if exists)
   * @param {string} assessmentId - Assessment ID dengan atau tanpa prefix
   * @returns {string} Clean assessment ID
   */
  cleanAssessmentId: (assessmentId) => {
    if (!assessmentId || typeof assessmentId !== 'string') {
      return '';
    }

    return assessmentId.includes(':') 
      ? assessmentId.split(':')[1].trim()
      : assessmentId.trim();
  }
};

export default quizService;