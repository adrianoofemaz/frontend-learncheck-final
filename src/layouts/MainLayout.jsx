import React, { useContext } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/layout/Footer";
import { UserContext } from "../context/UserContext";

const MainLayout = ({ children }) => {
  const { preferences } = useContext(UserContext);
const isDark = preferences?.theme === "dark";
const bgOverlay = isDark ? "opacity-40" : "opacity-80 mix-blend-multiply";

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
        <main className="pt-16">
          <div className="container mx-auto px-4">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;