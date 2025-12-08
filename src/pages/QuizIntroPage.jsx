import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useQuiz } from '../hooks/useQuiz';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Alert } from '../components/common';

// ============ SIDEBAR COMPONENT ============
const ModuleSidebar = ({ tutorials, currentTutorial, getTutorialProgress, onSelectTutorial, isOpen, onClose }) => {
  const getStatusColor = (tutorialId, isCompleted) => {
    if (isCompleted) return 'text-green-500';
    if (currentTutorial?.id === tutorialId) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getStatusIcon = (isCompleted, isCurrent) => {
    if (isCompleted) return '✓';
    if (isCurrent) return '▶';
    return '○';
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute ${isOpen ? 'rounded-full translate-x-8' : 'rounded-l-full translate-x-78'} p-2 bg-blue-900 w-8 z-100 top-20 right-76 transform transition-transform duration-300 ease-in-out text-gray-500 hover:text-gray-700 text-2xl`}
      >
        {isOpen ? <ChevronRightIcon color="white" /> : <ChevronLeftIcon color="white" />}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed h-full lg:absolute top-0 right-0 w-80 pt-20 bg-white border-l border-gray-200 
          px-6 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-120'
        }`}
      >
        <div className="mb-2 lg:pt-10 pt-10">
          <h3 className="text-lg font-bold text-gray-900">Daftar Submodul</h3>
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
                        ? 'bg-blue-50 border border-blue-300'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${getStatusColor(tutorial.id, isCompleted)}`}>
                        {getStatusIcon(isCompleted, isCurrent)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isCurrent ? 'text-blue-600' : 'text-gray-900'
                          }`}
                        >
                          {tutorial.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isCompleted ? 'Selesai' : isCurrent ? 'Sedang Dipelajari' : 'Belum Dimulai'}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="ml-10 mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: isCompleted ? '100%' : '0%' }}
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
        fetchTutorials(1); // Module ID 1
        setTutorialsFetched(true);
      }
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  useEffect(() => {
    if (tutorialId && tutorials.length > 0) {
      const parsedId = parseInt(tutorialId);
      if (!isNaN(parsedId)) {
        selectTutorial(parsedId).catch((err) => {
          console.error('Error selecting tutorial:', err);
        });
      }
    }
  }, [tutorialId, tutorials, selectTutorial]);

  useEffect(() => {
    if (tutorialId) {
      fetchQuestions(parseInt(tutorialId)).catch((err) => {
        console.error('Error fetching questions:', err);
        setShowError(true);
      });
    }
  }, [tutorialId, fetchQuestions]);

  const totalQuestions = questions.length || 3;
  const timePerQuestion = 30;

  const submodNumber = useMemo(() => {
    if (!currentTutorial || !tutorials?.length) return null;
    const idx = tutorials.findIndex((t) => t.id === currentTutorial.id);
    return idx >= 0 ? idx + 1 : null;
  }, [currentTutorial, tutorials]);

  const submodLabel = submodNumber
    ? `Quiz Submodul ${submodNumber}: ${currentTutorial?.title || ''}`
    : currentTutorial?.title || 'Quiz Submodul';

  const handleStartQuiz = () => {
    if (tutorialId) {
      navigate(`/quiz/${tutorialId}`);
    } else {
      console.error('Tutorial ID tidak ditemukan');
    }
  };

  const handleSelectTutorial = (id) => {
    navigate(`/quiz-intro/${id}`);
  };

  const setSidebar = () => setSidebarOpen(!sidebarOpen);

  // margin-right dinamis agar konten kiri tidak ketutup sidebar; tetap center
  const mainStyle = {
    marginRight: sidebarOpen ? 340 : 0, // lebar sidebar + sedikit gap
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
            message={error || 'Terjadi kesalahan saat mempersiapkan kuis'}
          />
          <Button onClick={() => navigate(-1)} variant="primary" className="mt-4 cursor-pointer">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div
        className="flex-1 overflow-y-auto pb-16 pt-8 px-4 sm:px-6"
        style={mainStyle}
      >
        <div className="quiz-intro-wrapper">
          <div className="quiz-hero">
            {/* Top bar (dots only) */}
            <div className="quiz-hero-top">
              <div className="window-controls">
                <span className="window-dot dot-red" />
                <span className="window-dot dot-yellow" />
                <span className="window-dot dot-green" />
              </div>
            </div>

            {/* Body */}
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
                      <p className="text-xl font-bold text-gray-900">{timePerQuestion} detik/soal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
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