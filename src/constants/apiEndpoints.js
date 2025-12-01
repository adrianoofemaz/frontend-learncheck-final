/**
 * API Endpoints Mapping
 */

export const API_ENDPOINTS = {
  // Health Check
  HEALTH: '/test',

  // Auth
  REGISTER: '/register',
  LOGIN: '/login',

  // User
  USER_PROFILE: '/users',
  USER_PREFERENCES: '/users/preference',

  // Tutorials
  TUTORIALS_LIST: '/tutorials',
  TUTORIAL_DETAIL: '/tutorials/:id',

  // Assessment/Quiz
  QUESTIONS_LIST: '/questions-final',
  SUBMIT_ASSESSMENT: '/submit/tutorial/:tutorialId/assessment/:assessmentId',

  // Progress
  PROGRESS_RESET: '/progress-reset',
};

export default API_ENDPOINTS;