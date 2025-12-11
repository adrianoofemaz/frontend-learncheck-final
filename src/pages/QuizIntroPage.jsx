/**
 * QuizIntroPage (player) - FIXED
 * - Auto redirect ke results jika quiz sudah dikerjakan
 * - Proper embed handling
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
import { 
  buildSidebarItems, 
  buildChain,
  isQuizCompleted 
} from "../utils/navigationChain";
import { ROUTES } from "../constants/routes";

const fillRoute = (pattern, params) =>
  Object.entries(params).reduce((p, [k, v]) => p.replace(`:${k}`, v), pattern);

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const { questions, loading: quizLoading } = useQuiz();
  const { 
    tutorials, 
    currentTutorial, 
    selectTutorial, 
    fetchTutorials, 
    loading: learningLoading 
  } = useLearning();
  const { getTutorialProgress } = useProgress();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);
  const selectedRef = useRef(null);

  const loading = quizLoading || learningLoading;

  const totalQuestions = questions.length || 3;
  const timePerQuestion = 30;
  
  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );
  
  const chain = useMemo(
    () => buildChain(tutorials, currentTutorial?.id),
    [tutorials, currentTutorial?.id]
  );

  // Fetch tutorials list
  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      fetchTutorials(1).finally(() => setTutorialsFetched(true));
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  // Select tutorial
  useEffect(() => {
    if (!tutorialId || tutorials.length === 0) return;
    const parsedId = parseInt(tutorialId, 10);
    if (isNaN(parsedId)) return;
    if (selectedRef.current === parsedId) return;
    
    selectedRef.current = parsedId;
    selectTutorial(parsedId).catch((err) => 
      console.error("Error selecting tutorial:", err)
    );
  }, [tutorialId, tutorials.length, selectTutorial]);

  // ✅ AUTO REDIRECT: Cek apakah quiz sudah dikerjakan
  useEffect(() => {
    if (!tutorialId || redirectChecked) return;
    
    const parsedId = parseInt(tutorialId, 10);
    if (isNaN(parsedId)) return;

    console.log('🔍 Checking quiz completion for tutorial:', parsedId);
    const quizDone = isQuizCompleted(parsedId);
    
    if (quizDone) {
      console.log('✅ Quiz already completed, redirecting to results...');
      setRedirectChecked(true);
      
      // Redirect ke results
      if (embed) {
        navigate(`/quiz-results-player/${parsedId}?embed=1`, { replace: true });
      } else {
        navigate(fillRoute(ROUTES.QUIZ_RESULTS, { tutorialId: parsedId }), { replace: true });
      }
    } else {
      console.log('📝 Quiz not completed yet, staying on intro page');
      setRedirectChecked(true);
    }
  }, [tutorialId, embed, navigate, redirectChecked]);

  const handleStartQuiz = () => {
    if (!tutorialId) return;
    
    console.log('🚀 Starting quiz for tutorial:', tutorialId);
    
    if (embed) {
      navigate(`${fillRoute(ROUTES.QUIZ_PLAYER, { tutorialId })}?embed=1`);
    } else {
      navigate(fillRoute(ROUTES.QUIZ, { tutorialId }));
    }
  };

  const handleSelectSidebar = (item) => {
    if (item.locked) {
      console.warn('🔒 Item locked:', item.label);
      return;
    }

    if (item.type === "tutorial") {
      navigate(fillRoute(ROUTES.LEARNING, { id: item.id }));
    } else if (item.type === "quiz-sub") {
      // Cek apakah quiz sudah dikerjakan
      if (item.completed) {
        navigate(fillRoute(ROUTES.QUIZ_RESULTS, { tutorialId: item.id }));
      } else {
        navigate(fillRoute(ROUTES.QUIZ_INTRO_SHELL, { tutorialId: item.id }));
      }
    } else if (item.type === "quiz-final") {
      navigate(ROUTES.QUIZ_FINAL_INTRO);
    } else if (item.type === "dashboard") {
      navigate(ROUTES.DASHBOARD_MODUL);
    }
  };

  if (loading || !redirectChecked) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} fullHeight>
        <Loading fullScreen text="Mempersiapkan kuis..." />
      </LayoutWrapper>
    );
  }

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
            <Button 
              onClick={() => navigate(-1)} 
              variant="primary" 
              className="mt-4 cursor-pointer"
            >
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
                "Let's have some fun and test your understanding!"
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
                      <p className="text-lg font-bold text-gray-900">
                        {totalQuestions} Soal
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">
                      ⏱
                    </span>
                    <div>
                      <p className="text-sm text-gray-600">Durasi</p>
                      <p className="text-lg font-bold text-gray-900">
                        {timePerQuestion} detik/soal
                      </p>
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
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizIntroPage;