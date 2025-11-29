/**
 * Format waktu dalam detik ke format MM:SS
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Calculate score percentage
 */
export const calculateScorePercentage = (score, total) => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

/**
 * Shuffle array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get stored data from localStorage
 */
export const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Set data to localStorage
 */
export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON. stringify(data));
  } catch (error) {
    console. error('Error writing to localStorage:', error);
  }
};

/**
 * Remove data from localStorage
 */
export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export default {
  formatTime,
  calculateScorePercentage,
  shuffleArray,
  getStoredData,
  setStoredData,
  removeStoredData
};