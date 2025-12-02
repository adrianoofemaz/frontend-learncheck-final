/**
 * LayoutWrapper Component
 * Main layout wrapper dengan Navbar, Footer
 * Sidebar TIDAK ada di sini
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const LayoutWrapper = ({
  children,
  showNavbar = true,
  showFooter = true,
  showBottomNav = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      {showNavbar && <Navbar />}

      {/* Main Content - FULL WIDTH */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default LayoutWrapper;