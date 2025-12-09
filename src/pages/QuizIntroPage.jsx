/**
 * QuizIntroPage
 */
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useQuiz } from "../hooks/useQuiz";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import { UserContext } from "../context/UserContext";

// ============ SIDEBAR COMPONENT (SAME AS LEARNING PAGE) ============
const ModuleSidebar = ({
  tutorials,
  currentTutorial,
  getTutorialProgress,
  onSelectTutorial,
  isOpen,
  onClose,
}) => {
  const getStatusColor = (tutorialId, isCompleted) => {
    if (isCompleted) return "text-green-500";
    if (currentTutorial?.id === tutorialId) return "text-blue-600";
    return "text-gray-400";
  };

  const getStatusIcon = (isCompleted, isCurrent) => {
    if (isCompleted) return "✓";
    if (isCurrent) return "▶";
    return "○";
  };

  const { preferences } = useContext(UserContext);

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute ${
          isOpen
            ? "rounded-full translate-x-8"
            : "rounded-l-full translate-x-78"
        } p-2 bg-blue-900 w-8 z-100 top-20 right-76 transform transition-transform duration-300 ease-in-out text-gray-500 hover:text-gray-700 text-2xl`}
      >
        {isOpen ? (
          <ChevronRightIcon color="white" />
        ) : (
          <ChevronLeftIcon color="white" />
        )}
      </div>

      {/* ✅ OVERLAY - close sidebar when click outside (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ✅ SIDEBAR - Fixed on mobile, sticky on desktop */}
      <div
        className={`fixed h-full top-0 right-0 w-80 pt-32 px-6 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out 
    ${
      preferences?.theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    }
    ${isOpen ? "translate-x-0" : "translate-x-120"}`}
      >
        <div className="mb-2 lg:pt-10 pt-10">
          <h3
            className={`text-lg font-bold text-gray-900${
              preferences?.theme === "dark" ? " text-white" : "text-gray-900"
            }`}
          >
            Daftar Submodul
          </h3>
        </div>

        <div className="space-y-2">
          {tutorials &&
            tutorials.map((tutorial, index) => {
              const isCompleted = getTutorialProgress(tutorial.id);
              const isCurrent = currentTutorial?.id === tutorial.id;

              return (
                <div key={tutorial.id}>
                  <button
                    onClick={() => {
                      onSelectTutorial(tutorial.id);
                      onClose();
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-blue-50 border border-blue-300"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xl font-bold ${getStatusColor(
                          tutorial.id,
                          isCompleted
                        )}`}
                      >
                        {getStatusIcon(isCompleted, isCurrent)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isCurrent
                              ? preferences?.theme === "dark"
                                ? "text-blue-500"
                                : "text-blue-600"
                              : preferences?.theme === "dark"
                              ? "text-blue-300" // Warna gelap di dark mode
                              : "text-gray-900" // Warna terang di light mode
                          }`}
                        >
                          {tutorial.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isCompleted
                            ? "Selesai"
                            : isCurrent
                            ? "Sedang Dipelajari"
                            : "Belum Dimulai"}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="ml-10 mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isCompleted ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: isCompleted ? "100%" : "0%" }}
                    />
                  </div>

                  {isCurrent && (
                    <button
                      onClick={() => {}}
                      className="w-full text-left px-4 py-2 ml-4 mt-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                    >
                      → Quiz Submodul #{index + 1}
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

// ============ MAIN COMPONENT ============
const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const {
    questions,
    loading: quizLoading,
    error: quizError,
    fetchQuestions,
  } = useQuiz();
  const {
    tutorials,
    currentTutorial,
    selectTutorial,
    fetchTutorials,
    loading: learningLoading,
  } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [showError, setShowError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);

  const loading = quizLoading || learningLoading;
  const error = quizError;

  // ✅ FETCH tutorials pada mount
  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      const parsedId = parseInt(tutorialId);
      if (!isNaN(parsedId)) {
        fetchTutorials(1); // Module ID 1
        setTutorialsFetched(true);
      }
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  // ✅ SELECT current tutorial
  useEffect(() => {
    if (tutorialId && tutorials.length > 0) {
      const parsedId = parseInt(tutorialId);
      if (!isNaN(parsedId)) {
        selectTutorial(parsedId).catch((err) => {
          console.error("Error selecting tutorial:", err);
        });
      }
    }
  }, [tutorialId, tutorials, selectTutorial]);

  // ✅ FETCH questions untuk tau jumlah soal
  useEffect(() => {
    if (tutorialId) {
      fetchQuestions(parseInt(tutorialId)).catch((err) => {
        console.error("Error fetching questions:", err);
        setShowError(true);
      });
    }
  }, [tutorialId, fetchQuestions]);

  const handleStartQuiz = () => {
    if (tutorialId) {
      navigate(`/quiz/${tutorialId}`);
    } else {
      console.error("Tutorial ID tidak ditemukan");
    }
  };

  const setSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectTutorial = (id) => {
    navigate(`/quiz-intro/${id}`);
  };

  if (loading) {
    return <Loading fullScreen text="Mempersiapkan kuis..." />;
  }

  if (showError || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert
            type="error"
            title="Gagal Memuat Kuis"
            message={error || "Terjadi kesalahan saat mempersiapkan kuis"}
          />
          <Button
            onClick={() => navigate(-1)}
            variant="primary"
            className="mt-4 cursor-pointer"
          >
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  // ✅ GET dari questions array
  const totalQuestions = questions.length || 0;
  const timePerQuestion = 30; // seconds

  return (
    <div className="flex h-screen pt-5 ">
      {/* Main Content - scrollable & responsive */}
      <div
        className={`flex-1 overflow-y-auto pb-24 pt-15 ${
          sidebarOpen ? "pr-48" : ""
        }`}
      >
        <div className="quiz-intro-wrapper">
          <div className="quiz-hero">
            {/* Window dots */}
            <div className="window-controls">
              <span className="window-dot dot-red" />
              <span className="window-dot dot-yellow" />
              <span className="window-dot dot-green" />
            </div>

            {/* Badge */}
            <div className="flex justify-center relative z-20">
              <span className="quiz-badge">Quiz Submodul</span>
            </div>

            {/* Body */}
            <div className="quiz-hero-body">
              <h1>LearnCheck!</h1>
              <p className="lead">
                “Let’s have some fun and test your understanding!”
              </p>

              {/* Info card */}
              <div className="quiz-info-card">
                <h2>{currentTutorial?.title || "Quiz"}</h2>
                <div className="info-rows">
                  <div className="info-row">
                    <span className="icon-circle">≡</span>
                    <div>
                      <p className="text-gray-600 text-sm">Jumlah Soal</p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalQuestions} Soal
                      </p>
                    </div>
                  </div>

                  <div className="info-row">
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

              {/* CTA */}
              <div className="flex justify-center">
                <Button
                  onClick={handleStartQuiz}
                  variant="primary"
                  className="quiz-cta cursor-pointer"
                >
                  Mulai Kuis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ RIGHT SIDEBAR - Same as LearningPage */}
      {tutorials && tutorials.length > 0 && (
        <ModuleSidebar
          tutorials={tutorials}
          currentTutorial={currentTutorial}
          getTutorialProgress={getTutorialProgress}
          onSelectTutorial={handleSelectTutorial}
          isOpen={sidebarOpen}
          onClose={setSidebar}
        />
      )}
    </div>
  );
};

export default QuizIntroPage;
