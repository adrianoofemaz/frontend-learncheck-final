import React, { useContext } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../context/UserContext";

const ModuleSidebar = ({
  tutorials = [],
  currentTutorial,
  getTutorialProgress = () => false,
  onSelectTutorial = () => {},
  onSelectQuiz = () => {},
  isOpen = true,
  onClose = () => {},
  showQuizLink = true,
  activeQuizTutorialId = null,
}) => {
  const { preferences } = useContext(UserContext);
  const isDark = preferences?.theme === "dark";

  // Lock prefix: n buka hanya jika n-1 selesai
  const lastPrefixUnlocked = (() => {
    if (!tutorials.length) return 0;
    let limit = 0;
    for (let i = 1; i < tutorials.length; i += 1) {
      const prevId = tutorials[i - 1].id;
      if (getTutorialProgress(prevId)) limit = i;
      else break;
    }
    return limit;
  })();

  const getStatusColor = (tutorialId, isCompleted) => {
    if (isCompleted) return "text-green-500";
    if (currentTutorial?.id === tutorialId) return "text-blue-600";
    return "text-gray-400";
  };

  const getStatusIcon = (isCompleted, isCurrent) => {
    if (isCompleted) return "✓";
    if (isCurrent) return "▶";
    return "○";
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute ${
          isOpen ? "rounded-full translate-x-8" : "rounded-l-full translate-x-78"
        } p-2 bg-blue-900 w-8 z-50 top-20 right-76 transform transition-transform duration-300 ease-in-out text-gray-500 hover:text-gray-700 text-2xl cursor-pointer`}
      >
        {isOpen ? <ChevronRightIcon color="white" /> : <ChevronLeftIcon color="white" />}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed h-full top-0 right-0 w-80 pt-32 px-6 overflow-y-auto z-30 transform transition-transform duration-300 ease-in-out
        ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}
        ${isOpen ? "translate-x-0" : "translate-x-120"}`}
      >
        <div className="mb-2 pt-8 lg:pt-0">
          <h3 className="text-lg font-bold">Daftar Submodul</h3>
        </div>

        <div className="space-y-2 pb-10">
          {tutorials.map((tutorial, index) => {
            const isCompleted = getTutorialProgress(tutorial.id);
            const isCurrent = currentTutorial?.id === tutorial.id;
            const isLocked = index > lastPrefixUnlocked;
            const disabled = isLocked;

            const baseBtn = "w-full text-left px-4 py-3 rounded-lg transition-all";
            const enabledState = isCurrent
              ? "bg-blue-50 border border-blue-300"
              : "border border-transparent hover:bg-gray-100 hover:border-gray-200";
            const disabledState =
              "border border-transparent text-gray-400 cursor-not-allowed opacity-60 hover:bg-transparent hover:border-transparent";

            return (
              <div key={tutorial.id}>
                <button
                  onClick={() => {
                    if (disabled) return;
                    onSelectTutorial(tutorial.id);
                    onClose();
                  }}
                  disabled={disabled}
                  className={`${baseBtn} ${disabled ? disabledState : enabledState}`}
                  title={isLocked ? "Selesaikan submodul sebelumnya untuk membuka ini" : ""}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xl font-bold ${getStatusColor(
                        tutorial.id,
                        isCompleted
                      )}`}
                    >
                      {getStatusIcon(isCompleted, isCurrent)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrent
                            ? isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                            : isDark
                            ? "text-blue-200"
                            : "text-gray-900"
                        }`}
                      >
                        {tutorial.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isCompleted
                          ? "Selesai"
                          : isCurrent
                          ? "Sedang Dipelajari"
                          : isLocked
                          ? "Terkunci"
                          : "Belum Dimulai"}
                      </p>
                    </div>
                  </div>
                </button>

                {isCurrent && showQuizLink && (
                  <button
                    onClick={() => onSelectQuiz(tutorial.id)}
                    className={`w-full text-left px-4 py-2 ml-4 mt-1 text-xs rounded ${
                      activeQuizTutorialId === tutorial.id
                        ? "text-blue-700 font-semibold bg-blue-50"
                        : "text-blue-600 hover:text-blue-700 hover:bg-blue-100 cursor-pointer"
                    }`}
                  >
                    → Quiz Submodul #{index + 1}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default ModuleSidebar;