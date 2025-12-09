/**
 * LearningPage
 * ✅ Keep: Working backend + content
 * ✅ Add: Sticky top bar + Card wrapper + Dynamic titles
 * ✅ Fix: Full background + Dynamic title per submodul
 */

import { use, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { MaterialContent } from "../components/features/learning";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../context/UserContext";

// ============ SIDEBAR COMPONENT ============

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
        } p-2 bg-blue-900 w-8 z-100 top-20 right-76 transform transition-transform duration-300 ease-in-out text-gray-500 hover:text-gray-700 text-2xl cursor-pointer`}
      >
        {isOpen ? (
          <ChevronRightIcon color="white" />
        ) : (
          <ChevronLeftIcon color="white" />
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* ini sidebar */}
      <div
        className={`fixed h-full top-0 right-0 w-80 pt-32 px-6 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out 
    ${
      preferences?.theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    }
    ${isOpen ? "translate-x-0" : "translate-x-120"}`}
      >
        <div className="mb-2 pt-8 lg:pt-0">
          <h3
            className={`text-lg font-bold text-gray-900${
              preferences?.theme === "dark" ? " text-white" : "text-gray-900"
            }`}
          >
            Daftar Submodul
          </h3>
        </div>

        <div className="space-y-2 h-screen ">
          {tutorials.map((tutorial, index) => {
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
                      : "hover:bg-gray-100 border border-transparent"
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

// ============ BOTTOM NAVIGATION BAR ============

const BottomNavigationBar = ({
  onHome,
  onMarkComplete,
  onStartQuiz,
  isCompleted,
  onToggleSidebar,
}) => {
  const { preferences } = useContext(UserContext);
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t  px-8 py-4 z-20 
    ${
      preferences.theme === "dark"
        ? "bg-gray-900 border-gray-700"
        : "bg-white border-gray-200"
    }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button
          onClick={onHome}
          variant="secondary"
          className="flex items-center gap-2 cursor-pointer"
        >
          ← Beranda
        </Button>

        <div className="flex gap-4">
          {!isCompleted && (
            <Button
              onClick={onMarkComplete}
              variant="secondary"
              className="cursor-pointer"
            >
              ✓ Tandai Selesai
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Button
            onClick={onStartQuiz}
            variant="primary"
            className="flex items-center gap-2 cursor-pointer"
          >
            ▶️ Mulai Quiz →
          </Button>

          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            title="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // ✅ KEEP: selectTutorial (working backend)
  const { currentTutorial, loading, error, selectTutorial, tutorials } =
    useLearning();
  const { updateTutorialProgress, getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const setSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ============ HANDLERS ============
  const handleMarkComplete = () => {
    if (currentTutorial) {
      updateTutorialProgress(currentTutorial.id, true);
    }
  };

  const handleStartQuiz = () => {
    handleMarkComplete();
    if (currentTutorial?.id) {
      navigate(`/quiz-intro/${currentTutorial.id}`);
    }
  };

  const handleSelectTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
  };

  // ============ EFFECTS ============
  // ✅ KEEP: selectTutorial logic
  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id);
      if (!isNaN(parsedId)) {
        selectTutorial(parsedId).catch((err) => {
          console.error("Error selecting tutorial:", err);
        });
      }
    }
  }, [id, selectTutorial]);

  // ============ STATE CALCULATIONS ============
  const currentIndex = tutorials.findIndex((t) => t.id === currentTutorial?.id);
  const totalModules = tutorials.length;
  const progressPercentage =
    totalModules > 0 ? ((currentIndex + 1) / totalModules) * 100 : 0;
  const isCompleted = getTutorialProgress(currentTutorial?.id);

  // ✅ DYNAMIC: Static title dari tutorials array (berubah per submodul)
  const currentTutorialTitle =
    tutorials.find((t) => t.id === currentTutorial?.id)?.title || "";

  // ============ RENDER - LOADING ============
  if (loading) {
    return <Loading fullScreen text="Memuat materi..." />;
  }

  // ============ RENDER - ERROR (termasuk 404 -> message set di hook) ============
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert type="error" title="Terjadi Kesalahan" message={error} />
          <Button
            onClick={() => navigate("/home")}
            variant="primary"
            className="mt-4 cursor-pointer"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  // ============ RENDER - NO DATA ============
  if (!currentTutorial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert
            type="warning"
            title="Materi belum tersedia"
            message="Silakan kembali ke beranda atau pilih submodul lain."
          />
          <Button
            onClick={() => navigate("/home")}
            variant="primary"
            className="mt-4 cursor-pointer"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  // ============ RENDER - SUCCESS ============
  const { preferences } = useContext(UserContext);
  return (
    <div className="flex h-screen">
      {/* Main Content - with top and bottom padding for fixed bars */}
      <div
        className={`flex-1 overflow-y-auto pt-20 pb-24 min-h-screen ${
          sidebarOpen ? "pr-80" : ""
        } transition-all duration-300`}
      >
        <div className="max-w-4xl mx-auto px-8 ">
          {/* ✅ HEADER IN CARD */}
          <Card
            className={`mb-8 rounded-md ${
              preferences?.theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            shadow="md"
            padding="lg"
            bordered
          >
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-blue-600 mb-2">
                Belajar Dasar AI
              </h1>
              {/* ✅ DYNAMIC TITLE: Berubah sesuai submodul (Penerapan AI, Pengenalan AI, dll) */}
              <h2
                className={`text-2xl font-medium mb-4 ${
                  preferences?.theme === "dark"
                    ? "text-gray-100"
                    : "text-gray-900"
                }`}
              >
                {currentTutorialTitle}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    preferences?.theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
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

          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 mb-6">
            Belajar / Modul / {currentTutorialTitle}
          </p>

          {/* ✅ CONTENT: Working with correct path */}
          <MaterialContent
            title={currentTutorialTitle}
            content={currentTutorial.data.content}
            loading={loading}
          />
        </div>
      </div>

      {/* ✅ RIGHT SIDEBAR */}
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

      {/* ✅ BOTTOM NAVIGATION BAR */}
      <BottomNavigationBar
        onHome={() => navigate("/home")}
        onMarkComplete={handleMarkComplete}
        onStartQuiz={handleStartQuiz}
        isCompleted={isCompleted}
        onToggleSidebar={setSidebar}
      />
    </div>
  );
};

export default LearningPage;
