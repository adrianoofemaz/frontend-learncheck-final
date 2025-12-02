import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Providers/Contexts
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { LearningProvider } from './context/LearningContext';
import { QuizProvider } from './context/QuizContext';
import { ProgressProvider } from './context/ProgressContext';

// Layout
import LayoutWrapper from './components/layout/LayoutWrapper';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Pages - Main
import HomePage from './pages/HomePage';
import ClassDetailPage from './pages/ClassDetailPage';
import LearningPage from './pages/LearningPage';
import QuizPage from './pages/QuizPage';
import QuizIntroPage from './pages/QuizIntroPage';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Routes
import { ROUTES } from './constants/routes';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ProgressProvider>
          <LearningProvider>
            <QuizProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path={ROUTES.  REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES. LOGIN} element={<LoginPage />} />

                {/* Redirect root to home */}
                <Route path="/" element={<Navigate to={ROUTES. HOME} replace />} />

                {/* Main Routes */}
                {/* HomePage - List Kelas */}
                <Route
                  path={ROUTES. HOME}
                  element={
                    <LayoutWrapper>
                      <HomePage />
                    </LayoutWrapper>
                  }
                />

                {/* ClassDetailPage - Detail Kelas + Hero + Silabus + Deskripsi */}
                <Route
                  path="/class/:classId"
                  element={
                    <LayoutWrapper>
                      <ClassDetailPage />
                    </LayoutWrapper>
                  }
                />

                {/* LearningPage - Baca Materi */}
                <Route
                  path={ROUTES. LEARNING}
                  element={
                    <LayoutWrapper showBottomNav>
                      <LearningPage />
                    </LayoutWrapper>
                  }
                />

                {/* QuizIntroPage - Info Kuis */}
                <Route
                  path="/quiz-intro/:tutorialId"
                  element={
                    <LayoutWrapper showBottomNav>
                      <QuizIntroPage />
                    </LayoutWrapper>
                  }
                />

                {/* QuizPage - Jawab Soal */}
                <Route
                  path="/quiz/:tutorialId"
                  element={
                    <LayoutWrapper showBottomNav={false} showSidebar={false}>
                      <QuizPage />
                    </LayoutWrapper>
                  }
                />

                {/* ResultsPage - Hasil Quiz */}
                <Route
                  path={ROUTES. QUIZ_RESULTS}
                  element={
                    <LayoutWrapper showBottomNav>
                      <ResultsPage />
                    </LayoutWrapper>
                  }
                />

                {/* 404 - Not Found */}
                <Route path={ROUTES. NOT_FOUND} element={<NotFoundPage />} />
              </Routes>
            </QuizProvider>
          </LearningProvider>
        </ProgressProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;