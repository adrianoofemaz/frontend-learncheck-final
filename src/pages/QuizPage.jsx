import React, { useEffect, useState, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import { useQuizProgress } from "../hooks/useQuizProgress";
import { useQuiz } from "../hooks/useQuiz";
import { QuizCard, QuizTimer } from "../components/features/quiz";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";

const QuizPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const storageKey = tutorialId ? `quiz-progress-${tutorialId}` : null;

  const { 
    questions, 
    loading, 
    error, 
    assessmentId, 
    fetchQuestions, 
    submitAnswers,
    clearError 
  } = useQuiz();
  
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    getCurrentAnswer,
    nextQuestion,
    initializeQuiz,
  } = useQuizProgress();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [questionsAvailable, setQuestionsAvailable] = useState(false);

  // ✅ FIX 1: Gunakan ref yang lebih robust untuk prevent double fetch
  const fetchedRef = useRef(false);
  const fetchInProgressRef = useRef(false); // ← TAMBAHAN: Track fetch in progress
  const timeUpHandledRef = useRef(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      fetchInProgressRef.current = false; // Reset on unmount
    };
  }, []);

  // ✅ FIX 2: Load saved progress - TANPA dependency yang memicu re-render
  useEffect(() => {
    if (!storageKey) return;
    
    // Hanya load sekali saat mount
    if (fetchedRef.current) return;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      
      const parsed = JSON.parse(saved);
      
      // Validasi structure
      if (!parsed || parsed.tutorialId !== tutorialId) {
        console.warn('Invalid saved progress, clearing...');
        localStorage.removeItem(storageKey);
        return;
      }

      // Jika sudah completed, redirect ke results
      if (parsed.completed && parsed.result) {
        console.log('✅ Quiz already completed, redirecting...');
        navigate(`/quiz-results-player/${tutorialId}?embed=1`, { 
          state: { result: parsed.result },
          replace: true 
        });
        return;
      }

      // Restore answers
      if (parsed.answers && typeof parsed.answers === 'object') {
        Object.entries(parsed.answers).forEach(([qIdx, ans]) => {
          const index = parseInt(qIdx, 10);
          if (!isNaN(index)) {
            recordAnswer(index, ans);
          }
        });
      }

      // Restore locked answers
      if (parsed.lockedAnswers && typeof parsed.lockedAnswers === 'object') {
        setLockedAnswers(parsed.lockedAnswers);
      }

      // Restore current question index
      if (typeof parsed.currentQuestionIndex === "number") {
        setCurrentQuestionIndex(parsed.currentQuestionIndex);
      }

      console.log('✅ Quiz progress restored');
      
    } catch (e) {
      console.error("Failed to parse saved quiz progress:", e);
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]); // ← HANYA storageKey sebagai dependency

  // ✅ FIX 3: Fetch questions - dengan guard yang lebih ketat
  useEffect(() => {
    if (!tutorialId) {
      setSubmitError("Tutorial ID tidak ditemukan");
      return;
    }

    // ✅ DOUBLE GUARD: Cek fetchedRef DAN fetchInProgressRef
    if (fetchedRef.current || fetchInProgressRef.current) {
      console.log('⏭️ Fetch already done or in progress, skipping...');
      return;
    }

    const id = parseInt(tutorialId, 10);
    
    if (isNaN(id)) {
      setSubmitError("Tutorial ID tidak valid");
      return;
    }

    console.log('🔍 Fetching questions for tutorial:', id);

    // Mark as fetched immediately
    fetchedRef.current = true;
    fetchInProgressRef.current = true;

    (async () => {
      try {
        const res = await fetchQuestions(id);
        
        if (!mountedRef.current) return;
        
        console.log('📦 Fetch result:', res);
        
        if (!res || !res.data) {
          console.warn('⚠️ No questions returned from API');
          setSubmitError("Pertanyaan belum tersedia untuk submodul ini.");
          setQuestionsAvailable(false);
          return;
        }

        // Cek apakah ada questions
        const questionsData = res.data;
        
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
          console.warn('⚠️ Questions array is empty');
          setSubmitError("Tidak ada soal yang tersedia untuk submodul ini.");
          setQuestionsAvailable(false);
          return;
        }

        console.log('✅ Questions loaded:', questionsData.length);
        setQuestionsAvailable(true);
        initializeQuiz();
        
      } catch (err) {
        if (!mountedRef.current) return;
        
        console.error('❌ Error fetching questions:', err);
        const errorMessage = err?.details || err?.message || "Gagal memuat pertanyaan";
        setSubmitError(errorMessage);
        setQuestionsAvailable(false);
      } finally {
        if (mountedRef.current) {
          fetchInProgressRef.current = false; // Reset after fetch complete
        }
      }
    })();
  }, [tutorialId]); // ← HANYA tutorialId sebagai dependency

  // ✅ FIX 4: Persist progress - dengan throttling
  useEffect(() => {
    if (!storageKey || !tutorialId || !questionsAvailable) return;
    
    // Throttle dengan setTimeout untuk menghindari terlalu sering save
    const timeoutId = setTimeout(() => {
      try {
        const payload = {
          tutorialId,
          assessmentId,
          currentQuestionIndex,
          answers,
          lockedAnswers,
          completed: false,
          timestamp: Date.now(),
        };
        
        localStorage.setItem(storageKey, JSON.stringify(payload));
        
      } catch (e) {
        console.error('Failed to save quiz progress:', e);
      }
    }, 500); // Throttle 500ms

    return () => clearTimeout(timeoutId);
    
  }, [
    storageKey, 
    tutorialId, 
    assessmentId, 
    currentQuestionIndex, 
    answers, 
    lockedAnswers,
    questionsAvailable
  ]);

  // Reset timer guard when question changes
  useEffect(() => {
    timeUpHandledRef.current = null;
  }, [currentQuestionIndex]);

  // Submit quiz handler
  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) {
      console.warn('⚠️ Submit already in progress');
      return;
    }

    if (!assessmentId) {
      setSubmitError("Assessment ID tidak ditemukan. Tidak dapat mengirim jawaban.");
      return;
    }

    console.log('📤 Starting quiz submission...');
    setIsSubmitting(true);
    setIsTimerActive(false);
    setSubmitError(null);

    try {
      // Prepare answers data
      const answersData = questions.map((question, idx) => {
        const answerIndex = answers[idx];
        const selectedOption =
          answerIndex !== undefined ? question?.multiple_choice?.[answerIndex] : null;
        
        return {
          soal_id: question?.id,
          correct: selectedOption?.correct || false,
        };
      });

      console.log('📦 Submitting answers:', answersData.length, 'questions');

      const result = await submitAnswers(
        parseInt(tutorialId, 10), 
        assessmentId, 
        answersData
      );

      if (!mountedRef.current) return;

      console.log('✅ Quiz submitted successfully');

      // Save completed state
      if (storageKey) {
        try {
          const saved = {
            tutorialId,
            assessmentId,
            currentQuestionIndex,
            answers,
            lockedAnswers,
            completed: true,
            result,
            completedAt: Date.now(),
          };
          localStorage.setItem(storageKey, JSON.stringify(saved));
        } catch (e) {
          console.error('Failed to save completed state:', e);
        }
      }

      // PostMessage to parent
      try {
        window.parent.postMessage(
          { 
            type: "quiz-submitted", 
            tutorialId, 
            result,
            timestamp: Date.now()
          }, 
          "*"
        );
        console.log('📨 PostMessage sent to parent');
      } catch (e) {
        console.warn("PostMessage failed:", e);
      }

      // Redirect to results page
      navigate(`/quiz-results-player/${tutorialId}?embed=1`, { 
        state: { result },
        replace: true 
      });

    } catch (err) {
      if (!mountedRef.current) return;

      console.error('❌ Quiz submission failed:', err);
      
      const friendly = 
        err?.details || 
        err?.message || 
        "Gagal mengirim jawaban. Silakan coba lagi.";
      
      setSubmitError(friendly);
      setIsTimerActive(true);
      setIsSubmitting(false);

      Swal.fire({
        title: "Gagal Mengirim",
        text: friendly,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f5eff",
      });
    }
  }, [
    answers,
    assessmentId,
    navigate,
    questions,
    submitAnswers,
    tutorialId,
    storageKey,
    lockedAnswers,
    currentQuestionIndex,
    isSubmitting,
  ]);

  // Time up handler
  const handleTimeUp = useCallback(() => {
    if (timeUpHandledRef.current === currentQuestionIndex) {
      console.log('⏭️ Time up already handled for this question');
      return;
    }
    
    timeUpHandledRef.current = currentQuestionIndex;
    console.log('⏰ Time up for question:', currentQuestionIndex + 1);

    if (currentQuestionIndex >= questions.length - 1) {
      console.log('🏁 Last question - auto submitting...');
      handleSubmitQuiz();
    } else {
      console.log('➡️ Moving to next question...');
      nextQuestion(questions.length);
    }
  }, [currentQuestionIndex, questions.length, handleSubmitQuiz, nextQuestion]);

  // Select answer handler
  const handleSelectAnswer = (index) => {
    if (lockedAnswers[currentQuestionIndex]) {
      console.warn('⚠️ Answer already locked for this question');
      return;
    }

    console.log('✓ Answer selected:', index, 'for question:', currentQuestionIndex + 1);
    recordAnswer(currentQuestionIndex, index);
    setLockedAnswers((prev) => ({ 
      ...prev, 
      [currentQuestionIndex]: true 
    }));
  };

  // Next question handler
  const handleNextClick = () => {
    if (currentAnswer !== undefined) {
      console.log('➡️ Moving to next question (answered)');
      nextQuestion(questions.length);
      return;
    }

    Swal.fire({
      title: "Belum Menjawab",
      text: "Anda belum memilih jawaban untuk soal ini. Tetap lanjut?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tetap Lanjut",
      cancelButtonText: "Batal",
      reverseButtons: true,
      allowOutsideClick: false,
      confirmButtonColor: "#0f5eff",
      cancelButtonColor: "#6c757d",
    }).then((res) => {
      if (res.isConfirmed) {
        console.log('➡️ Moving to next question (unanswered)');
        nextQuestion(questions.length);
      }
    });
  };

  // Computed values
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercent = questions.length
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    : 0;

  // Loading state
  if (loading) {
    return (
      <LayoutWrapper 
        showNavbar={!embed} 
        showFooter={false} 
        sidePanel={null} 
        bottomBar={null} 
        embed={embed}
      >
        <Loading fullScreen text="Memuat kuis..." />
      </LayoutWrapper>
    );
  }

  // Error state
  if (error || submitError) {
    const msg = submitError || error;
    const isServerError = msg?.includes('server') || msg?.includes('500');
    
    return (
      <LayoutWrapper 
        showNavbar={!embed} 
        showFooter={false} 
        sidePanel={null} 
        bottomBar={null} 
        embed={embed}
      >
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isServerError ? 'Server Error' : 'Terjadi Kesalahan'}
              </h2>
            </div>
            
            <Alert 
              type="error" 
              title="Error" 
              message={msg} 
            />
            
            <div className="mt-6 flex gap-3 justify-center">
              <Button 
                onClick={() => navigate(-1)} 
                variant="secondary"
                className="cursor-pointer"
              >
                ← Kembali
              </Button>
              
              {isServerError && (
                <Button 
                  onClick={() => {
                    clearError();
                    setSubmitError(null);
                    fetchedRef.current = false;
                    fetchInProgressRef.current = false;
                    window.location.reload();
                  }} 
                  variant="primary"
                  className="cursor-pointer"
                >
                  🔄 Coba Lagi
                </Button>
              )}
            </div>

            {isServerError && (
              <p className="mt-4 text-sm text-gray-500">
                Jika masalah berlanjut, silakan hubungi administrator.
              </p>
            )}
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // No questions state
  if (questions.length === 0 || !questionsAvailable) {
    return (
      <LayoutWrapper 
        showNavbar={!embed} 
        showFooter={false} 
        sidePanel={null} 
        bottomBar={null} 
        embed={embed}
      >
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Quiz Belum Tersedia
              </h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Pertanyaan belum tersedia untuk submodul ini. Silakan coba lagi nanti atau hubungi instruktur.
            </p>
            
            <Button 
              onClick={() => navigate(-1)} 
              variant="primary"
              className="cursor-pointer"
            >
              ← Kembali ke Tutorial
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // Main quiz interface
  return (
    <LayoutWrapper 
      showNavbar={!embed} 
      showFooter={false} 
      sidePanel={null} 
      bottomBar={null} 
      embed={embed}
    >
      <div className="min-h-screen py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-5 mt-10 sm:mt-12">
          {/* Top bar with progress */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0f5eff] to-[#0a4ed6] text-white shadow-lg p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  Quiz Submodul
                </p>
                <p className="text-base sm:text-lg font-medium opacity-90">
                  Soal {currentQuestionIndex + 1} dari {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base">
                <div className="font-semibold">Sisa Waktu</div>
                <QuizTimer
                  duration={30}
                  isActive={isTimerActive && !isSubmitting}
                  onTimeUp={handleTimeUp}
                  variant="light"
                  resetKey={currentQuestionIndex}
                />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-2 w-full bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <QuizCard
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onSelectAnswer={handleSelectAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              locked={!!lockedAnswers[currentQuestionIndex]}
            />

            {/* Navigation buttons */}
            <div className="mt-6 flex justify-end gap-3">
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmitQuiz}
                  variant="primary"
                  disabled={isSubmitting}
                  className="bg-[#0f5eff] hover:bg-[#0d52db] px-6 py-2 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "⏳ Mengirim..." : "✓ Selesai & Kirim"}
                </Button>
              ) : (
                <Button
                  onClick={handleNextClick}
                  variant="primary"
                  disabled={false}
                  className="bg-[#0f5eff] hover:bg-[#0d52db] px-6 py-2 text-sm font-medium cursor-pointer"
                >
                  Lanjut →
                </Button>
              )}
            </div>
          </div>

          {/* Submit error alert */}
          {submitError && (
            <Alert
              type="error"
              title="Gagal Mengirim"
              message={submitError}
              dismissible
              onClose={() => setSubmitError(null)}
            />
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizPage;