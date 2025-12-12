/**
 * QuizIntroPage (Player) - SIMPLIFIED
 * - Content only (no sidebar/bottombar)
 * - Navigation handled by Shell
 * - Auto redirect jika quiz sudah dikerjakan
 */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import { useLearning } from "../hooks/useLearning";
import { isQuizCompleted } from "../utils/navigationChain";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import LayoutWrapper from "../components/Layout/LayoutWrapper";

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const { questions, loading: quizLoading } = useQuiz();
  const { 
    currentTutorial, 
    selectTutorial, 
    fetchTutorials, 
    loading: learningLoading 
  } = useLearning();

  const [tutorialsFetched, setTutorialsFetched] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);
  const selectedRef = useRef(null);

  const loading = quizLoading || learningLoading;
  const totalQuestions = questions.length || 3;
  const timePerQuestion = 30;

  // Fetch tutorials list
  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      fetchTutorials(1).finally(() => setTutorialsFetched(true));
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  // Select tutorial
  useEffect(() => {
    if (!tutorialId) return;
    const parsedId = parseInt(tutorialId, 10);
    if (isNaN(parsedId)) return;
    if (selectedRef.current === parsedId) return;
    
    selectedRef.current = parsedId;
    selectTutorial(parsedId).catch((err) => 
      console.error("Error selecting tutorial:", err)
    );
  }, [tutorialId, selectTutorial]);

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
      
      // Redirect ke results player
      navigate(`/quiz-results-player/${parsedId}?embed=1`, { replace: true });
    } else {
      console.log('📝 Quiz not completed yet, staying on intro page');
      setRedirectChecked(true);
    }
  }, [tutorialId, navigate, redirectChecked]);

  // ✅ PostMessage to parent untuk start quiz
  const handleStartQuiz = () => {
    if (!tutorialId) return;
    
    console.log('🚀 Starting quiz for tutorial:', tutorialId);
    
    if (embed) {
      // Notify parent (Shell) untuk navigate
      try {
        window.parent.postMessage(
          {
            type: 'start-quiz',
            tutorialId: parseInt(tutorialId, 10),
            timestamp: Date.now()
          },
          '*'
        );
        console.log('📨 PostMessage sent: start-quiz');
      } catch (err) {
        console.warn('PostMessage failed:', err);
      }
    }
    
    // Navigate di player juga (sebagai fallback)
    navigate(`/quiz-player/${tutorialId}?embed=1`);
  };

  // Loading state
  if (loading || !redirectChecked) {
    return (
      <LayoutWrapper 
        showNavbar={false} 
        showFooter={false} 
        embed={embed} 
        fullHeight
      >
        <Loading fullScreen text="Mempersiapkan kuis..." />
      </LayoutWrapper>
    );
  }

  // Error: No tutorial
  if (!currentTutorial) {
    return (
      <LayoutWrapper 
        showNavbar={false} 
        showFooter={false} 
        embed={embed} 
        fullHeight
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <Alert
              type="warning"
              title="Materi belum tersedia"
              message="Silakan kembali atau pilih submodul lain."
            />
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper
      showNavbar={false}
      showFooter={false}
      embed={embed}
      fullHeight
    >
      <div className="w-full min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header gradient */}
            <div className="h-12 bg-gradient-to-r from-[#1e7bff] to-[#0f5eff]" />
            
            <div className="py-8 px-6">
              {/* Badge */}
              <div className="flex justify-center mb-4">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full shadow">
                  Quiz Submodul
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                LearnCheck!
              </h1>
              
              {/* Subtitle */}
              <p className="text-center text-gray-600 italic mb-6">
                "Let's have some fun and test your understanding!"
              </p>

              {/* Info card */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-center text-gray-900 mb-5">
                  {currentTutorial?.title || "Quiz Submodul"}
                </h2>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  {/* Jumlah soal */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 text-xl font-semibold">
                      ≡
                    </span>
                    <div>
                      <p className="text-sm text-gray-600">Jumlah Soal</p>
                      <p className="text-lg font-bold text-gray-900">
                        {totalQuestions} Soal
                      </p>
                    </div>
                  </div>
                  
                  {/* Durasi */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 text-xl font-semibold">
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

              {/* Start button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleStartQuiz}
                  variant="primary"
                  className="px-10 py-3 text-base cursor-pointer"
                >
                  Mulai Kuis
                </Button>
              </div>

              {/* Info text for embed mode */}
              {embed && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Gunakan tombol navigasi di bawah untuk kembali ke materi
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizIntroPage;