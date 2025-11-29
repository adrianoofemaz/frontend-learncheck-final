import React, { createContext, useState, useCallback } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setStartTime(null);
    setIsSubmitted(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, []);

  const recordAnswer = useCallback((questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  }, []);

  const value = {
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
    resetQuiz
  };

  return (
    <QuizContext. Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext;