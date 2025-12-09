import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Providers/Contexts
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { LearningProvider } from "./context/LearningContext";
import { QuizProvider } from "./context/QuizContext";
import { ProgressProvider } from "./context/ProgressContext";

// Layouts baru
import MainLayout from "./layouts/MainLayout";
import LearningLayout from "./layouts/LearningLayout"
import QuizLayout from "./layouts/QuizLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages - Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Pages - Main
import ClassDetailPage from "./pages/ClassDetailPage";
import LearningPage from "./pages/LearningPage";
import QuizPage from "./pages/QuizPage";
import QuizIntroPage from "./pages/QuizIntroPage";
import ResultsPage from "./pages/ResultsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Pages - Final Quiz & Dashboard Modul
import FinalQuizIntroPage from "./pages/FinalQuizIntroPage";
import FinalQuizPage from "./pages/FinalQuizPage";
import FinalQuizResultPage from "./pages/FinalQuizResultPage";
import DashboardModulPage from "./pages/DashboardModulPage";

// Routes
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <AuthProvider>
         <ProgressProvider>
          <UserProvider>
          <LearningProvider>
            <QuizProvider>
              <Routes>
                {/* Auth */}
                <Route
                  path={ROUTES.REGISTER}
                  element={
                    <AuthLayout>
                      <RegisterPage />
                    </AuthLayout>
                  }
                />
                <Route
                  path={ROUTES.LOGIN}
                  element={
                    <AuthLayout>
                      <LoginPage />
                    </AuthLayout>
                  }
                />

                {/* Redirect root */}
                <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />

                {/* Home (Navbar + Footer) */}
                <Route
                  path={ROUTES.HOME}
                  element={
                    <MainLayout>
                      <ClassDetailPage />
                    </MainLayout>
                  }
                />

                {/* Learning flow (sidebar + bottom bar) */}
                <Route path={ROUTES.LEARNING} element={<LearningPage />} />
                <Route path="/quiz-intro/:tutorialId" element={<QuizIntroPage />} />
                <Route path={ROUTES.QUIZ_RESULTS} element={<ResultsPage />} />
                <Route path={ROUTES.DASHBOARD_MODUL} element={<DashboardModulPage />} />
                <Route path={ROUTES.QUIZ_FINAL_INTRO} element={<FinalQuizIntroPage />} />
                <Route path={ROUTES.QUIZ_FINAL_RESULT} element={<FinalQuizResultPage />} />

                {/* Quiz pages (Navbar only) */}
                <Route
                  path="/quiz/:tutorialId"
                  element={
                    <QuizLayout>
                      <QuizPage />
                    </QuizLayout>
                  }
                />
                <Route
                  path={ROUTES.QUIZ_FINAL}
                  element={
                    <QuizLayout>
                      <FinalQuizPage />
                    </QuizLayout>
                  }
                />

                {/* 404 */}
                <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
              </Routes>
            </QuizProvider>
          </LearningProvider>
        </UserProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;