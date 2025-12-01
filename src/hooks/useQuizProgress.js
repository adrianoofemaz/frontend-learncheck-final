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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Record answer untuk question tertentu
   */
  const recordAnswer = useCallback((questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, []);

  /**
   * Move ke question berikutnya
   */
  const nextQuestion = useCallback((totalQuestions) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex]);

  /**
   * Move ke question sebelumnya
   */
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
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
    setSelectedAnswer(null);
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
    score,
    setScore,
    startTime,
    setStartTime,
    isSubmitted,
    setIsSubmitted,
    selectedAnswer,
    setSelectedAnswer,
    showFeedback,
    setShowFeedback,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    initializeQuiz,
  };
};

export default useQuizProgress;