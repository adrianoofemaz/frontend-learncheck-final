import React, { createContext, useContext, useState, useEffect } from 'react';
import * as progressTracker from '../utils/progressTracker';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(null);
  const [currentSubmodule, setCurrentSubmodule] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = progressTracker.getProgress();
        setProgress(savedProgress);
        setCurrentSubmodule(savedProgress. currentSubmodule);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Update progress tracker when progress changes
  const updateProgress = (submoduleId, updates) => {
    const updated = progressTracker.updateSubmoduleProgress(submoduleId, updates);
    setProgress(updated);
  };

  const markMaterialViewed = (submoduleId) => {
    const updated = progressTracker.markMaterialViewed(submoduleId);
    setProgress(updated);
  };

  const markQuizStarted = (submoduleId) => {
    const updated = progressTracker.markQuizStarted(submoduleId);
    setProgress(updated);
  };

  const markQuizCompleted = (submoduleId, score) => {
    const updated = progressTracker.markQuizCompleted(submoduleId, score);
    setProgress(updated);
  };

  const switchSubmodule = (submoduleId) => {
    progressTracker.setCurrentSubmodule(submoduleId);
    setCurrentSubmodule(submoduleId);
  };

  const value = {
    progress,
    currentSubmodule,
    loading,
    updateProgress,
    markMaterialViewed,
    markQuizStarted,
    markQuizCompleted,
    switchSubmodule,
    getProgress: progressTracker.getProgress,
    isSubmoduleCompleted: progressTracker.isSubmoduleCompleted
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (! context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export default ProgressContext;