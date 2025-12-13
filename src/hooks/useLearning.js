/**
 * useLearning Hook
 * Handle tutorial/learning materials
 * ✅ FIXED: Tutorial list now matches backend exactly (order matters for navigation)
 */
import { useState, useCallback, useEffect } from 'react';
import tutorialService from '../services/tutorialService';

export const useLearning = () => {
  const [modules, setModules] = useState([]);
  // Urutan diselaraskan dengan backend (gating progress & navigasi)
  const [tutorials] = useState([
    { id: 35363, title: 'Penerapan AI dalam Dunia Nyata' },
    { id: 35368, title: 'Pengenalan AI' },
    { id: 35373, title: 'Taksonomi AI' },
    { id: 35378, title: 'AI Workflow' },
    { id: 35383, title: '[Story] Belajar Mempermudah Pekerjaan dengan AI' },
    { id: 35398, title: 'Pengenalan Data' },
    { id: 35403, title: 'Kriteria Data untuk AI' },
    { id: 35408, title: '[Story] Apa yang Diperlukan untuk Membuat AI?' },
    { id: 35428, title: 'Tipe-Tipe Machine Learning' },
    { id: 35793, title: 'Infrastruktur Data di Industri' },
  ]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getTutorialDetail = useCallback(async (tutorialId) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📄 useLearning: Fetching content for tutorial ${tutorialId}...`);
      const tutorial = await tutorialService.getTutorialDetail(tutorialId);

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
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectTutorial = useCallback(
    async (tutorialId) => {
      console.log(`📋 useLearning: Selecting tutorial ${tutorialId}...`);
      const tutorial = await getTutorialDetail(tutorialId);
      if (!tutorial) return null;
      console.log(`✅ useLearning: Tutorial ${tutorialId} selected`);
      setCurrentTutorial(tutorial);
      return tutorial;
    },
    [getTutorialDetail]
  );

  const fetchTutorials = useCallback(async () => {
    console.log('📋 useLearning: Using static tutorials list');
    return tutorials;
  }, [tutorials]);

  const fetchTutorialDetail = useCallback(
    async (id) => {
      const tutorial = tutorials.find((t) => t.id === id);
      if (tutorial && tutorial.content) {
        setCurrentTutorial(tutorial);
        console.log('Found tutorial in array:', tutorial);
        return tutorial;
      }

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