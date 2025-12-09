import React, { useContext } from "react";
import Navbar from "../Layout/Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { UserContext } from "../../context/UserContext";

const LayoutWrapper = ({
  children,
  showNavbar = true,
  showFooter = true,
  showBottomNav = true,
  fullHeight = false,
}) => {
  const { preferences } = useContext(UserContext); // Mengambil preferensi dari context

  return (
    <div
      className={`theme-${
        preferences.theme
      } relative min-h-screen bg-blue-50 dark:bg-gray-900 transition-all duration-300 ${
        fullHeight ? "h-screen" : ""
      }`}
    >
      {/* BACKGROUND IMAGE ONLY */}
      <img
        src="/assets/images/bg-pattern.svg"
        alt="bg-pattern"
        aria-hidden="true"
        className="pointer-events-none select-none
                   absolute top-0 left-0 w-full h-full    
                   object-cover opacity-20 z-0"
      />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {showNavbar && <Navbar />}

        <main className={`${fullHeight ? "flex-1 overflow-hidden" : "flex-1"}`}>
          {fullHeight ? (
            children
          ) : (
            <div className="container mx-auto px-4">{children}</div>
          )}
        </main>

        {showFooter && <Footer />}
      </div>

      {/* BottomNav jika ada */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default LayoutWrapper;
