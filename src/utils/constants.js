// Routes
export const ROUTES = {
  HOME: '/',
  MATERIAL: '/material',
  QUIZ_INTRO: '/quiz-intro',
  LOADING: '/loading',
  QUIZ: '/quiz',
  RESULTS: '/results'
};

// Colors
export const COLORS = {
  PRIMARY: '#1d4ed8',
  SUCCESS: '#16a34a',
  ERROR: '#dc2626',
  WARNING: '#ea580c',
  INFO: '#0ea5e9',
  NEUTRAL: '#6b7280'
};

// Quiz Settings
export const QUIZ_SETTINGS = {
  DEFAULT_DURATION_PER_QUESTION: 30, // seconds
  DEFAULT_QUESTIONS_COUNT: 3,
  AUTO_NEXT_DELAY: 1500 // ms
};

// Storage Keys
export const STORAGE_KEYS = {
  QUIZ_STATE: 'quiz_state_',
  LEARNING_PROGRESS: 'learning_progress_',
  USER_DATA: 'user_data_'
};

export default {
  ROUTES,
  COLORS,
  QUIZ_SETTINGS,
  STORAGE_KEYS
};