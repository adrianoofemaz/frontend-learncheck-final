import React, { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import ModuleSidebar from "../components/layout/ModuleSidebar";
import LearningBottomBar from "../components/layout/LearningBottomBar";

const LearningLayout = ({
  children,
  showSidebar = true,
  showBottomBar = true,
  tutorials = [],
  currentTutorial,
  getTutorialProgress,
  onSelectTutorial,
  onSelectQuiz = () => {},   // handler quiz
  onHome = () => {},
  onMarkComplete = () => {},
  onStartQuiz = () => {},
  isCompleted = false,
  showQuizLink = true,
  activeQuizTutorialId = null, // quiz intro marker
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="relative min-h-screen bg-blue-50 dark:bg-gray-900 transition-all duration-300">
      <Navbar />
      <div className="flex h-screen pt-16">
        <div
          className={`flex-1 overflow-y-auto pb-24 ${
            showSidebar && sidebarOpen ? "pr-80" : ""
          } transition-all duration-300`}
        >
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">{children}</div>
        </div>

        {showSidebar && (
          <ModuleSidebar
            tutorials={tutorials}
            currentTutorial={currentTutorial}
            getTutorialProgress={getTutorialProgress}
            onSelectTutorial={onSelectTutorial}
            onSelectQuiz={onSelectQuiz}
            isOpen={sidebarOpen}
            onClose={toggleSidebar}
            showQuizLink={showQuizLink}
            activeQuizTutorialId={activeQuizTutorialId}
          />
        )}
      </div>

      {showBottomBar && (
        <LearningBottomBar
          onHome={onHome}
          onMarkComplete={onMarkComplete}
          onStartQuiz={onStartQuiz}
          isCompleted={isCompleted}
          onToggleSidebar={toggleSidebar}
        />
      )}
    </div>
  );
};

export default LearningLayout;