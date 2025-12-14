export const ROUTES = {
  // Auth
  REGISTER: "/register",
  LOGIN: "/login",

  // Main
  HOME: "/home",
  LEARNING: "/learning/:id",

  // Quiz (submodul)
  QUIZ_INTRO: "/quiz-intro/:tutorialId",
  QUIZ: "/quiz/:tutorialId",
  QUIZ_RESULTS: "/quiz-results/:tutorialId",

  // Quiz (submodul) player alias (iframe)
  QUIZ_PLAYER: "/quiz-player/:tutorialId",
  QUIZ_RESULTS_PLAYER: "/quiz-results-player/:tutorialId",

  // Quiz Final
  QUIZ_FINAL_INTRO: "/quiz-final-intro",
  QUIZ_FINAL: "/quiz-final",
  QUIZ_FINAL_RESULT: "/quiz-final-result",

  // Dashboard modul (akhir)
  DASHBOARD_MODUL: "/dashboard-modul",

  // Not Found
  NOT_FOUND: "*",
};

export default ROUTES;
