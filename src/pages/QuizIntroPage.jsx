/**
 * QuizIntroPage (player)
 * Tampilan light sesuai Figma. Navbar, sidebar, bottom bar konsisten dengan LearningPage.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const { questions, loading: quizLoading /*, fetchQuestions*/ } = useQuiz();
  const { tutorials, currentTutorial, selectTutorial, fetchTutorials, loading: learningLoading } =
    useLearning();
  const { getTutorialProgress } = useProgress();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);
  const selectedRef = useRef(null);
  // const fetchedIntroRef = useRef(false);

  const loading = quizLoading || learningLoading;

  // Hook harus dieksekusi sebelum conditional return
  const totalQuestions = questions.length || 3; // fallback
  const timePerQuestion = 30;
  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );
  const chain = useMemo(
    () => buildChain(tutorials, currentTutorial?.id),
    [tutorials, currentTutorial?.id]
  );

  // Fetch daftar tutorial sekali
  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      fetchTutorials(1).finally(() => setTutorialsFetched(true));
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  // Select tutorial dengan guard (hindari double-call di StrictMode)
  useEffect(() => {
    if (!tutorialId || tutorials.length === 0) return;
    const parsedId = parseInt(tutorialId, 10);
    if (isNaN(parsedId)) return;
    if (selectedRef.current === parsedId) return;
    selectedRef.current = parsedId;
    selectTutorial(parsedId).catch((err) => console.error("Error selecting tutorial:", err));
  }, [tutorialId, tutorials.length, selectTutorial]);

  // Hapus fetchQuestions di intro: backend masih 500
  // useEffect(() => {
  //   if (!tutorialId || fetchedIntroRef.current) return;
  //   fetchedIntroRef.current = true;
  //   const parsedId = parseInt(tutorialId, 10);
  //   if (isNaN(parsedId)) return;
  //   fetchQuestions(parsedId).catch((err) =>
  //     console.warn("Questions not available yet (ignored in intro):", err)
  //   );
  // }, [tutorialId, fetchQuestions]);

  const handleStartQuiz = () => {
    if (!tutorialId) return;
    navigate(`/quiz/${tutorialId}`);
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") navigate(`/learning/${item.id}`);
    else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
    else if (item.type === "quiz-final") navigate("/quiz-final-intro");
    else if (item.type === "dashboard") navigate("/dashboard-modul");
  };

  if (loading) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} fullHeight>
        <Loading fullScreen text="Mempersiapkan kuis..." />
      </LayoutWrapper>
    );
  }

  // Jika currentTutorial tidak ada, tampilkan alert
  if (!currentTutorial) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} fullHeight>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md text-center">
            <Alert
              type="warning"
              title="Materi belum tersedia"
              message="Silakan kembali atau pilih submodul lain."
            />
            <Button onClick={() => navigate(-1)} variant="primary" className="mt-4 cursor-pointer">
              Kembali
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper
      showNavbar={!embed}
      showFooter={false}
      embed={embed}
      contentClassName={`pt-28 pb-25 ${!embed && sidebarOpen ? "pr-80" : ""} transition-all duration-300`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={parseInt(tutorialId, 10)}
            currentType="quiz-sub"
            onSelect={handleSelectSidebar}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Submodul"
            rightLabel="Mulai Kuis →"
            onLeft={() => navigate(-1)}
            onRight={handleStartQuiz}
          />
        ) : null
      }
    >
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
                <Button
                  onClick={handleStartQuiz}
                  variant="primary"
                  className="px-10 py-3 text-base cursor-pointer"
                >
                  Mulai Kuis
                </Button>
              </div>
            </div>
          </div>

          {/* Hapus navigasi kecil agar hanya bottom bar yang muncul */}
          {/* <div className="flex items-center justify-between text-sm text-gray-600 mt-6 px-1">
            <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-blue-600 cursor-pointer">
              ‹ Submodul
            </button>
            <span className="text-gray-400">Mulai Kuis ›</span>
          </div> */}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizIntroPage;