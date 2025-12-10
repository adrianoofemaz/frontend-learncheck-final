/**
 * QuizIntroPage (player)
 * Tampilan light sesuai Figma. Sidebar kanan tetap ada.
 */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useQuiz } from "../hooks/useQuiz";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import { UserContext } from "../context/UserContext";

const ModuleSidebar = ({
  tutorials,
  currentTutorial,
  getTutorialProgress,
  onSelectTutorial,
  isOpen,
  onClose,
}) => {
  const { preferences } = useContext(UserContext);

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

  return (
    <>
      <button
        onClick={onClose}
        className={`fixed ${
          isOpen ? "translate-x-8" : "translate-x-20"
        } top-24 right-72 p-2 rounded-full bg-blue-700 shadow-lg z-40 transition`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <ChevronRightIcon className="w-5 h-5 text-white" /> : <ChevronLeftIcon className="w-5 h-5 text-white" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed h-full top-0 right-0 w-80 pt-24 px-6 overflow-y-auto z-20 transition-transform duration-300 ${
          preferences?.theme === "dark"
            ? "bg-gray-800 border-l border-gray-700 text-white"
            : "bg-white border-l border-gray-200 text-gray-900"
        } ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h3 className="text-lg font-bold mb-4">Daftar Submodul</h3>

        <div className="space-y-3 pb-10">
          {tutorials?.map((tutorial, index) => {
            const isCompleted = getTutorialProgress(tutorial.id);
            const isCurrent = currentTutorial?.id === tutorial.id;
            return (
              <div key={tutorial.id}>
                <button
                  onClick={() => {
                    onSelectTutorial(tutorial.id);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    isCurrent
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-50 border-transparent"
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
                          isCurrent ? "text-blue-600" : "text-gray-900"
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

                {isCurrent && (
                  <button
                    onClick={() => {}}
                    className="w-full text-left px-4 py-2 ml-2 mt-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
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

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const { questions, loading: quizLoading, error: quizError, fetchQuestions } = useQuiz();
  const { tutorials, currentTutorial, selectTutorial, fetchTutorials, loading: learningLoading } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [showError, setShowError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);

  const loading = quizLoading || learningLoading;
  const error = quizError;

  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      const parsedId = parseInt(tutorialId);
      if (!isNaN(parsedId)) {
        fetchTutorials(1);
        setTutorialsFetched(true);
      }
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  useEffect(() => {
    if (tutorialId && tutorials.length > 0) {
      const parsedId = parseInt(tutorialId);
      if (!isNaN(parsedId)) {
        selectTutorial(parsedId).catch((err) => console.error("Error selecting tutorial:", err));
      }
    }
  }, [tutorialId, tutorials, selectTutorial]);

  useEffect(() => {
    if (tutorialId) {
      fetchQuestions(parseInt(tutorialId)).catch((err) => {
        console.error("Error fetching questions:", err);
        setShowError(true);
      });
    }
  }, [tutorialId, fetchQuestions]);

  const handleStartQuiz = () => {
    if (!tutorialId) {
      console.error("Tutorial ID tidak ditemukan");
      return;
    }
    // Arahkan ke shell /quiz/:id (iframe)
    navigate(`/quiz/${tutorialId}`);
  };

  const handleSelectTutorial = (id) => navigate(`/quiz-intro/${id}`);

  if (loading) return <Loading fullScreen text="Mempersiapkan kuis..." />;

  if (showError || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert
            type="error"
            title="Gagal Memuat Kuis"
            message={error || "Terjadi kesalahan saat mempersiapkan kuis"}
          />
          <Button onClick={() => navigate(-1)} variant="primary" className="mt-4 cursor-pointer">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length || 0;
  const timePerQuestion = 30;

  return (
    <div className="flex min-h-screen bg-[#f4f7ff]">
      <div className={`flex-1 overflow-y-auto pb-16 pt-8 ${sidebarOpen && !embed ? "pr-80" : ""}`}>
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-12 bg-gradient-to-r from-[#1e7bff] to-[#0f5eff]" />
              <div className="py-6 px-6">
                <div className="flex justify-center mb-4">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full shadow">
                    Quiz Submodul
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                  LearnCheck!
                </h1>
                <p className="text-center text-gray-600 italic mb-6">
                  “Let’s have some fun and test your understanding!”
                </p>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
                  <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
                    {currentTutorial?.title || "Quiz Submodul"}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">
                        ≡
                      </span>
                      <div>
                        <p className="text-sm text-gray-600">Jumlah Soal</p>
                        <p className="text-lg font-bold text-gray-900">{totalQuestions} Soal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">
                        ⏱
                      </span>
                      <div>
                        <p className="text-sm text-gray-600">Durasi</p>
                        <p className="text-lg font-bold text-gray-900">{timePerQuestion} detik/soal</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleStartQuiz} variant="primary" className="px-10 py-3 text-base cursor-pointer">
                    Mulai Kuis
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-6 px-1">
              <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-blue-600 cursor-pointer">
                ‹ Submodul
              </button>
              <span className="text-gray-400">Mulai Kuis ›</span>
            </div>
          </div>
        </div>
      </div>

      {!embed && tutorials?.length > 0 && (
        <ModuleSidebar
          tutorials={tutorials}
          currentTutorial={currentTutorial}
          getTutorialProgress={getTutorialProgress}
          onSelectTutorial={handleSelectTutorial}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen((p) => !p)}
        />
      )}
    </div>
  );
};

export default QuizIntroPage;