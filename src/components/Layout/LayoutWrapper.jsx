import React, { useContext } from "react";
import Navbar from "../Layout/Navbar";
import Footer from "./Footer";
import { UserContext } from "../../context/UserContext";

const LayoutWrapper = ({
  children,
  showNavbar = true,
  showFooter = true,
  fullHeight = false,
}) => {
  const { preferences } = useContext(UserContext);

  const FONT_CLASS_MAP = {
    sans: "font-poppins", // default user
    serif: "font-serif",
    mono: "font-mono",
  };

  const FONT_SIZE_MAP = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const LAYOUT_WIDTH_MAP = {
    fluid: "max-w-full", // Full width
    boxed: "max-w-6xl", // Medium width
  };

  // Menentukan kelas font, font size dan layout width berdasarkan preferences
  const fontClass = FONT_CLASS_MAP[preferences.font] || "font-poppins";
  const fontSizeClass = FONT_SIZE_MAP[preferences.font_size] || "text-base"; // Default ke medium
  const layoutWidthClass =
    LAYOUT_WIDTH_MAP[preferences.layout_width] || "max-w-full"; // Default ke full

  return (
    <div
      className={`theme-${preferences.theme} ${fontClass} ${fontSizeClass} 
      
        relative min-h-screen bg-blue-50 dark:bg-gray-900 
        transition-all duration-300 ${fullHeight ? "h-screen" : ""}`}
    >
      {/* BACKGROUND IMAGE ONLY */}
      <img
        src="/assets/images/bg-pattern.svg"
        alt="bg-pattern"
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
      />

      {/* FOREGROUND CONTENT */}
      <div
        className={`relative z-10 flex flex-col min-h-screen transition-all duration-500 ${layoutWidthClass} mx-auto`}
      >
        {showNavbar && <Navbar />}

        <main className={fullHeight ? "flex-1 overflow-hidden" : "flex-1"}>
          {fullHeight ? (
            children
          ) : (
            <div className="container mx-auto px-4">{children}</div>
          )}
        </main>
      </div>
      <div>{showFooter && <Footer />}</div>
    </div>
  );
};

export default LayoutWrapper;
