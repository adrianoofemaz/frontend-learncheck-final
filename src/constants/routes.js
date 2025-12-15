export const ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login",

  HOME: "/home",
  LEARNING: "/learning/:id",

  QUIZ_INTRO: "/quiz-intro/:tutorialId",
  QUIZ: "/quiz/:tutorialId",
  QUIZ_RESULTS: "/quiz-results/:tutorialId",

  QUIZ_PLAYER: "/quiz-player/:tutorialId",
  QUIZ_RESULTS_PLAYER: "/quiz-results-player/:tutorialId",

  QUIZ_FINAL_INTRO: "/quiz-final-intro",
  QUIZ_FINAL: "/quiz-final",
  QUIZ_FINAL_RESULT: "/quiz-final-result",

  DASHBOARD_MODUL: "/dashboard-modul",

  NOT_FOUND: "*",
};

export default ROUTES;
