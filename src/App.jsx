import React from "react";
// HAPUS import BrowserRouter/Router dari sini kalau ada
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Contexts / Providers (jika diperlukan)
import { LearningProvider } from "./context/LearningContext";
import { QuizProvider } from "./context/QuizContext";

// Layout
import LayoutWrapper from "./components/Layout/LayoutWrapper";

// Data
import mockTopics from "./data/mockTopics";

// Pages (hi-dem)
import Learning from "./pages/Learning";
import Quiz from "./pages/Quiz";
import Feedback from "./pages/Feedback";
import QuizIntroPage from "./pages/QuizIntroPage";
import LoadingPage from "./pages/LoadingPage";

// Pages (adrianoofemaz)
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const quiz = mockTopics[0]?.modules?.[0]?.submodules?.[0]?.quiz;

  return (
    // Pastikan App hanya mengandung Routes (TANPA <BrowserRouter> di sini)
    <LearningProvider>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/HomePage" element={<HomePage />} />

          <Route
            path="/results-test"
            element={
              <LayoutWrapper showBottomNav prevLabel="Beranda" prevPath="/" nextLabel="Modul Berikutnya" nextPath="/material">
                <Feedback />
              </LayoutWrapper>
            }
          />

          <Route
            path="/material"
            element={
              <LayoutWrapper showBottomNav prevLabel="Beranda" prevPath="/HomePage" nextLabel="Quiz Submodul" nextPath="/quiz-intro" nextState={{ quiz }} requiresCompletion>
                <Learning />
              </LayoutWrapper>
            }
          />

          <Route path="/quiz-intro" element={
            <LayoutWrapper showBottomNav prevLabel="Penerangan AI" prevPath="/material" nextLabel="Mulai Kuis" nextPath="/loading" nextState={{ quiz }} fixedBackground>
              <QuizIntroPage />
            </LayoutWrapper>
          }/>

          <Route path="/loading" element={
            <LayoutWrapper showBottomNav={false} showSidebar={false} fixedBackground>
              <LoadingPage />
            </LayoutWrapper>
          }/>

          <Route path="/quiz" element={
            <LayoutWrapper showBottomNav={false} showSidebar={false}>
              <Quiz />
            </LayoutWrapper>
          }/>

          <Route path="/results" element={
            <LayoutWrapper showBottomNav prevLabel="Submodul 1" prevPath="/material" nextLabel="Modul Berikutnya" nextPath="/material">
              <Feedback />
            </LayoutWrapper>
          }/>
        </Routes>
      </QuizProvider>
    </LearningProvider>
  );
}

export default App;