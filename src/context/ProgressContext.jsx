/**
 * ProgressContext
 * Manage user learning progress
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { APP_CONFIG } from '../constants/config';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(
    JSON.parse(localStorage.getItem(APP_CONFIG.storage.progress)) || {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update progress untuk tutorial tertentu
   */
  const updateTutorialProgress = useCallback((tutorialId, status = true) => {
    try {
      setProgress((prev) => {
        const updated = {
          ...prev,
          [tutorialId]: status,
        };
        // Save to localStorage
        localStorage.setItem(
          APP_CONFIG.storage.progress,
          JSON.stringify(updated)
        );
        return updated;
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * Get progress untuk tutorial tertentu
   */
  const getTutorialProgress = useCallback((tutorialId) => {
    return progress[tutorialId] || false;
  }, [progress]);

  /**
   * Get completed count
   */
  const getCompletedCount = useCallback(() => {
    return Object.values(progress).filter((status) => status === true).length;
  }, [progress]);

  /**
   * Get total count
   */
  const getTotalCount = useCallback(() => {
    return Object.keys(progress).length;
  }, [progress]);

  /**
   * Get completion percentage
   */
  const getCompletionPercentage = useCallback(() => {
    const total = getTotalCount();
    if (total === 0) return 0;
    const completed = getCompletedCount();
    return Math.round((completed / total) * 100);
  }, [getTotalCount, getCompletedCount]);

  /**
   * Reset all progress
   */
  const resetProgress = useCallback(() => {
    try {
      const resetData = {};
      Object.keys(progress). forEach((key) => {
        resetData[key] = false;
      });
      setProgress(resetData);
      localStorage.setItem(
        APP_CONFIG.storage.progress,
        JSON.stringify(resetData)
      );
    } catch (err) {
      setError(err.message);
    }
  }, [progress]);

  const value = {
    progress,
    loading,
    error,
    updateTutorialProgress,
    getTutorialProgress,
    getCompletedCount,
    getTotalCount,
    getCompletionPercentage,
    resetProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext. Provider>
  );
};

export default ProgressContext;