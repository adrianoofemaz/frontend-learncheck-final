// Progress Tracker - localStorage management (ready for database migration)
// For now uses localStorage, but structure is ready for API calls

const PROGRESS_KEY = 'learningProgress';
const DEFAULT_SUBMODULE = 1;

// Initialize default progress structure
const defaultProgress = {
  currentSubmodule: DEFAULT_SUBMODULE,
  submodules: {
    1: {
      id: 1,
      title: 'Penerangan AI dalam Dunia Nyata',
      status: 'not_started', // not_started, in_progress, completed
      materialViewed: false,
      quizStarted: false,
      quizCompleted: false,
      score: null,
      timestamp: null
    }
  }
};

/**
 * Get current progress from localStorage
 * @returns {Object} Progress object
 */
export const getProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) {
      return defaultProgress;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading progress:', error);
    return defaultProgress;
  }
};

/**
 * Save progress to localStorage
 * @param {Object} progress - Progress object to save
 */
export const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    console.log('Progress saved:', progress);
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

/**
 * Update specific submodule progress
 * @param {number} submoduleId - Submodule ID
 * @param {Object} updates - Fields to update
 */
export const updateSubmoduleProgress = (submoduleId, updates) => {
  const progress = getProgress();
  
  if (!progress.submodules[submoduleId]) {
    progress.submodules[submoduleId] = {
      id: submoduleId,
      title: `Submodul ${submoduleId}`,
      status: 'not_started',
      materialViewed: false,
      quizStarted: false,
      quizCompleted: false,
      score: null,
      timestamp: null
    };
  }

  progress.submodules[submoduleId] = {
    ...progress.submodules[submoduleId],
    ...updates,
    timestamp: new Date().toISOString()
  };

  saveProgress(progress);
  return progress;
};

/**
 * Get current submodule
 * @returns {number} Current submodule ID
 */
export const getCurrentSubmodule = () => {
  const progress = getProgress();
  return progress.currentSubmodule;
};

/**
 * Set current submodule
 * @param {number} submoduleId - Submodule ID to set as current
 */
export const setCurrentSubmodule = (submoduleId) => {
  const progress = getProgress();
  progress.currentSubmodule = submoduleId;
  saveProgress(progress);
};

/**
 * Mark material as viewed
 * @param {number} submoduleId - Submodule ID
 */
export const markMaterialViewed = (submoduleId) => {
  return updateSubmoduleProgress(submoduleId, {
    materialViewed: true,
    status: 'in_progress'
  });
};

/**
 * Mark quiz as started
 * @param {number} submoduleId - Submodule ID
 */
export const markQuizStarted = (submoduleId) => {
  return updateSubmoduleProgress(submoduleId, {
    quizStarted: true,
    status: 'in_progress'
  });
};

/**
 * Mark quiz as completed
 * @param {number} submoduleId - Submodule ID
 * @param {number} score - Quiz score (percentage)
 */
export const markQuizCompleted = (submoduleId, score) => {
  return updateSubmoduleProgress(submoduleId, {
    quizCompleted: true,
    score: score,
    status: 'completed'
  });
};

/**
 * Get submodule progress
 * @param {number} submoduleId - Submodule ID
 * @returns {Object|null} Submodule progress or null
 */
export const getSubmoduleProgress = (submoduleId) => {
  const progress = getProgress();
  return progress. submodules[submoduleId] || null;
};

/**
 * Clear all progress (for reset/logout)
 */
export const clearProgress = () => {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    console.log('Progress cleared');
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
};

/**
 * Check if submodule is completed
 * @param {number} submoduleId - Submodule ID
 * @returns {boolean}
 */
export const isSubmoduleCompleted = (submoduleId) => {
  const progress = getSubmoduleProgress(submoduleId);
  return progress ? progress. status === 'completed' : false;
};

export default {
  getProgress,
  saveProgress,
  updateSubmoduleProgress,
  getCurrentSubmodule,
  setCurrentSubmodule,
  markMaterialViewed,
  markQuizStarted,
  markQuizCompleted,
  getSubmoduleProgress,
  clearProgress,
  isSubmoduleCompleted
};