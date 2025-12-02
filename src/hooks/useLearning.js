/**
 * useLearning Hook
 * Handle tutorial/learning materials
 */

import { useState, useCallback, useEffect } from 'react';
import tutorialService from '../services/tutorialService';

export const useLearning = () => {
  const [modules, setModules] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all modules (statis)
   */
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService.getModules();
      console.log('Modules response:', response);
      setModules(response || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError(err.message || 'Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch tutorials for a specific module
   * @param {number} moduleId - Module ID (e.g., 9 untuk "Belajar Dasar AI")
   */
  const fetchTutorials = useCallback(async (moduleId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching tutorials for moduleId:', moduleId);
      
      const response = await tutorialService.getTutorials(moduleId);
      console.log('Full Tutorial response:', response);
      console.log('Response type:', typeof response);
      console.log('Is Array?', Array.isArray(response));

      if (Array.isArray(response)) {
        setTutorials(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setTutorials(response.data);
      } else if (response?.tutorials && Array.isArray(response. tutorials)) {
        setTutorials(response.tutorials);
      } else if (response?.data?.tutorials && Array.isArray(response.data. tutorials)) {
        setTutorials(response.data.tutorials);
      } else {
        console.error('Cannot find tutorials array in response:', response);
        setTutorials([]);
      }
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(err.message || 'Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select tutorial dari tutorials array (TIDAK fetch ulang!)
   * @param {number} tutorialId - Tutorial ID
   */
  const selectTutorial = useCallback((tutorialId) => {
    const tutorial = tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      setCurrentTutorial(tutorial);
      console.log('Selected tutorial:', tutorial);
      return tutorial;
    } else {
      console.warn('Tutorial tidak ditemukan di array:', tutorialId);
      setCurrentTutorial(null);
      return null;
    }
  }, [tutorials]);

  /**
   * Fetch tutorial detail by ID (HANYA sebagai fallback)
   */
  const fetchTutorialDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Coba cari dari tutorials array dulu
      const tutorial = tutorials. find(t => t.id === id);
      if (tutorial) {
        setCurrentTutorial(tutorial);
        console.log('Found tutorial in array:', tutorial);
        return tutorial;
      }

      // Kalau tidak ada, baru fetch dari backend (fallback)
      console.log('Tutorial not in array, fetching from backend...');
      const response = await tutorialService.getTutorialDetail(id);
      console.log('Tutorial detail response:', response);
      
      setCurrentTutorial(response);
      return response;
    } catch (err) {
      console.error('Error fetching tutorial detail:', err);
      setError(err. message || 'Failed to fetch tutorial');
    } finally {
      setLoading(false);
    }
  }, [tutorials]);

  // Fetch modules on mount
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    tutorials,
    currentTutorial,
    loading,
    error,
    fetchModules,
    fetchTutorials,
    fetchTutorialDetail,
    selectTutorial,
  };
};

export default useLearning;