/**
 * API Endpoints
 */

export const API_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  USERS: '/users',
  USER_PREFERENCE: '/users/preference',
  TUTORIALS: '/tutorials',
  TUTORIAL_DETAIL: (id) => `/tutorials/${id}`,
  ASSESSMENT: (id) => `/assessment/tutorial/${id}`,
  SUBMIT_ASSESSMENT: (tutorialId, assessmentId) => `/submit/tutorial/${tutorialId}/assessment/${assessmentId}`,
  PROGRESS_RESET: '/progress-reset',
  QUESTIONS_FINAL: '/questions-final', // final quiz (10 soal)
};

export default API_ENDPOINTS;