/**
 * Validate answer selection
 */
export const isValidAnswer = (answer) => {
  return answer !== null && answer !== undefined && answer !== '';
};

/**
 * Validate quiz submission
 */
export const isQuizComplete = (answers, totalQuestions) => {
  const answeredCount = Object.keys(answers).length;
  return answeredCount === totalQuestions;
};

/**
 * Validate scroll progress
 */
export const isContentScrolled = (progress, minProgress = 90) => {
  return progress >= minProgress;
};

export default {
  isValidAnswer,
  isQuizComplete,
  isContentScrolled
};