import React from "react";
import Navbar from "../components/Layout/Navbar";

const QuizLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-blue-50 dark:bg-gray-900 transition-all duration-300">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default QuizLayout;