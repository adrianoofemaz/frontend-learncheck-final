/**
 * useLearning Hook
 * Handle tutorial/learning materials
 * ✅ FIXED: Tutorial list now matches backend exactly
 */

import { useState, useCallback, useEffect } from 'react';
import tutorialService from '../services/tutorialService';

export const useLearning = () => {
  const [modules, setModules] = useState([]);
  // ✅ FIXED: Samakan dengan backend tutorials EXACTLY
  const [tutorials] = useState([
    { id: 35363, title: 'Penerapan AI dalam Dunia Nyata' },
    { id: 35368, title: 'Pengenalan AI' },
    { id: 35373, title: 'Taksonomi AI' },
    { id: 35378, title: 'AI Workflow' },
    { id: 35383, title: '[Story] Belajar Mempermudah Pekerjaan dengan AI' },
    { id: 35398, title: 'Pengenalan Data' },
    { id: 35403, title: 'Kriteria Data untuk AI' },
    { id: 35793, title: 'Infrastruktur Data di Industri' },
    { id: 35408, title: '[Story] Apa yang Diperlukan untuk Membuat AI?' },
    { id: 35428, title: 'Tipe-Tipe Machine Learning' },
  ]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all modules
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
   * Get tutorial detail by ID - fetch content on-demand
   * @param {number} tutorialId - Tutorial ID
   */
  const getTutorialDetail = useCallback(async (tutorialId) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📄 useLearning: Fetching content for tutorial ${tutorialId}...`);
      const tutorial = await tutorialService.getTutorialDetail(tutorialId);

      // Fallback jika 404 / null
      if (!tutorial) {
        setCurrentTutorial(null);
        setError(`Materi untuk tutorial ${tutorialId} belum tersedia.`);
        return null;
      }

      setCurrentTutorial(tutorial);
      console.log(`✅ useLearning: Tutorial ${tutorialId} content loaded`);
      return tutorial;
    } catch (err) {
      console.error(`❌ Error fetching tutorial ${tutorialId}:`, err);
      setError(err.message);
      return null; // jangan lempar lagi, biar UI bisa render error
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select tutorial - fetch content from backend
   * @param {number} tutorialId - Tutorial ID
   */
  const selectTutorial = useCallback(
    async (tutorialId) => {
      console.log(`📋 useLearning: Selecting tutorial ${tutorialId}...`);
      const tutorial = await getTutorialDetail(tutorialId);
      if (!tutorial) {
        // error sudah diset di getTutorialDetail
        return null;
      }
      console.log(`✅ useLearning: Tutorial ${tutorialId} selected`);
      setCurrentTutorial(tutorial);
      return tutorial;
    },
    [getTutorialDetail]
  );

  /**
   * Fetch tutorials - just return static list
   */
  const fetchTutorials = useCallback(async () => {
    console.log('📋 useLearning: Using static tutorials list');
    return tutorials;
  }, [tutorials]);

  /**
   * Fetch tutorial detail by ID (fallback manual)
   */
  const fetchTutorialDetail = useCallback(
    async (id) => {
      // Try dari array dulu
      const tutorial = tutorials.find((t) => t.id === id);
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
        if (!response) {
          setError(`Materi untuk tutorial ${id} belum tersedia.`);
          setCurrentTutorial(null);
          return null;
        }
        setCurrentTutorial(response);
        return response;
      } catch (err) {
        console.error('Error fetching tutorial detail:', err);
        setError(err.message || 'Failed to fetch tutorial');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tutorials]
  );

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
    getTutorialDetail,
  };
};

export default useLearning;