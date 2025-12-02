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
      const response = await tutorialService.getTutorials();
      console.log('Full Tutorial response:', response);
      console.log('Response type:', typeof response);
      console.log('Is Array?', Array.isArray(response));

      // Check if response is already an array
      if (Array. isArray(response)) {
        setTutorials(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setTutorials(response.data);
      } else if (response?.tutorials && Array.isArray(response.tutorials)) {
        setTutorials(response. tutorials);
      } else if (response?.data?.tutorials && Array.isArray(response.data.tutorials)) {
        setTutorials(response. data.tutorials);
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
   * Fetch tutorial detail by ID
   */
  const fetchTutorialDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService. getTutorialDetail(id);
      console.log('Tutorial detail response:', response);
      
      setCurrentTutorial({
        id,
        ... response.data,
      });
      return response. data;
    } catch (err) {
      console.error('Error fetching tutorial detail:', err);
      setError(err.message || 'Failed to fetch tutorial');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select tutorial (alias for fetchTutorialDetail)
   */
  const selectTutorial = useCallback((id) => {
    return fetchTutorialDetail(id);
  }, [fetchTutorialDetail]);

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
    selectTutorial,
  };
};

export default useLearning;