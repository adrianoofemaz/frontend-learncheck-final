import { useState, useCallback } from 'react';
import finalQuizService from '../services/finalQuizService';

export const useFinalQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = await finalQuizService.getFinalQuestions();
      setQuestions(qs || []);
      setCurrentIndex(0);
      setAnswers({});
      setSubmitted(false);
    } catch (err) {
      setError(err.message || 'Gagal memuat quiz final');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAnswer = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const submit = useCallback(() => {
    setSubmitted(true);
    // TODO: kirim ke backend jika ada endpoint submit
  }, []);

  return {
    questions,
    currentIndex,
    answers,
    loading,
    error,
    submitted,
    loadQuestions,
    selectAnswer,
    next,
    prev,
    submit,
  };
};

export default useFinalQuiz;