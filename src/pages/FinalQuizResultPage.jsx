import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import ResultCard from "../components/Features/feedback/ResultCard";
import AnswerReview from "../components/Features/feedback/AnswerReview";

const FinalQuizResultPage = ({ score, correct, total, duration, answers, questions }) => {
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    navigate(`/learning/${last.id}`); // atau quiz result terakhir; sesuaikan jika perlu
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") navigate(`/learning/${item.id}`);
    else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
    else if (item.type === "quiz-final") navigate("/quiz-final-intro");
    else if (item.type === "dashboard") navigate("/dashboard-modul");
  };

  return (
    <LayoutWrapper
      embed={embed}
      contentClassName={`pt-20 pb-24 ${sidebarOpen ? "pr-80" : ""} transition-all duration-300`}
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
        <ResultCard score={score} correct={correct} total={total} duration={duration} />
        <AnswerReview answers={answers} questions={questions} />
      </div>
    </LayoutWrapper>
  );
};

export default FinalQuizResultPage;