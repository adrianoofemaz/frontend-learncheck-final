/**
 * useLearning Hook
 * Handle tutorial/learning materials
 */

import { useState, useCallback, useEffect } from 'react';
import tutorialService from '../services/tutorialService';

export const useLearning = () => {
  const [modules, setModules] = useState([]);
  const [tutorials] = useState([
    { id: 35363, title: 'Penerapan AI dalam Dunia Nyata' },
    { id: 35368, title: 'Pengenalan AI' },
    { id: 35373, title: 'Taksonomi AI' },
    { id: 35378, title: 'AI Workflow' },
    { id: 35383, title: '[Story] Belajar Mempermudah Pekerjaan dengan AI' },
    { id: 35388, title: 'Kriteria Data untuk AI' },
    { id: 35393, title: 'Pengenalan Data' },
    { id: 35398, title: 'Dataset Preparation' },
    { id: 35403, title: 'Model Training' },
    { id: 35408, title: 'Deployment & Monitoring' },
  ]);
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
   * Get MOCK list untuk sidebar navigation
   * @param {number} moduleId - Module ID (e.g., 9 untuk "Belajar Dasar AI")
   */
  // const fetchTutorials = useCallback(async (moduleId) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     console.log('Fetching tutorials for moduleId:', moduleId);
      
  //     const response = await tutorialService.getTutorials(moduleId);
  //     console.log('Tutorials list response:', response);

  //     if (Array.isArray(response)) {
  //       // ✅ SORT by ID ascending (1, 2, 3, ...)
  //       const sortedTutorials = response.sort((a, b) => a.id - b.id);
  //       setTutorials(sortedTutorials);
  //       console.log('Tutorials sorted by ID:', sortedTutorials);
  //     } else {
  //       setTutorials([]);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching tutorials:', err);
  //     setError(err.message || 'Failed to fetch tutorials');
  //     setTutorials([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

   const getTutorialDetail = useCallback(async (tutorialId) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📄 useLearning: Fetching content for tutorial ${tutorialId}...`);
      const tutorial = await tutorialService.getTutorialDetail(tutorialId);
      console.log(tutorial)
      setCurrentTutorial(tutorial.data.tutorial);
      console.log(`✅ useLearning: Tutorial ${tutorialId} content loaded`);
      return tutorial.data.tutorial;
    } catch (err) {
      console.error(`❌ Error fetching tutorial ${tutorialId}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select tutorial - fetch REAL content dari backend
   * @param {number} tutorialId - Tutorial ID
   */
  // const selectTutorial = useCallback(async (tutorialId) => {
  //   // Coba dari array dulu (untuk navigasi cepat)
  //   const tutorial = tutorials.find(t => t.id === tutorialId);
    
  //   if (tutorial && tutorial.content) {
  //     setCurrentTutorial(tutorial);
  //     console.log('Selected tutorial from array:', tutorial);
  //     return tutorial;
  //   }

  //   // Fetch real content dari backend
  //   console.log('Fetching tutorial content for id:', tutorialId);
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const response = await tutorialService.getTutorialDetail(tutorialId);
  //     console.log('Tutorial content loaded:', response);
  //     setCurrentTutorial(response);
  //     return response;
  //   } catch (err) {
  //     console.error('Error fetching tutorial detail:', err);
  //     setError(err.message || 'Failed to fetch tutorial');
  //     setCurrentTutorial(null);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [tutorials]);

  const selectTutorial = useCallback(async (tutorialId) => {
    try {
      console.log(`📋 useLearning: Selecting tutorial ${tutorialId}... `);
      const tutorial = await getTutorialDetail(tutorialId);
      console.log(`✅ useLearning: Tutorial ${tutorialId} selected`);
      // Find dari static list
      if (!tutorial) {
        throw new Error(`Tutorial ${tutorialId} not found`);
      }
      setCurrentTutorial(tutorial);
      // Get content by ID
      
    } catch (err) {
      console.error('Error selecting tutorial:', err);
      setError(err.message);
      throw err;
    }
  }, [tutorials, getTutorialDetail]);

  // ✅ FETCH TUTORIALS (dummy - just return static)
  const fetchTutorials = useCallback(async () => {
    console.log('📋 useLearning: Using static tutorials list');
    return tutorials;
  }, [tutorials]);

//   return {
//     tutorials,
//     currentTutorial,
//     loading,
//     error,
//     fetchTutorials,
//     selectTutorial,
//     getTutorialDetail,
//   };
// };

  /**
   * Fetch tutorial detail by ID (fallback manual)
   */
  const fetchTutorialDetail = useCallback(async (id) => {
    // Coba dari array dulu
    const tutorial = tutorials.find(t => t.id === id);
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
    getTutorialDetail
  };
};

export default useLearning;