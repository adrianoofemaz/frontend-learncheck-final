import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { MaterialContent } from "../components/features/learning";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import LearningLayout from "../layouts/LearningLayout";

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTutorial, loading, error, selectTutorial, tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();

  const getSavedResult = (tid) => {
    try {
      const raw = localStorage.getItem(`quiz-progress-${tid}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.completed && parsed?.result) return parsed.result;
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSelectQuiz = (tutorialId) => {
    const saved = getSavedResult(tutorialId);
    if (saved) {
      navigate("/quiz-results", { state: { result: saved } });
    } else {
      navigate(`/quiz-intro/${tutorialId}`);
    }
  };

  const handleStartQuiz = () => {
    // progress hanya dari submit quiz
    if (currentTutorial?.id) navigate(`/quiz-intro/${currentTutorial.id}`);
  };

  const handleSelectTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
  };

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        selectTutorial(parsedId).catch((err) => console.error("Error selecting tutorial:", err));
      }
    }
  }, [id, selectTutorial]);

  const currentIndex = tutorials.findIndex((t) => t.id === currentTutorial?.id);
  const totalModules = tutorials.length;
  const progressPercentage = totalModules > 0 ? ((currentIndex + 1) / totalModules) * 100 : 0;
  const isCompleted = getTutorialProgress(currentTutorial?.id);
  const currentTutorialTitle = tutorials.find((t) => t.id === currentTutorial?.id)?.title || "";

  const firstId = tutorials?.[0]?.id;
   const targetId =
    currentTutorial?.id ||
    (id ? parseInt(id, 10) : null) ||
    tutorials?.[0]?.id;

  const goToLearning = () => {
    if (currentTutorial?.id && firstId && currentTutorial.id === firstId) {
      navigate("/home");
      return;
    }
    if (targetId) navigate(`/learning/${targetId}`);
    else navigate("/home");
  };

  if (loading) return <Loading fullScreen text="Memuat materi..." />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert type="error" title="Terjadi Kesalahan" message={error} />
          <Button onClick={() => navigate("/home")} variant="primary" className="mt-4 cursor-pointer">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  if (!currentTutorial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert
            type="warning"
            title="Materi belum tersedia"
            message="Silakan kembali ke beranda atau pilih submodul lain."
          />
          <Button onClick={() => navigate("/home")} variant="primary" className="mt-4 cursor-pointer">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LearningLayout
      tutorials={tutorials}
      currentTutorial={currentTutorial}
      getTutorialProgress={getTutorialProgress}
      onSelectTutorial={handleSelectTutorial}
      onSelectQuiz={handleSelectQuiz}
      onHome={goToLearning}
      onMarkComplete={() => {}} // tidak memengaruhi lock
      onStartQuiz={handleStartQuiz}
      isCompleted={isCompleted}
      showSidebar
      showBottomBar
    >
      <Card className="mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Belajar Dasar AI</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentTutorialTitle}</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Submodul {currentIndex + 1}/{totalModules}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      <p className="text-sm text-gray-500 mb-6">Belajar / Modul / {currentTutorialTitle}</p>

      <MaterialContent title={currentTutorialTitle} content={currentTutorial.data.content} loading={loading} />
    </LearningLayout>
  );
};

export default LearningPage;