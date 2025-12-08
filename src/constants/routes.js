/**
 * App Routes
 */

export const ROUTES = {
  // Auth
  REGISTER: '/register',
  LOGIN: '/login',

  // Main
  HOME: '/home',
  LEARNING: '/learning/:id',

  // Quiz (submodul)
  QUIZ_INTRO: '/quiz-intro',
  QUIZ: '/quiz',
  QUIZ_RESULTS: '/quiz-results',

  // Quiz Final
  QUIZ_FINAL_INTRO: '/quiz-final-intro',
  QUIZ_FINAL: '/quiz-final',
  QUIZ_FINAL_RESULT: '/quiz-final-result',

  // Dashboard modul (akhir)
  DASHBOARD_MODUL: '/dashboard-modul',

  // Not Found
  NOT_FOUND: '*',
};

export default ROUTES;