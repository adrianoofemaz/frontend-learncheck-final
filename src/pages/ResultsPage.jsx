/**
 * QuizResultsPlayer.jsx (ResultsPage) - FIXED
 * - Smart navigation: Next ke submodul berikutnya atau Quiz Final
 * - Save result to localStorage
 * - PostMessage to parent iframe
 */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { 
  buildSidebarItems, 
  buildChain,
  getNextDestination,
  isQuizCompleted,
  isFinalQuizCompleted 
} from "../utils/navigationChain";
import ResultCard from "../components/Features/feedback/ResultCard";
import AnswerReview from "../components/Features/feedback/AnswerReview";
import Button from "../components/common/Button";
import { ROUTES } from "../constants/routes";

const fillRoute = (pattern, params) =>
  Object.entries(params).reduce((p, [k, v]) => p.replace(`:${k}`, v), pattern);

const QuizResultsPlayer = () => {
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const location = useLocation();
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get result from state or localStorage
  const stateResult = location.state?.result;
  const localResult = (() => {
    try {
      const raw = localStorage.getItem(`quiz-result-${tutorialId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const resultData = stateResult || localResult || {};

  // ✅ Save result to localStorage if from state
  useEffect(() => {
    if (stateResult && tutorialId) {
      try {
        console.log('💾 Saving quiz result to localStorage:', tutorialId);
        localStorage.setItem(`quiz-result-${tutorialId}`, JSON.stringify(stateResult));
      } catch (err) {
        console.error('Failed to save result to localStorage:', err);
      }
    }
  }, [stateResult, tutorialId]);

  // ✅ PostMessage to parent (untuk iframe communication)
  useEffect(() => {
    if (embed && resultData && tutorialId) {
      try {
        window.parent.postMessage(
          {
            type: 'quiz-result-viewed',
            tutorialId: parseInt(tutorialId, 10),
            result: resultData,
            timestamp: Date.now()
          },
          '*'
        );
        console.log('📨 PostMessage sent: quiz-result-viewed');
      } catch (err) {
        console.warn('PostMessage failed:', err);
      }
    }
  }, [embed, resultData, tutorialId]);

  // Extract result data
  const score = resultData?.score ?? 0;
  const correct = resultData?.benar ?? resultData?.correct_count ?? 0;
  const total = resultData?.total ?? resultData?.total_questions ?? 0;
  const duration = resultData?.lama_mengerjakan ?? resultData?.duration ?? "";

  const feedback = resultData?.feedback || {};
  const ringkasan = feedback.summary || "";
  const analisis = feedback.analysis || "";
  const saran = feedback.advice || "";
  const rekomendasi = feedback.recommendation || "";

  const answers = resultData?.detail || resultData?.answers || [];
  const questions = resultData?.questions || [];

  const currentId = parseInt(tutorialId, 10);
  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );
  const chain = buildChain(tutorials, currentId);

  const isPass = total > 0 ? (correct / total) * 100 >= 60 : false;

  /**
   * BACK Navigation
   * - Kembali ke materi submodul yang sama
   */
  const goBackChain = () => {
    console.log('← Going back to learning page:', currentId);
    
    if (embed) {
      // Di embed mode, post message ke parent untuk navigate
      try {
        window.parent.postMessage(
          {
            type: 'navigate-to-learning',
            tutorialId: currentId,
            timestamp: Date.now()
          },
          '*'
        );
      } catch (err) {
        console.warn('PostMessage failed:', err);
      }
    }
    
    navigate(fillRoute(ROUTES.LEARNING, { id: currentId }));
  };

  /**
   * NEXT Navigation (FIXED)
   * - Cek apakah masih ada submodul berikutnya
   * - Jika ada: ke Learning Page submodul berikutnya
   * - Jika tidak: ke Quiz Final Intro
   */
  const goNextChain = () => {
    console.log('→ Determining next destination...');
    
    const nextDest = getNextDestination(tutorials, currentId);
    console.log('Next destination:', nextDest);

    if (nextDest.type === 'learning') {
      // Ada submodul berikutnya
      console.log('→ Going to next submodule:', nextDest.id);
      
      if (embed) {
        try {
          window.parent.postMessage(
            {
              type: 'navigate-to-learning',
              tutorialId: nextDest.id,
              timestamp: Date.now()
            },
            '*'
          );
        } catch (err) {
          console.warn('PostMessage failed:', err);
        }
      }
      
      navigate(fillRoute(ROUTES.LEARNING, { id: nextDest.id }));
      
    } else if (nextDest.type === 'quiz-final') {
      // Semua submodul selesai, ke quiz final
      console.log('→ Going to Quiz Final');
      
      if (embed) {
        try {
          window.parent.postMessage(
            {
              type: 'navigate-to-quiz-final',
              timestamp: Date.now()
            },
            '*'
          );
        } catch (err) {
          console.warn('PostMessage failed:', err);
        }
      }
      
      navigate(ROUTES.QUIZ_FINAL_INTRO);
      
    } else if (nextDest.type === 'dashboard') {
      // Quiz final sudah selesai, ke dashboard
      console.log('→ Going to Dashboard');
      
      if (embed) {
        try {
          window.parent.postMessage(
            {
              type: 'navigate-to-dashboard',
              timestamp: Date.now()
            },
            '*'
          );
        } catch (err) {
          console.warn('PostMessage failed:', err);
        }
      }
      
      navigate(ROUTES.DASHBOARD_MODUL);
      
    } else {
      // Fallback: kembali ke home
      console.log('→ Fallback: Going to Home');
      navigate(ROUTES.HOME);
    }
  };

  /**
   * Sidebar item selection handler
   */
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

  /**
   * Retry quiz handler
   */
  const handleRetryQuiz = () => {
    console.log('🔄 Retrying quiz for tutorial:', currentId);
    
    // Clear quiz result from localStorage
    try {
      localStorage.removeItem(`quiz-result-${currentId}`);
      localStorage.removeItem(`quiz-progress-${currentId}`);
      console.log('✅ Cleared quiz data for retry');
    } catch (err) {
      console.error('Failed to clear quiz data:', err);
    }

    // Navigate to quiz intro
    if (embed) {
      navigate(`/quiz-intro/${currentId}?embed=1`);
    } else {
      navigate(fillRoute(ROUTES.QUIZ_INTRO_SHELL, { tutorialId: currentId }));
    }
  };

  // Determine next button label
  const getNextButtonLabel = () => {
    const nextDest = getNextDestination(tutorials, currentId);
    
    if (nextDest.type === 'learning') {
      return 'Lanjut ke Submodul Berikutnya →';
    } else if (nextDest.type === 'quiz-final') {
      return 'Lanjut ke Quiz Final →';
    } else if (nextDest.type === 'dashboard') {
      return 'Lihat Dashboard →';
    }
    
    return 'Selesai';
  };

  return (
    <LayoutWrapper
      embed={embed}
      showNavbar={!embed}
      showFooter={false}
      contentClassName={`pt-10 pb-24 ${!embed && sidebarOpen ? "pr-80" : ""}`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={currentId}
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
            leftLabel="← Kembali ke Materi"
            rightLabel={getNextButtonLabel()}
            onLeft={goBackChain}
            onRight={goNextChain}
          />
        ) : null
      }
    >
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero result card */}
          <ResultCard
            score={score}
            correct={correct}
            total={total}
            duration={duration}
            isPass={isPass}
          />

          {/* Feedback section */}
          {(ringkasan || analisis || saran || rekomendasi) && (
            <div className={`rounded-2xl p-5 shadow-sm border ${
              isPass 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                isPass ? 'text-green-700' : 'text-red-700'
              }`}>
                {isPass ? '🎉 Selamat! Anda Lulus' : '📚 Perlu Belajar Lebih Lanjut'}
              </h3>
              
              {ringkasan && (
                <p className={isPass ? 'text-green-800 mb-3' : 'text-red-800 mb-3'}>
                  {ringkasan}
                </p>
              )}
              
              {analisis && (
                <p className={isPass ? 'text-green-800 mb-3' : 'text-red-800 mb-3'}>
                  <span className="font-semibold">Analisis: </span>
                  {analisis}
                </p>
              )}
              
              {saran && (
                <p className={isPass ? 'text-green-800 mb-3' : 'text-red-800 mb-3'}>
                  <span className="font-semibold">Saran: </span>
                  {saran}
                </p>
              )}
              
              {rekomendasi && (
                <p className={isPass ? 'text-green-800' : 'text-red-800'}>
                  <span className="font-semibold">Rekomendasi: </span>
                  {rekomendasi}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {!isPass && (
                <Button 
                  variant="secondary" 
                  className="cursor-pointer" 
                  onClick={handleRetryQuiz}
                >
                  🔄 Coba Lagi
                </Button>
              )}
              
              <Button
                variant="primary"
                className="cursor-pointer"
                onClick={goNextChain}
              >
                {getNextButtonLabel()}
              </Button>
            </div>

            {/* Answer review */}
            <div className="border-t border-dashed border-blue-200 my-4" />
            
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              📝 Detail Jawaban
            </h3>
            
            <AnswerReview answers={answers} questions={questions} />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizResultsPlayer;