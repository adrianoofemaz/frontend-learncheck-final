import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import { QuizTimer } from "../components/features/quiz";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";

// TODO: Ganti dengan fetch API backend (10 soal final)
const buildMockQuestions = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    id: `final-${i + 1}`,
    assessment: `Tahapan awal dalam AI Workflow ... disebut: (Soal ${i + 1})`,
    multiple_choice: [
      { option: "Digitalise & Collect", correct: i % 4 === 0 },
      { option: "Transform", correct: i % 4 === 1 },
      { option: "Train", correct: i % 4 === 2 },
      { option: "Execute", correct: i % 4 === 3 },
    ],
  }));

// Versi tampilan tanpa flag correct (hindari feedback instan)
const sanitizeQuestion = (q) =>
  !q
    ? q
    : {
        id: q.id,
        assessment: q.assessment,
        multiple_choice: (q.multiple_choice || []).map((opt) => ({
          option: opt.option || opt.answer || "",
        })),
      };

const QuizFinalPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // object: idx -> selectedIndex
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const durationSeconds = 10 * 60; // 10 menit total
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuestions(buildMockQuestions());
      setLoading(false);
      startTimeRef.current = Date.now();
    }, 120);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const totalQuestions = questions.length || 10;
  const currentQuestion = sanitizeQuestion(questions[currentQuestionIndex]);
  const currentAnswer = answers[currentQuestionIndex];
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex >= totalQuestions - 1;
  const percent = totalQuestions
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0;

  const handleSelectAnswer = (index) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const goToQuestion = (idx) => {
    if (idx < 0 || idx >= totalQuestions) return;
    setCurrentQuestionIndex(idx);
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerActive(false);

    const rawQuestions = questions;
    let correctCount = 0;

    // Bangun array jawaban untuk AnswerReview
    const answersArr = rawQuestions.map((q, idx) => {
      const ansIdx = answers[idx];
      const selected = q?.multiple_choice?.[ansIdx];
      const correct = !!selected?.correct;
      if (correct) correctCount += 1;
      return {
        questionId: q.id,
        selectedIndex: ansIdx ?? null,
        selectedOption: selected?.option || selected?.answer || "",
        correct,
      };
    });

    const score = Number(((correctCount / totalQuestions) * 100).toFixed(2));
    const durationSec = startTimeRef.current
      ? Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000))
      : 0;

    navigate("http://localhost:5173/quiz-final-result", {
      state: {
        score,
        correct: correctCount,
        total: totalQuestions,
        duration: durationSec,
        answers: answersArr,      // <— array, bukan object
        questions: rawQuestions,  // tetap bawa raw (punya flag correct)
      },
    });
  }, [answers, questions, totalQuestions, navigate, isSubmitting]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (loading) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} contentClassName="pb-16">
        <Loading fullScreen text="Memuat quiz final..." />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper
      showNavbar={!embed}
      showFooter={false}
      embed={embed}
      sidePanel={null}
      bottomBar={null}
      contentClassName="pb-16"
    >
      <div
        className="min-h-screen pt-20 pb-10 px-4 flex justify-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(15,94,255,0.06) 0, transparent 35%), radial-gradient(circle at 80% 30%, rgba(15,94,255,0.06) 0, transparent 35%), radial-gradient(circle at 30% 70%, rgba(15,94,255,0.06) 0, transparent 35%), radial-gradient(circle at 75% 75%, rgba(15,94,255,0.06) 0, transparent 35%)",
        }}
      >
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 lg:gap-6">
          {/* Navigator soal di kiri */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-gray-100 p-4 h-fit">
            <p className="text-sm font-semibold text-gray-800 mb-3">Pilih Soal</p>
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const answered = answers[idx] !== undefined;
                const active = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`w-11 h-11 rounded-full text-sm font-semibold border transition
                      ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}
                      ${answered && !active ? "ring-2 ring-offset-1 ring-green-200" : ""}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {/* Header biru dengan timer & progress bar */}
            <div className="bg-gradient-to-r from-[#1e7bff] to-[#0a5bff] text-white rounded-2xl shadow-lg px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Quiz Final</p>
                  <p className="text-lg font-bold">
                    Soal {currentQuestionIndex + 1} dari {totalQuestions}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <span className="opacity-90">Sisa Waktu</span>
                  <QuizTimer
                    duration={durationSeconds}
                    isActive={isTimerActive && !isSubmitting}
                    onTimeUp={handleTimeUp}
                    variant="light"
                    resetKey={0}
                  />
                </div>
              </div>
              <div className="mt-4 h-3 w-full bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Card soal tanpa feedback instan */}
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-semibold text-blue-700">
                  SOAL {currentQuestionIndex + 1} / {totalQuestions}
                </p>
                <p className="text-sm text-gray-500">{percent}% Selesai</p>
              </div>

              {currentQuestion ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                    {currentQuestion.assessment}
                  </h2>
                  <div className="space-y-3">
                    {(currentQuestion.multiple_choice || []).map((opt, idx) => {
                      const isSelected = currentAnswer === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full text-left rounded-2xl border px-4 py-3 transition
                            ${isSelected ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-900"}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-full border ${
                                isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              } flex items-center justify-center`}
                            >
                              {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                            </span>
                            <span className="text-base">{opt.option || opt.answer}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Alert type="info" title="Soal tidak ditemukan" message="Silakan kembali ke dashboard." />
              )}

              <div className="mt-8 flex flex-wrap justify-between items-center gap-3">
                <Button
                  variant="secondary"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 text-sm rounded-xl"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={isFirst}
                >
                  ← Sebelumnya
                </Button>

                {!isLast ? (
                  <Button
                    variant="primary"
                    className="cursor-pointer bg-[#1061ff] hover:bg-[#0d52db] px-6 py-2.5 text-sm rounded-xl"
                    onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  >
                    Lanjut →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="cursor-pointer bg-[#1061ff] hover:bg-[#0d52db] px-6 py-2.5 text-sm rounded-xl"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Selesai & Kirim"}
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
      </div>
    </LayoutWrapper>
  );
};

export default QuizFinalPage;