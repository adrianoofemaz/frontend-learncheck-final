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

  // Quiz
  QUIZ_INTRO: '/quiz-intro',
  QUIZ: '/quiz',
  QUIZ_RESULTS: '/quiz-results',

  // Not Found
  NOT_FOUND: '*',
};

export default ROUTES;