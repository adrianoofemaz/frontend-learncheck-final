import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Providers/Contexts
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { LearningProvider } from "./context/LearningContext";
import { QuizProvider } from "./context/QuizContext";
import { ProgressProvider } from "./context/ProgressContext";

// Layout
import LayoutWrapper from "./components/Layout/LayoutWrapper";

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
      <UserProvider>
        <ProgressProvider>
          <LearningProvider>
            <QuizProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                {/* Redirect root to home */}
                <Route
                  path="/"
                  element={<Navigate to={ROUTES.HOME} replace />}
                />

                {/* ✅ HOME - ClassDetailPage (dengan Footer) */}
                <Route
                  path={ROUTES.HOME}
                  element={
                    <LayoutWrapper showFooter={true}>
                      <ClassDetailPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ LearningPage - TANPA Footer */}
                <Route
                  path={ROUTES.LEARNING}
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <LearningPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ QuizIntroPage - TANPA Footer */}
                <Route
                  path="/quiz-intro/:tutorialId"
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <QuizIntroPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ QuizPage - TANPA Footer */}
                <Route
                  path="/quiz/:tutorialId"
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <QuizPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ ResultsPage - TANPA Footer */}
                <Route
                  path={ROUTES.QUIZ_RESULTS}
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <ResultsPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ Final Quiz Intro - TANPA Footer */}
                <Route
                  path={ROUTES.QUIZ_FINAL_INTRO}
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <FinalQuizIntroPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ Final Quiz Page - TANPA Footer */}
                <Route
                  path={ROUTES.QUIZ_FINAL}
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <FinalQuizPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ Final Quiz Result - TANPA Footer */}
                <Route
                  path={ROUTES.QUIZ_FINAL_RESULT}
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <FinalQuizResultPage />
                    </LayoutWrapper>
                  }
                />

                {/* ✅ Dashboard Modul - TANPA Footer */}
                <Route
                  path={ROUTES.DASHBOARD_MODUL}
                  element={
                    <LayoutWrapper showFooter={false} showBottomNav={false}>
                      <DashboardModulPage />
                    </LayoutWrapper>
                  }
                />

                {/* 404 - Not Found */}
                <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
              </Routes>
            </QuizProvider>
          </LearningProvider>
        </ProgressProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
