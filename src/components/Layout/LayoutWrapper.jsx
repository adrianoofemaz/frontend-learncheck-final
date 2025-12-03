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
  fullHeight = false,
}) => {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${fullHeight ? 'h-screen' : ''}`}>
      {/* Navbar */}
      {showNavbar && <Navbar />}

      {/* Main Content - dengan padding bottom untuk fixed BottomNav */}
      <main className={`${fullHeight ? 'flex-1 overflow-hidden' : 'flex-1'}`}>
        {fullHeight ? (
          children
        ) : (
          <div className="container mx-auto px-4">
            {children}
          </div>
        )}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Bottom Navigation - FIXED */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default LayoutWrapper;