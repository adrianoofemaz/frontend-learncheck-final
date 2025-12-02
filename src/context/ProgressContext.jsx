/**
 * ProgressContext
 * Manage user learning progress
 */

import React, { createContext, useState, useCallback, useContext } from 'react';
import { STORAGE_KEYS } from '../constants/config';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(
    JSON.parse(sessionStorage. getItem(STORAGE_KEYS.progress)) || {}
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
        // Save to sessionStorage
        sessionStorage.setItem(
          STORAGE_KEYS.progress,
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
      sessionStorage.setItem(
        STORAGE_KEYS.progress,
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
    </ProgressContext.Provider>
  );
};

/**
 * Custom Hook: useProgress
 * Gunakan di komponen manapun untuk akses progress context
 */
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export default ProgressContext;