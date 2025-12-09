import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import LearningLayout from "../layouts/LearningLayout";

const ResultBadge = ({ percentage }) => {
  if (percentage >= 80)
    return (
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-sm font-semibold">
        <CheckCircleIcon className="w-5 h-5" /> Sangat Baik
      </div>
    );
  if (percentage >= 60)
    return (
      <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-sm font-semibold">
        <ExclamationCircleIcon className="w-5 h-5" /> Cukup
      </div>
    );
  return (
    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-sm font-semibold">
      <XCircleIcon className="w-5 h-5" /> Coba Lagi
    </div>
  );
};

const MetricCard = ({ label, value, sub, color = "text-gray-900" }) => (
  <div className="flex-1 min-w-[140px] bg-white shadow-md rounded-xl border border-gray-100 px-4 py-3 text-center">
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const AnswerReviewCard = ({ item, index }) => {
  const isCorrect = item.isCorrect;
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <XMarkIcon className="w-4 h-4" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Q{index + 1}: {item.question}
            </p>
            <p className="text-xs text-gray-600">
              Jawaban Anda:{" "}
              <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                {item.userAnswer || "Tidak dijawab"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">Pilihan Jawaban:</p>
        <div className="space-y-2">
          {item.options?.map((opt, idx) => {
            const selected = idx === item.userIndex;
            const correct = opt.correct === true;
            const base = "w-full text-left rounded-xl px-3 py-2 border transition-all duration-200";
            const state = correct
              ? "border-green-500 bg-green-50 text-green-800"
              : selected
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-gray-200 bg-white text-gray-800";
            return (
              <div key={idx} className={`${base} ${state}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{String.fromCharCode(65 + idx)}.</span>
                  <span className="text-sm">{opt.option || "-"}</span>
                  {correct && <CheckIcon className="w-4 h-4 text-green-600 ml-auto" />}
                  {!correct && selected && <XMarkIcon className="w-4 h-4 text-red-600 ml-auto" />}
                </div>
              </div>
            );
          })}
        </div>

        {item.explanation && (
          <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
            <p className="text-xs font-semibold text-blue-800 mb-1">Penjelasan:</p>
            <p className="text-sm text-blue-900 leading-relaxed">{item.explanation}</p>
          </div>
        )}

        {!isCorrect && (
          <div className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800">
            Jawaban Anda Salah
          </div>
        )}
      </div>
    </div>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tutorials, currentTutorial } = useLearning();
  const { getTutorialProgress } = useProgress();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [reviewItems, setReviewItems] = useState([]);
  const [showReview, setShowReview] = useState(false); // default hide

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
    }
    setLoading(false);
  }, [location.state]);

  // fallback tutorialId dari currentTutorial atau result.tutorial_key
  const tutorialIdFromResultKey =
    typeof location.state?.result?.tutorial_key === "string"
      ? parseInt(location.state.result.tutorial_key.split(":")[1], 10)
      : null;
  const currentTutorialId = currentTutorial?.id || tutorialIdFromResultKey || null;

  useEffect(() => {
    const run = () => {
      setReviewLoading(true);
      setReviewError(null);
      try {
        if (!currentTutorialId) {
          setReviewLoading(false);
          return;
        }

        const tId = currentTutorialId;
        const qRaw = localStorage.getItem(`quiz-questions-${tId}`);
        const pRaw = localStorage.getItem(`quiz-progress-${tId}`);

        let questions = [];
        if (qRaw) {
          const parsedQ = JSON.parse(qRaw);
          questions = (parsedQ?.questions || []).slice(0, 3);
        } else if (location.state?.result?.questions) {
          questions = (location.state.result.questions || []).slice(0, 3);
        } else {
          setReviewItems([]);
          setReviewError("Data soal tidak tersedia untuk review.");
          setReviewLoading(false);
          return;
        }

        let savedAnswers = [];
        if (pRaw) {
          try {
            const parsedP = JSON.parse(pRaw);
            savedAnswers = parsedP?.answers || [];
          } catch {
            /* ignore */
          }
        }

        const mapped = questions.map((q, idx) => {
          const userIdx = savedAnswers[idx];
          const opts = q.multiple_choice || q.options || [];
          const userOpt = userIdx !== undefined ? opts[userIdx] : null;
          const correctOpt = opts.find((o) => o.correct) || null;
          return {
            question: q.assessment || q.question || `Soal ${idx + 1}`,
            userAnswer: userOpt?.option || (userIdx === undefined ? "Tidak dijawab" : "Tidak diketahui"),
            userIndex: userIdx,
            correctAnswer: correctOpt?.option || "-",
            explanation: correctOpt?.explanation || userOpt?.explanation || "",
            isCorrect: userOpt?.correct === true,
            options: opts,
          };
        });

        setReviewItems(mapped);
      } catch (err) {
        setReviewError(err?.message || "Gagal memuat review soal");
      } finally {
        setReviewLoading(false);
      }
    };

    if (result) run();
  }, [result, currentTutorialId]); // deps tetap panjangnya

  if (loading) return <Loading fullScreen text="Memproses hasil..." />;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <Alert type="error" title="Hasil Tidak Ditemukan" message="Silakan coba kuis lagi" />
          <Button onClick={() => navigate("/home")} variant="primary" className="mt-4">
            Kembali ke Beranda
          </Button>
        </Card>
      </div>
    );
  }

  const correctAnswers = result.correct_count || result.benar || 0;
  const totalQuestions = result.total_questions || result.total || 0;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const duration = result.lama_mengerjakan || result.duration || "-";

  const feedback = result.feedback || {};
  const ringkasan = feedback.summary || feedback.ringkasan || "";
  const analisis = feedback.analysis || feedback.analisis || "";
  const saran = feedback.advice || feedback.saran || "";
  const rekomendasi = feedback.recommendation || feedback.rekomendasi || "";

  const variantClass =
    percentage >= 80
      ? "bg-green-50 border-green-200 text-green-800"
      : percentage >= 60
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-red-50 border-red-200 text-red-800";

  const handleRetry = () => {
    if (currentTutorialId) navigate(`/quiz-intro/${currentTutorialId}`);
  };

  const handleToggleReview = () => {
    setShowReview((prev) => !prev);
    if (!showReview) {
      const el = document.getElementById("detail-jawaban-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const targetId = currentTutorialId || tutorials?.[0]?.id;
  const goToLearning = () => {
    if (targetId) navigate(`/learning/${targetId}`);
    else navigate("/home");
  };

  return (
    <LearningLayout
      tutorials={tutorials}
      currentTutorial={currentTutorial}
      getTutorialProgress={getTutorialProgress}
      onSelectTutorial={(id) => navigate(`/learning/${id}`)}
      onHome={goToLearning}
      onMarkComplete={() => {}}
      onStartQuiz={handleRetry}
      isCompleted={getTutorialProgress(currentTutorial?.id)}
      showSidebar
      showBottomBar
    >
      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="max-w-5xl mx-auto px-4 pt-6">
          {/* Bar biru strip */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
          </div>

          {/* Hero putih */}
          <div className="bg-white rounded-b-3xl shadow-xl border border-gray-100 -mt-2 mb-6 px-6 py-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Quiz Submodul
              </p>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentTutorial?.title || "Submodul"}
              </h1>
              <div className="flex justify-center">
                <ResultBadge percentage={percentage} />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Skor Anda"
                value={`${correctAnswers}/${totalQuestions}`}
                sub="soal terjawab benar"
                color="text-blue-600"
              />
              <MetricCard
                label="Persentase"
                value={`${percentage}%`}
                sub="akurat menjawab"
                color={
                  percentage >= 80
                    ? "text-green-600"
                    : percentage >= 60
                    ? "text-amber-600"
                    : "text-red-600"
                }
              />
              <MetricCard label="Durasi" value={duration} sub="waktu pengerjaan" color="text-orange-600" />
            </div>
          </div>

          {/* Panel rekomendasi */}
          <div className={`rounded-2xl border ${variantClass} shadow-sm p-5 mb-6`}>
            <h2 className="text-lg font-bold mb-2">Perlu Belajar Lebih Lanjut</h2>
            <p className="text-sm mb-3">Anda perlu menjawab lebih banyak pertanyaan dengan benar.</p>
            <div className="border-t border-current/20 pt-3">
              <p className="font-semibold mb-1">Rekomendasi:</p>
              <p className="text-sm leading-relaxed">
                {rekomendasi || "Pelajari kembali materi terkait."}
              </p>
            </div>
          </div>

          {/* Feedback netral */}
          <Card className="mb-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback Anda</h2>
            <div className="divide-y divide-gray-100">
              {ringkasan && (
                <div className="py-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Ringkasan</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{ringkasan}</p>
                </div>
              )}
              {analisis && (
                <div className="py-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Analisis</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{analisis}</p>
                </div>
              )}
              {saran && (
                <div className="py-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Saran</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{saran}</p>
                </div>
              )}
              {rekomendasi && (
                <div className="py-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Rekomendasi</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{rekomendasi}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Detail Jawaban */}
          <Card className="mb-6 shadow-md" id="detail-jawaban-anchor">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detail Jawaban</h2>
            </div>
            {reviewLoading && <p className="text-sm text-gray-500">Memuat detail soal...</p>}
            {reviewError && <Alert type="error" title="Review tidak tersedia" message={reviewError} />}
            {!reviewLoading && !reviewError && reviewItems.length === 0 && (
              <p className="text-sm text-gray-500">Tidak ada data soal untuk ditampilkan.</p>
            )}
            {!reviewLoading && !reviewError && reviewItems.length > 0 && showReview && (
              <div className="space-y-3">
                {reviewItems.map((item, idx) => (
                  <AnswerReviewCard key={idx} item={item} index={idx} />
                ))}
              </div>
            )}
          </Card>

          {/* CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sticky bottom-4 bg-gray-50/80 py-2 backdrop-blur">
            <Button onClick={handleRetry} variant="primary" fullWidth type="button">
              Ulangi Kuis
            </Button>
            <Button onClick={handleToggleReview} variant="secondary" fullWidth type="button">
              {showReview ? "Tutup Review" : "Review Soal"}
            </Button>
          </div>
        </div>
      </div>
    </LearningLayout>
  );
};

export default ResultsPage;