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
    // Reset state sebelum fetch
    setLoading(true);
    setError(null);
    setQuestions([]);
    setAssessmentId(null);

    try {
      console.log('Fetching questions for tutorial:', tutorialId);
      
      const response = await quizService.getQuestions(tutorialId);
      console.log('Questions response:', response);

      // Validasi response
      if (!response) {
        throw new Error('No response from server');
      }

      // Cek apakah ada data questions
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('No questions data in response');
        setError('Pertanyaan belum tersedia untuk submodul ini.');
        return { data: [], assessment_id: null };
      }

      // Batasi soal submodul ke 3 pertama (sisanya untuk final)
      const questionsData = response.data.slice(0, 3);
      const assmtId = response.assessment_id || null;

      if (questionsData.length === 0) {
        setError('Tidak ada soal yang tersedia untuk submodul ini.');
      }

      setQuestions(questionsData);
      setAssessmentId(assmtId);

      return response;

    } catch (err) {
      console.error("Error fetching questions:", err);
      
      // Handle berbagai tipe error
      let friendlyMessage = 'Pertanyaan belum tersedia untuk submodul ini.';
      
      if (err.response) {
        // Error dari server (4xx, 5xx)
        const status = err.response.status;
        
        if (status === 404) {
          friendlyMessage = 'Soal quiz tidak ditemukan untuk submodul ini.';
        } else if (status === 500) {
          friendlyMessage = 'Terjadi kesalahan di server. Silakan coba lagi nanti.';
        } else if (status >= 400 && status < 500) {
          friendlyMessage = err.response.data?.message || 'Permintaan tidak valid.';
        } else {
          friendlyMessage = 'Terjadi kesalahan saat mengambil soal.';
        }
      } else if (err.request) {
        // Request dibuat tapi tidak ada response
        friendlyMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        // Error lain
        friendlyMessage = err.message || 'Terjadi kesalahan yang tidak diketahui.';
      }

      setError(friendlyMessage);
      setQuestions([]);
      setAssessmentId(null);
      
      // Return null tapi jangan throw agar caller tidak crash
      return null;

    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Set mock questions (fallback offline)
   */
  const setMockQuestions = useCallback((mockQs = [], mockAssessmentId = 'mock') => {
    setQuestions(mockQs);
    setAssessmentId(mockAssessmentId);
    setError(null);
  }, []);

  /**
   * Submit quiz answers
   * @param {number} tutorialId - Tutorial ID
   * @param {number} assmtId - Assessment ID
   * @param {Array} answers - User answers
   */
  const submitAnswers = useCallback(async (tutorialId, assmtId, answers) => {
    setSubmitLoading(true);
    setError(null);

    try {
      console.log('Submitting answers:', { 
        tutorialId, 
        assessmentId: assmtId, 
        answers 
      });

      // Validasi input
      if (!tutorialId || !assmtId) {
        throw new Error('Tutorial ID atau Assessment ID tidak valid');
      }

      if (!answers || answers.length === 0) {
        throw new Error('Tidak ada jawaban yang dikirim');
      }

      const response = await quizService.submitAnswers(tutorialId, assmtId, answers);
      console.log('Submit response:', response);

      if (!response) {
        throw new Error('Tidak ada response dari server');
      }

      return response;

    } catch (err) {
      console.error('Error submitting answers:', err);
      
      let errorMessage = 'Gagal mengirim jawaban';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Error ${err.response.status}: Gagal mengirim jawaban`;
      } else if (err.request) {
        errorMessage = 'Tidak dapat terhubung ke server';
      } else {
        errorMessage = err.message || 'Terjadi kesalahan saat mengirim jawaban';
      }

      setError(errorMessage);
      throw new Error(errorMessage);

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

      if (!response) {
        throw new Error('Tidak ada response dari server');
      }

      // Reset local state juga
      setQuestions([]);
      setAssessmentId(null);

      return response;

    } catch (err) {
      console.error('Error resetting progress:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Gagal mereset progress';
      
      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error manually
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    questions,
    loading,
    error,
    submitLoading,
    assessmentId,
    
    // Actions
    fetchQuestions,
    submitAnswers,
    resetProgress,
    clearError,
    setMockQuestions, // <-- baru
  };
};

export default useQuiz;