import React, { useMemo, useState } from "react";
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
            onSelect={(item) => {
              if (item.type === "tutorial") navigate(`/learning/${item.id}`);
              else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
              else if (item.type === "quiz-final") navigate("/quiz-final-intro");
              else if (item.type === "dashboard") navigate("/dashboard-modul");
            }}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Kembali"
            rightLabel={chain.idx < chain.total - 1 ? "Lanjut →" : "Quiz Final →"}
            onLeft={goBackChain}
            onRight={goNextChain}
          />
        ) : null
      }
    >
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero result */}
          <ResultCard
            score={score}
            correct={correct}
            total={total}
            duration={duration}
            isPass={isPass}
          />

          {/* Feedback / rekomendasi */}
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

          {/* Answer review */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <Button variant="secondary" className="cursor-pointer" onClick={goBackChain}>
                Coba Lagi
              </Button>
              <Button
                variant="primary"
                className="cursor-pointer"
                onClick={() => navigate(`/learning/${currentId}`)}
              >
                Tutup Review
              </Button>
            </div>
            <div className="border-t border-dashed border-blue-200 my-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Detail Jawaban</h3>
            <AnswerReview answers={answers} questions={questions} />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ResultsPage;