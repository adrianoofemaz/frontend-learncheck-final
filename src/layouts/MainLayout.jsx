import React from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-blue-50 dark:bg-gray-900 transition-all duration-300">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;