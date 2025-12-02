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
      const response = await tutorialService. getModules();
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
   * Get MOCK list untuk sidebar navigation
   * @param {number} moduleId - Module ID (e. g., 9 untuk "Belajar Dasar AI")
   */
  const fetchTutorials = useCallback(async (moduleId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching tutorials for moduleId:', moduleId);
      
      const response = await tutorialService.getTutorials(moduleId);
      console.log('Tutorials list response:', response);

      if (Array.isArray(response)) {
        setTutorials(response);
      } else {
        setTutorials([]);
      }
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(err.message || 'Failed to fetch tutorials');
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select tutorial - fetch REAL content dari backend
   * @param {number} tutorialId - Tutorial ID
   */
  const selectTutorial = useCallback(async (tutorialId) => {
    // Coba dari array dulu (untuk navigasi cepat)
    const tutorial = tutorials.find(t => t. id === tutorialId);
    
    if (tutorial && tutorial.content) {
      setCurrentTutorial(tutorial);
      console.log('Selected tutorial from array:', tutorial);
      return tutorial;
    }

    // Fetch real content dari backend
    console.log('Fetching tutorial content for id:', tutorialId);
    setLoading(true);
    setError(null);
    
    try {
      const response = await tutorialService.getTutorialDetail(tutorialId);
      console.log('Tutorial content loaded:', response);
      setCurrentTutorial(response);
      return response;
    } catch (err) {
      console.error('Error fetching tutorial detail:', err);
      setError(err.message || 'Failed to fetch tutorial');
      setCurrentTutorial(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [tutorials]);

  /**
   * Fetch tutorial detail by ID (fallback manual)
   */
  const fetchTutorialDetail = useCallback(async (id) => {
    // Coba dari array dulu
    const tutorial = tutorials.find(t => t. id === id);
    if (tutorial && tutorial.content) {
      setCurrentTutorial(tutorial);
      console.log('Found tutorial in array:', tutorial);
      return tutorial;
    }

    // Fallback: fetch dari backend
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService.getTutorialDetail(id);
      console.log('Tutorial detail response:', response);
      setCurrentTutorial(response);
      return response;
    } catch (err) {
      console.error('Error fetching tutorial detail:', err);
      setError(err.message || 'Failed to fetch tutorial');
      return null;
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