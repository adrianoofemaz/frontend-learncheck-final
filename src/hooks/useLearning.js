/**
 * useLearning Hook
 * Handle tutorial/learning materials
 */

import { useState, useCallback, useEffect } from 'react';
import tutorialService from '../services/tutorialService';

export const useLearning = () => {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all tutorials
   */
  const fetchTutorials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService. getTutorials();
      setTutorials(response.data. tutorials || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch tutorial detail by ID
   */
  const fetchTutorialDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService. getTutorialDetail(id);
      setCurrentTutorial({
        id,
        ... response. data,
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tutorial');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tutorials on mount
  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  return {
    tutorials,
    currentTutorial,
    loading,
    error,
    fetchTutorials,
    fetchTutorialDetail,
  };
};

export default useLearning;