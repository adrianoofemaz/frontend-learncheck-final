/**
 * API Endpoints
 */

export const API_ENDPOINTS = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",

  // User
  USERS: "/users",
  USER_PROFILE: "/users",
  USER_PREFERENCES: "/users/preference",

  // Tutorial & Assessment
  TUTORIALS: "/tutorials",
  TUTORIAL_DETAIL: (id) => `/tutorials/${id}`,
  ASSESSMENT: (id) => `/assessment/tutorial/${id}`,
  ASSESSMENT_BY_ID: (assessmentId) => `/assessment/${assessmentId}`,
  SUBMIT_ASSESSMENT: (tutorialId, assessmentId) =>
    `/submit/tutorial/${tutorialId}/assessment/${assessmentId}`,
  PROGRESS_RESET: "/progress-reset",

  // Final Quiz
  QUESTIONS_FINAL: "/questions-final",
  SUBMIT_FINAL_ANSWERS: "/submit-answers",
};

export default API_ENDPOINTS;