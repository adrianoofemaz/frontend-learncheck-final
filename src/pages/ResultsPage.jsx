import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";
import ResultCard from "../components/Features/feedback/ResultCard";
import AnswerReview from "../components/Features/feedback/AnswerReview";
import Button from "../components/common/Button";

const ResultsPage = () => {
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const location = useLocation();
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const reviewRef = useRef(null);

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

  const goBackChain = () => {
    if (chain.idx <= 0) {
      navigate("/home");
      return;
    }
    const prev = tutorials[chain.idx - 1];
    navigate(`/learning/${prev.id}`);
  };

  const goNextChain = () => {
    if (chain.idx < chain.total - 1) {
      const next = tutorials[chain.idx + 1];
      navigate(`/learning/${next.id}`);
      return;
    }
    navigate("/quiz-final-intro");
  };

  const isPass = total > 0 ? (correct / total) * 100 >= 60 : false;

  const handleReview = () => {
    setShowReview(true);
    setTimeout(() => {
      if (reviewRef.current) reviewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <LayoutWrapper
      embed={embed}
      showNavbar={true}
      showFooter={false}
      contentClassName={`pt-14 pb-24 ${sidebarOpen ? "pr-80" : ""}`}
      sidePanel={
        <ModuleSidebar
          items={sidebarItems}
          currentId={currentId}
          onSelect={(item) => {
            if (item.type === "tutorial") navigate(`/learning/${item.id}`);
            else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
            else if (item.type === "quiz-final") navigate("/quiz-final-intro");
            else if (item.type === "dashboard") navigate("/dashboard-modul");
          }}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
        />
      }
      bottomBar={
        <BottomBarTwoActions
          leftLabel="← Kembali"
          rightLabel={chain.idx < chain.total - 1 ? "Lanjut →" : "Quiz Final →"}
          onLeft={goBackChain}
          onRight={goNextChain}
        />
      }
    >
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ResultCard
            score={score}
            correct={correct}
            total={total}
            duration={duration}
            isPass={isPass}
            onRetry={() => navigate(`/quiz-intro/${tutorialId}`)}
            onReview={handleReview}
          />

          {(ringkasan || analisis || saran || rekomendasi) && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Perlu Belajar Lebih Lanjut</h3>
              {ringkasan && <p className="text-red-800 mb-3">{ringkasan}</p>}
              {analisis && (
                <p className="text-red-800 mb-3">
                  <span className="font-semibold">Analisis: </span>
                  {analisis}
                </p>
              )}
              {saran && (
                <p className="text-red-800 mb-3">
                  <span className="font-semibold">Saran: </span>
                  {saran}
                </p>
              )}
              {rekomendasi && (
                <p className="text-red-800">
                  <span className="font-semibold">Rekomendasi: </span>
                  {rekomendasi}
                </p>
              )}
            </div>
          )}

          {showReview && (
            <div ref={reviewRef} className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Detail Jawaban</h3>
                <Button variant="secondary" className="cursor-pointer" onClick={() => setShowReview(false)}>
                  Tutup Review
                </Button>
              </div>
              <AnswerReview answers={answers} questions={questions} />
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ResultsPage;