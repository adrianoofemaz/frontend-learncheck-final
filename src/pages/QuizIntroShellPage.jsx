import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";
import { ROUTES } from "../constants/routes";

const fillRoute = (pattern, params) =>
  Object.entries(params).reduce((p, [k, v]) => p.replace(`:${k}`, v), pattern);

const QuizIntroShellPage = () => {
  const { tutorialId } = useParams();
  const navigate = useNavigate();
  const { tutorials, fetchTutorials } = useLearning();
  const { getTutorialProgress } = useProgress();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!tutorials || tutorials.length === 0) {
      fetchTutorials(1).catch((err) => console.warn("Fetch tutorials failed", err));
    }
  }, [tutorials, fetchTutorials]);

  const currentId = parseInt(tutorialId, 10);
  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );
  const chain = buildChain(tutorials, currentId);

  // Back: kembali ke submodul (learning) yang sama
  const goBackChain = () => {
    navigate(fillRoute(ROUTES.LEARNING, { id: currentId }));
  };

  // Next: lanjut ke shell player quiz
  const goNextChain = () => {
    navigate(fillRoute(ROUTES.QUIZ, { tutorialId: currentId }));
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") navigate(fillRoute(ROUTES.LEARNING, { id: item.id }));
    else if (item.type === "quiz-sub") navigate(fillRoute(ROUTES.QUIZ_INTRO_SHELL, { tutorialId: item.id }));
    else if (item.type === "quiz-final") navigate(ROUTES.QUIZ_FINAL_INTRO);
    else if (item.type === "dashboard") navigate(ROUTES.DASHBOARD_MODUL);
  };

  const iframeStyles = useMemo(
    () => ({ width: "100%", height: "calc(100vh - 64px)", border: "none" }),
    []
  );

  return (
    <LayoutWrapper
      showNavbar
      showFooter={false}
      sidePanel={
        <ModuleSidebar
          items={sidebarItems}
          currentId={currentId}
          currentType="quiz-sub"
          onSelect={handleSelectSidebar}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
        />
      }
      bottomBar={
        <BottomBarTwoActions
          leftLabel="← Kembali"
          rightLabel="Mulai Kuis →"
          onLeft={goBackChain}
          onRight={goNextChain}
        />
      }
      fullHeight
      embed={false}
      contentClassName={sidebarOpen ? "pr-80" : ""}
    >
      <div className="w-full" style={{ minHeight: "calc(100vh - 64px)" }}>
        <iframe
          title="Quiz Intro Player"
          src={`${fillRoute(ROUTES.QUIZ_INTRO, { tutorialId })}?embed=1`}
          style={iframeStyles}
        />
      </div>
    </LayoutWrapper>
  );
};

export default QuizIntroShellPage;