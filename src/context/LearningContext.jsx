import React, { createContext, useState, useCallback } from 'react';

export const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeSubmoduleId, setActiveSubmoduleId] = useState(null);
  const [submoduleProgress, setSubmoduleProgress] = useState({}); // {submoduleId: 0-100}
  const [completedSubmodules, setCompletedSubmodules] = useState(new Set());

  const selectTopic = useCallback((topicId) => {
    setActiveTopicId(topicId);
    setActiveModuleId(null);
    setActiveSubmoduleId(null);
  }, []);

  const selectModule = useCallback((moduleId) => {
    setActiveModuleId(moduleId);
    setActiveSubmoduleId(null);
  }, []);

  const selectSubmodule = useCallback((submoduleId) => {
    setActiveSubmoduleId(submoduleId);
  }, []);

  const updateSubmoduleProgress = useCallback((submoduleId, progress) => {
    setSubmoduleProgress(prev => ({
      ...prev,
      [submoduleId]: Math.min(100, progress)
    }));

    // Mark as completed jika 100%
    if (progress >= 100) {
      setCompletedSubmodules(prev => new Set([...prev, submoduleId]));
    }
  }, []);

  const markSubmoduleCompleted = useCallback((submoduleId) => {
    setCompletedSubmodules(prev => new Set([...prev, submoduleId]));
    setSubmoduleProgress(prev => ({
      ...prev,
      [submoduleId]: 100
    }));
  }, []);

  const isSubmoduleUnlocked = useCallback((submoduleId) => {
    return completedSubmodules.has(submoduleId);
  }, [completedSubmodules]);

  const value = {
    activeTopicId,
    activeModuleId,
    activeSubmoduleId,
    submoduleProgress,
    completedSubmodules,
    selectTopic,
    selectModule,
    selectSubmodule,
    updateSubmoduleProgress,
    markSubmoduleCompleted,
    isSubmoduleUnlocked
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

export default LearningContext;