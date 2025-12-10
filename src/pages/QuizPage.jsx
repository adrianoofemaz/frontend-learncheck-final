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

  const { questions, loading, error, assessmentId, fetchQuestions, submitAnswers } = useQuiz();
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

  const fetchedRef = useRef(false);
  const timeUpHandledRef = useRef(null);

  // Load saved progress
  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.tutorialId === tutorialId) {
        if (parsed.completed && parsed.result) {
          navigate(`/quiz-results-player/${tutorialId}?embed=1`, { state: { result: parsed.result } });
          return;
        }
        if (parsed.answers) {
          Object.entries(parsed.answers).forEach(([qIdx, ans]) => {
            recordAnswer(parseInt(qIdx), ans);
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
  }, [storageKey, tutorialId, navigate, recordAnswer, setCurrentQuestionIndex]);

  // Fetch questions – single call, with guard
  useEffect(() => {
    if (!tutorialId) {
      setSubmitError("Tutorial ID tidak ditemukan");
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const id = parseInt(tutorialId);
    fetchQuestions(id);
    initializeQuiz();
  }, [tutorialId, fetchQuestions, initializeQuiz]);

  // Persist progress
  useEffect(() => {
    if (!storageKey || !tutorialId) return;
    const payload = {
      tutorialId,
      assessmentId,
      currentQuestionIndex,
      answers,
      lockedAnswers,
      completed: false,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [storageKey, tutorialId, assessmentId, currentQuestionIndex, answers, lockedAnswers]);

  // reset guard tiap pindah soal
  useEffect(() => {
    timeUpHandledRef.current = null;
  }, [currentQuestionIndex]);

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerActive(false);
    setSubmitError(null);
    try {
      const answersData = questions.map((question, idx) => {
        const answerIndex = answers[idx];
        const selectedOption =
          answerIndex !== undefined ? question?.multiple_choice?.[answerIndex] : null;
        return {
          soal_id: question?.id,
          correct: selectedOption?.correct || false,
        };
      });

      const result = await submitAnswers(parseInt(tutorialId), assessmentId, answersData);

      if (storageKey) {
        const saved = {
          tutorialId,
          assessmentId,
          currentQuestionIndex,
          answers,
          lockedAnswers,
          completed: true,
          result,
        };
        localStorage.setItem(storageKey, JSON.stringify(saved));
      }

      // postMessage ke parent shell
      try {
        window.parent.postMessage({ type: "quiz-submitted", tutorialId, result }, "*");
      } catch (e) {
        console.warn("postMessage failed", e);
      }

      // redirect di dalam iframe ke player hasil
      navigate(`/quiz-results-player/${tutorialId}?embed=1`, { state: { result } });
    } catch (err) {
      const friendly = err?.raw?.details || err?.message || "Gagal mengirim jawaban";
      setSubmitError(friendly);
      setIsTimerActive(true);
      setIsSubmitting(false);
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

  const handleTimeUp = useCallback(() => {
    if (timeUpHandledRef.current === currentQuestionIndex) return;
    timeUpHandledRef.current = currentQuestionIndex;

    if (currentQuestionIndex >= questions.length - 1) {
      handleSubmitQuiz();
    } else {
      nextQuestion(questions.length);
    }
  }, [currentQuestionIndex, questions.length, handleSubmitQuiz, nextQuestion]);

  const handleSelectAnswer = (index) => {
    if (lockedAnswers[currentQuestionIndex]) return;
    recordAnswer(currentQuestionIndex, index);
    setLockedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleNextClick = () => {
    if (currentAnswer !== undefined) {
      nextQuestion(questions.length);
      return;
    }
    Swal.fire({
      title: "Belum menjawab",
      text: "Anda belum memilih jawaban untuk soal ini. Tetap lanjut?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tetap Lanjut",
      cancelButtonText: "Batal",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        nextQuestion(questions.length);
      }
    });
  };

  if (loading) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} sidePanel={null} bottomBar={null} embed={embed}>
        <Loading fullScreen text="Memuat kuis..." />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} sidePanel={null} bottomBar={null} embed={embed}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <Alert type="error" title="Error" message={error} />
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
      <LayoutWrapper showNavbar={!embed} showFooter={false} sidePanel={null} bottomBar={null} embed={embed}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-4">Pertanyaan tidak ditemukan</p>
            <Button onClick={() => navigate(-1)} variant="primary">
              Kembali
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper showNavbar={!embed} showFooter={false} sidePanel={null} bottomBar={null} embed={embed}>
      <div className="min-h-screen py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-5 mt-10 sm:mt-12">
          {/* Top bar */}
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
            <div className="mt-4 h-2 w-full bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Card soal */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <QuizCard
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onSelectAnswer={handleSelectAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              locked={!!lockedAnswers[currentQuestionIndex]}
            />

            <div className="mt-6 flex justify-end">
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmitQuiz}
                  variant="primary"
                  disabled={isSubmitting}
                  className="bg-[#0f5eff] hover:bg-[#0d52db] px-4 py-2 text-sm"
                >
                  {isSubmitting ? "Mengirim..." : "✓ Selesai & Kirim"}
                </Button>
              ) : (
                <Button
                  onClick={handleNextClick}
                  variant="primary"
                  disabled={false}
                  className="bg-[#0f5eff] hover:bg-[#0d52db] px-4 py-2 text-sm"
                >
                  Lanjut →
                </Button>
              )}
            </div>
          </div>

          {submitError && (
            <Alert
              type="error"
              title="Error"
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