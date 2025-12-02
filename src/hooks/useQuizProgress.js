/**
 * useQuizProgress Hook
 * Handle quiz progress tracking during quiz
 */

import { useState, useCallback, useEffect } from 'react';

export const useQuizProgress = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Record answer untuk question tertentu
   * @param {number} questionIndex - Index pertanyaan
   * @param {number} answer - Index jawaban (0-3)
   */
  const recordAnswer = useCallback((questionIndex, answer) => {
    console.log('Recording answer:', { questionIndex, answer });
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, []);

  /**
   * Get selected answer untuk current question
   */
  const getCurrentAnswer = useCallback(() => {
    return answers[currentQuestionIndex];
  }, [answers, currentQuestionIndex]);

  /**
   * Move ke question berikutnya
   */
  const nextQuestion = useCallback((totalQuestions) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex]);

  /**
   * Move ke question sebelumnya
   */
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  /**
   * Reset semua quiz state
   */
  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setStartTime(null);
    setIsSubmitted(false);
    setShowFeedback(false);
  }, []);

  /**
   * Initialize quiz dengan start time
   */
  const initializeQuiz = useCallback(() => {
    const now = new Date();
    setStartTime(now);
    resetQuiz();
  }, [resetQuiz]);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    getCurrentAnswer,  // ✅ NEW
    score,
    setScore,
    startTime,
    setStartTime,
    isSubmitted,
    setIsSubmitted,
    showFeedback,
    setShowFeedback,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    initializeQuiz,
  };
};

export default useQuizProgress;