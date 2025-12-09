import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
// HAPUS useQuiz import
// import { useQuiz } from "../hooks/useQuiz";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import LearningLayout from "../layouts/LearningLayout";

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();

  // HAPUS penggunaan useQuiz
  // const { questions, loading: quizLoading, error: quizError, fetchQuestions } = useQuiz();
  const { tutorials, currentTutorial, selectTutorial, fetchTutorials, loading: learningLoading } = useLearning();
  const { getTutorialProgress } = useProgress();

  const [showError, setShowError] = useState(false);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);

  const loading = learningLoading; // hanya loading learning
  const quizError = null; // tidak ada error quiz di intro

  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      const parsedId = parseInt(tutorialId, 10);
      if (!isNaN(parsedId)) {
        fetchTutorials(1);
        setTutorialsFetched(true);
      }
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  useEffect(() => {
    if (tutorialId && tutorials.length > 0) {
      const parsedId = parseInt(tutorialId, 10);
      if (!isNaN(parsedId)) {
        selectTutorial(parsedId).catch((err) => console.error("Error selecting tutorial:", err));
      }
    }
  }, [tutorialId, tutorials, selectTutorial]);

  // Gunakan nilai statis (atau jika punya metadata lain bisa ganti di sini)
  const totalQuestions = 3;
  const timePerQuestion = 30;

  const submodNumber = useMemo(() => {
    if (!currentTutorial || !tutorials?.length) return null;
    const idx = tutorials.findIndex((t) => t.id === currentTutorial.id);
    return idx >= 0 ? idx + 1 : null;
  }, [currentTutorial, tutorials]);

  const submodLabel = submodNumber
    ? `Quiz Submodul ${submodNumber}: ${currentTutorial?.title || ""}`
    : currentTutorial?.title || "Quiz Submodul";

  const handleStartQuiz = () => {
    if (tutorialId) navigate(`/quiz/${tutorialId}`);
    else console.error("Tutorial ID tidak ditemukan");
  };

  const getSavedResult = (id) => {
    try {
      const raw = localStorage.getItem(`quiz-progress-${id}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.completed && parsed?.result) return parsed.result;
      return null;
    } catch {
      return null;
    }
  };

  const handleSelectTutorial = (id) => {
    navigate(`/learning/${id}`);
  };

  const handleSelectQuiz = (id) => {
    const saved = getSavedResult(id);
    if (saved) navigate("/quiz-results", { state: { result: saved } });
    else navigate(`/quiz-intro/${id}`);
  };

  const goBack = () => {
    const currentId = tutorialId ? parseInt(tutorialId, 10) : null;
    const saved = currentId ? getSavedResult(currentId) : null;

    // Jika ada hasil tersimpan, buka halaman hasil
    if (saved) {
      navigate("/quiz-results", { state: { result: saved } });
      return;
    }

    // Jika tidak ada hasil, cukup kembali ke submodul ini (atau halaman sebelumnya)
    if (currentId) {
      navigate(`/learning/${currentId}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) return <Loading fullScreen text="Mempersiapkan kuis..." />;

  if (showError || quizError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert
            type="error"
            title="Gagal Memuat Kuis"
            message={quizError || "Terjadi kesalahan saat mempersiapkan kuis"}
          />
          <Button onClick={() => navigate(-1)} variant="primary" className="mt-4 cursor-pointer">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const targetId =
    currentTutorial?.id ||
    (tutorialId ? parseInt(tutorialId, 10) : null) ||
    tutorials?.[0]?.id;

  return (
    <LearningLayout
      tutorials={tutorials}
      currentTutorial={currentTutorial}
      getTutorialProgress={getTutorialProgress}
      onSelectTutorial={handleSelectTutorial}
      onSelectQuiz={handleSelectQuiz}
      onHome={goBack}
      onMarkComplete={() => {}}
      onStartQuiz={handleStartQuiz}
      isCompleted={false}
      showSidebar
      showBottomBar
      showMarkComplete={false}          // Sembunyikan tombol “Tandai Selesai” di Quiz Intro
      activeQuizTutorialId={targetId}
    >
      {/* konten intro tidak berubah */}
      <div className="quiz-intro-wrapper">
        <div className="quiz-hero">
          <div className="quiz-hero-top">
            <div className="window-controls">
              <span className="window-dot dot-red" />
              <span className="window-dot dot-yellow" />
              <span className="window-dot dot-green" />
            </div>
          </div>

          <div className="quiz-hero-body">
            <div className="quiz-pill">Quiz Submodul</div>
            <h1>LearnCheck!</h1>
            <p className="lead">“Let’s have some fun and test your understanding!”</p>

            <div className="quiz-info-card">
              <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">
                {submodLabel}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3">
                  <span className="icon-circle">≡</span>
                  <div>
                    <p className="text-gray-600 text-sm">Jumlah Soal</p>
                    <p className="text-xl font-bold text-gray-900">{totalQuestions} Soal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="icon-circle">⏱</span>
                  <div>
                    <p className="text-gray-600 text-sm">Durasi</p>
                    <p className="text-xl font-bold text-gray-900">
                      {timePerQuestion} detik/soal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button onClick={handleStartQuiz} variant="primary" className="quiz-cta cursor-pointer">
                Mulai Kuis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LearningLayout>
  );
};

export default QuizIntroPage;