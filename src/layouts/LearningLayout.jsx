import React, { useState, useContext } from "react";
import Navbar from "../components/Layout/Navbar";
import ModuleSidebar from "../components/layout/ModuleSidebar";
import LearningBottomBar from "../components/layout/LearningBottomBar";
import { UserContext } from "../context/UserContext";

const LearningLayout = ({
  children,
  showSidebar = true,
  showBottomBar = true,
  showMarkComplete = true,
  tutorials = [],
  currentTutorial,
  getTutorialProgress,
  onSelectTutorial,
  onSelectQuiz = () => {},
  onHome = () => {},
  onMarkComplete = () => {},
  onStartQuiz = () => {},
  isCompleted = false,
  showQuizLink = true,
  activeQuizTutorialId = null,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const { preferences } = useContext(UserContext);
  const isDark = preferences?.theme === "dark";
  const bgOverlay = isDark ? "opacity-25 mix-blend-soft-light" : "opacity-80 mix-blend-multiply";

  return (
    <div className="relative min-h-screen bg-blue-50 dark:bg-gray-900 transition-all duration-300">
      <img
        src="/assets/images/bg-pattern.svg"
        alt="bg-pattern"
        aria-hidden="true"
        className={`pointer-events-none select-none absolute top-0 left-0 w-full h-full object-cover z-0 ${bgOverlay}`}
      />
      <div className="relative z-10">
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
            showMarkComplete={showMarkComplete}
          />
        )}
      </div>
    </div>
  );
};

export default LearningLayout;