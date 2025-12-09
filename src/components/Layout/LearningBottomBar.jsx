import React, { useContext } from "react";
import Button from "../common/Button";
import { UserContext } from "../../context/UserContext";

const LearningBottomBar = ({
  onHome = () => {},
  onMarkComplete = () => {},
  onStartQuiz = () => {},
  isCompleted = false,
  onToggleSidebar = () => {},
  showMarkComplete = true, // baru: kontrol tampil/tidak tombol Tandai Selesai
}) => {
  const { preferences } = useContext(UserContext);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t px-8 py-4 z-40
        ${
          preferences?.theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button onClick={onHome} variant="secondary" className="flex items-center gap-2 cursor-pointer">
          ← Kembali
        </Button>

        <div className="flex gap-4">
          {!isCompleted && showMarkComplete && (
            <Button onClick={onMarkComplete} variant="secondary" className="cursor-pointer">
              ✓ Tandai Selesai
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Button onClick={onStartQuiz} variant="primary" className="flex items-center gap-2 cursor-pointer">
            Selanjutnya →
          </Button>

          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            title="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningBottomBar;