import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";

const QuizShellPage = () => {
  const { tutorialId } = useParams();
  const [iframeSrc, setIframeSrc] = useState(`/quiz-player/${tutorialId}?embed=1`);

  useEffect(() => {
    const handler = (event) => {
      const data = event.data;
      if (!data || data.type !== "quiz-submitted") return;
      if (data.tutorialId?.toString() !== tutorialId?.toString()) return;

      if (data.result) {
        localStorage.setItem(`quiz-result-${tutorialId}`, JSON.stringify(data.result));
      }
      setIframeSrc(`/quiz-results-player/${tutorialId}?embed=1`);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [tutorialId]);

  const iframeStyles = useMemo(
    () => ({ width: "100%", height: "calc(100vh - 64px)", border: "none" }),
    []
  );

  return (
    <LayoutWrapper showNavbar showFooter={false} sidePanel={null} bottomBar={null} fullHeight embed={false}>
      <div className="w-full" style={{ minHeight: "calc(100vh - 64px)" }}>
        <iframe title="Quiz Player" src={iframeSrc} style={iframeStyles} />
      </div>
    </LayoutWrapper>
  );
};

export default QuizShellPage;