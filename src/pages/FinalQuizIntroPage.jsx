import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const FinalQuizIntroPage = () => {
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
    // kembali ke submodul terakhir (quiz result terakhir)
    if (tutorials.length === 0) {
      navigate("/home");
      return;
    }
    const last = tutorials[tutorials.length - 1];
    navigate(`/quiz-results/${last.id}`);
  };

  const goNextChain = () => {
    navigate("/quiz-final"); // mulai iframe quiz final
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
            rightLabel="Mulai Quiz Final →"
            onLeft={goBackChain}
            onRight={goNextChain}
          />
        ) : null
      }
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <h1 className="text-3xl font-bold mb-4">Quiz Akhir Modul</h1>
          <p className="text-gray-700 mb-6">
            10 soal, waktu total 10 menit. Navigasi bebas, feedback muncul
            setelah submit.
          </p>
          <Button onClick={goNextChain}>Mulai Quiz Final</Button>
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default FinalQuizIntroPage;
