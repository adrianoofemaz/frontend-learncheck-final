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

  /**
   * Fetch all questions
   */
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizService.getQuestions();
      setQuestions(response.data || []);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit quiz answers
   */
  const submitAnswers = useCallback(async (tutorialId, assessmentId, answers) => {
    setSubmitLoading(true);
    setError(null);
    try {
      const response = await quizService.submitAnswers(
        tutorialId,
        assessmentId,
        answers
      );
      setSubmitLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to submit answers');
      setSubmitLoading(false);
      throw err;
    }
  }, []);

  /**
   * Reset progress
   */
  const resetProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizService.resetProgress();
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to reset progress');
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    questions,
    loading,
    error,
    submitLoading,
    fetchQuestions,
    submitAnswers,
    resetProgress,
  };
};

export default useQuiz;