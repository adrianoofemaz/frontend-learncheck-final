import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import ResultCard from "../components/features/feedback/ResultCard";
import AnswerReview from "../components/features/feedback/AnswerReview";

const FinalQuizResultPage = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showReview, setShowReview] = useState(false);

  const {
    score = 0,
    correct = 0,
    total = 0,
    duration = 0,
    answers = [],
    questions = [],
  } = state || {};

  const answersList = useMemo(() => {
    if (Array.isArray(answers)) return answers;
    return Object.entries(answers || {}).map(([idx, val]) => {
      const q = questions?.[idx];
      const sel = q?.multiple_choice?.[val];
      return {
        questionId: q?.id ?? Number(idx),
        selectedIndex: val ?? null,
        selectedOption: sel?.option || sel?.answer || "",
        correct: !!sel?.correct,
      };
    });
  }, [answers, questions]);

  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );

  const goBackChain = () => {
    if (tutorials.length === 0) {
      navigate("/home");
      return;
    }
    const last = tutorials[tutorials.length - 1];
    navigate(`/learning/${last.id}`);
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") navigate(`/learning/${item.id}`);
    else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
    else if (item.type === "quiz-final") navigate("/quiz-final-intro");
    else if (item.type === "dashboard") navigate("/dashboard-modul");
  };

  useEffect(() => {
    if (!state) {
      navigate("/dashboard-modul");
    }
  }, [state, navigate]);

  const handleDashboard = () => {
    navigate("/dashboard-modul", {
      state: { score, correct, total, duration },
    });
  };

  return (
    <LayoutWrapper
      embed={embed}
      contentClassName={`pt-20 pb-24 ${
        sidebarOpen ? "pr-80" : ""
      } transition-all duration-300`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={null}
            onSelect={handleSelectSidebar}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Kembali"
            rightLabel="Selesai"
            onLeft={goBackChain}
            onRight={() => navigate("/home")}
          />
        ) : null
      }
    >
      <div className="max-w-3xl mx-auto py-10 space-y-8">
        <ResultCard
          title="Quiz Akhir Modul"
          subtitle="Penerapan AI dalam Dunia Nyata"
          score={score}
          correct={correct}
          total={total}
          duration={duration}
          isPass={score >= 70}
          onRetry={() => navigate("/quiz-final-intro")}
          onReview={() => setShowReview((v) => !v)}
          onDashboard={handleDashboard} // tombol Dashboard di samping Review
          reviewLabel={showReview ? "Tutup Review" : "Review Soal"}
          dashboardLabel="Dashboard"
        />

        {showReview && (
          <AnswerReview answers={answersList} questions={questions} />
        )}
      </div>
    </LayoutWrapper>
  );
};

export default FinalQuizResultPage;
