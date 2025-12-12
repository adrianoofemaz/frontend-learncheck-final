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
import { getMockQuestions, DEFAULT_MOCK_FEEDBACK } from "../constants/mockQuestions";

/* -------------------------------------------------------------------------- */
/* Helpers: simpan hasil quiz submodul ke localStorage                        */
/* -------------------------------------------------------------------------- */
const SUBMODULE_RESULT_KEY = "submodule-results";

const loadSubmoduleResults = () => {
  try {
    const raw = localStorage.getItem(SUBMODULE_RESULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveSubmoduleResult = (tutorialId, name, score, correct, total, durationSec) => {
  const existing = loadSubmoduleResults();
  const idx = existing.findIndex((e) => String(e.id) === String(tutorialId));
  const attempts = idx >= 0 ? (existing[idx].attempts || 0) + 1 : 1;
  const entry = {
    id: tutorialId,
    name: name || `Submodul ${tutorialId}`,
    score,
    correct,
    total,
    durationSec,
    attempts,
  };
  if (idx >= 0) {
    existing[idx] = entry;
  } else {
    existing.push(entry);
  }
  localStorage.setItem(SUBMODULE_RESULT_KEY, JSON.stringify(existing));
};
/* -------------------------------------------------------------------------- */

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
    setMockQuestions,
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
  const [isMock, setIsMock] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // ✅ FIX 1: Gunakan ref yang lebih robust untuk prevent double fetch
  const fetchedRef = useRef(false);
  const fetchInProgressRef = useRef(false); // ← TAMBAHAN: Track fetch in progress
  const timeUpHandledRef = useRef(null);
  const mountedRef = useRef(true);

  const goToResults = useCallback(
    (result) => {
      const url = `/quiz-results-player/${tutorialId}?embed=0`;
      if (embed && window.top) {
        window.top.location.href = url;
      } else {
        navigate(url, { state: { result } });
      }
    },
    [embed, navigate, tutorialId]
  );

  useEffect(() => {
    if (!storageKey) return;
    
    // Hanya load sekali saat mount
    if (fetchedRef.current) return;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      
      const parsed = JSON.parse(saved);
      if (parsed?.tutorialId === tutorialId) {
        if (parsed.completed && parsed.result) {
          goToResults(parsed.result);
          return;
        }
        if (parsed.answers) {
          Object.entries(parsed.answers).forEach(([qIdx, ans]) => {
            recordAnswer(parseInt(qIdx, 10), ans);
          });
        }
        if (parsed.lockedAnswers) setLockedAnswers(parsed.lockedAnswers);
        if (typeof parsed.currentQuestionIndex === "number") {
          setCurrentQuestionIndex(parsed.currentQuestionIndex);
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved quiz progress", e);
    }
  }, [storageKey, tutorialId, recordAnswer, setCurrentQuestionIndex, goToResults]);

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
      const res = await fetchQuestions(id);
      const hasQuestions = res?.data?.length > 0;
      if (!hasQuestions) {
        const mockQs = getMockQuestions(id);
        setIsMock(true);
        setMockQuestions(mockQs);
        initializeQuiz();
        setStartTime(new Date());
        setIsTimerActive(true);
        setSubmitError(null);
        return;
      }
      setIsMock(false);
      initializeQuiz();
      setStartTime(new Date());
    })();
  }, [tutorialId, fetchQuestions, initializeQuiz, setMockQuestions]);

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
  }, [storageKey, tutorialId, assessmentId, currentQuestionIndex, answers, lockedAnswers, questionsAvailable]);

  useEffect(() => {
    timeUpHandledRef.current = null;
  }, [currentQuestionIndex]);

  const handleSubmitMock = useCallback(() => {
    const durationSec = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
    let correctCount = 0;
    const detail = questions.map((q, idx) => {
      const selectedIndex = answers[idx];
      const selected = q.multiple_choice?.[selectedIndex];
      const isCorrect = !!selected?.correct;
      if (isCorrect) correctCount += 1;
      return {
        soal_id: q.id,
        correct: isCorrect,
        user_answer: selected?.option || "",
        answer: selected?.option || "",
        explanation: selected?.explanation || "",
      };
    });

    const result = {
      success: true,
      message: "Mock assessment",
      assessment_id: "assessment:mock",
      tutorial_key: `tutorial:${tutorialId}`,
      score: Number(((correctCount / questions.length) * 100).toFixed(2)),
      benar: correctCount,
      total: questions.length,
      lama_mengerjakan: `${durationSec} detik`,
      duration: durationSec,
      detail,
      answers: detail,
      questions,
      feedback: DEFAULT_MOCK_FEEDBACK,
    };

    // Simpan ringkasan submodul ke localStorage
    saveSubmoduleResult(
      tutorialId,
      result?.tutorial_key || `Submodul ${tutorialId}`,
      result.score,
      correctCount,
      questions.length,
      durationSec
    );

    if (storageKey) {
      const saved = {
        tutorialId,
        assessmentId: "mock",
        currentQuestionIndex,
        answers,
        lockedAnswers,
        completed: true,
        result,
      };
      localStorage.setItem(storageKey, JSON.stringify(saved));
      localStorage.setItem(`quiz-result-${tutorialId}`, JSON.stringify(result));
    }
    try {
      window.parent.postMessage({ type: "quiz-submitted", tutorialId, result }, "*");
    } catch (e) {
      console.warn("postMessage failed", e);
    }

    goToResults(result);
  }, [answers, currentQuestionIndex, lockedAnswers, questions, startTime, storageKey, tutorialId, goToResults]);

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) return;
    if (isMock) {
      handleSubmitMock();
      return;
    }
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

      const result = await submitAnswers(parseInt(tutorialId, 10), assessmentId, answersData);

      // Simpan ringkasan submodul ke localStorage
      saveSubmoduleResult(
        tutorialId,
        result?.tutorial_key || `Submodul ${tutorialId}`,
        result?.score ?? 0,
        result?.benar ?? 0,
        result?.total ?? questions.length,
        result?.duration ?? 0
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
      goToResults(result);
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
    questions,
    submitAnswers,
    tutorialId,
    storageKey,
    lockedAnswers,
    currentQuestionIndex,
    isSubmitting,
    isMock,
    handleSubmitMock,
    goToResults,
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
        contentClassName="pb-16"
      >
        <Loading fullScreen text="Memuat kuis..." />
      </LayoutWrapper>
    );
  }

  if ((error || submitError) && !isMock) {
    const msg = submitError || error;
    const isServerError = msg?.includes('server') || msg?.includes('500');
    
    return (
      <LayoutWrapper
        showNavbar={!embed}
        showFooter={false}
        sidePanel={null}
        bottomBar={null}
        embed={embed}
        contentClassName="pb-16"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <Alert type="error" title="Error" message={msg} />
            <Button onClick={() => navigate(-1)} variant="primary" className="mt-4 cursor-pointer">
              Kembali
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (questions.length === 0) {
    return (
      <LayoutWrapper
        showNavbar={!embed}
        showFooter={false}
        sidePanel={null}
        bottomBar={null}
        embed={embed}
        contentClassName="pb-16"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-4">Pertanyaan belum tersedia untuk submodul ini.</p>
            <Button onClick={() => navigate(-1)} variant="primary">
              Kembali
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
      contentClassName="pb-16"
    >
      <div className="min-h-screen py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-5 mt-10 sm:mt-12">
          {isMock && (
            <Alert
              type="info"
              title="Mode offline (mock)"
              message="Menampilkan soal mock karena backend bermasalah."
              dismissible={false}
            />
          )}

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

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <QuizCard
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onSelectAnswer={handleSelectAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              locked={!!lockedAnswers[currentQuestionIndex]}
              showFeedback={true} // submodul: tampilkan feedback
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

          {submitError && !isMock && (
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