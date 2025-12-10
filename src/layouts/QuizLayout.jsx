import React, { useContext } from "react";
import Navbar from "../components/Layout/Navbar";
import { UserContext } from "../context/UserContext";

const QuizLayout = ({ children }) => {
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
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
};

export default QuizLayout;