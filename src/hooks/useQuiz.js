/**
 * useQuiz Hook
 * Handle quiz questions & submission
 */

import { useState, useCallback } from 'react';
import quizService from '../services/quizService';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);

  /**
   * Fetch questions untuk tutorial tertentu
   * @param {number} tutorialId - Tutorial ID
   */
  const fetchQuestions = useCallback(async (tutorialId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching questions for tutorial:', tutorialId);
      
      const response = await quizService.getQuestions(tutorialId);
      console.log('Questions response:', response);
      
      // Batasi soal submodul ke 3 pertama (sisanya untuk final)
      const questionsData = (response.data || []).slice(0, 3);
      const assmtId = response.assessment_id || null;
      
      setQuestions(questionsData);
      setAssessmentId(assmtId);
      
      return response;
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message || "Failed to fetch questions");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit quiz answers
   * @param {number} tutorialId - Tutorial ID
   * @param {string} assessmentId - Assessment ID
   * @param {array} answers - Array of answers
   */
  const submitAnswers = useCallback(async (tutorialId, assmtId, answers) => {
    setSubmitLoading(true);
    setError(null);
    try {
      console.log('Submitting answers:', { tutorialId, assessmentId: assmtId, answers });
      
      const response = await quizService.submitAnswers(
        tutorialId,
        assmtId,
        answers
      );
      
      console.log('Submit response:', response);
      return response;
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError(err.message || 'Failed to submit answers');
      throw err;
    } finally {
      setSubmitLoading(false);
    }
  }, []);

  /**
   * Reset progress
   */
  const resetProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Resetting progress...');
      
      const response = await quizService.resetProgress();
      
      console.log('Reset response:', response);
      return response;
    } catch (err) {
      console.error('Error resetting progress:', err);
      setError(err.message || 'Failed to reset progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    questions,
    loading,
    error,
    submitLoading,
    assessmentId,
    fetchQuestions,
    submitAnswers,
    resetProgress,
  };
};

export default useQuiz;