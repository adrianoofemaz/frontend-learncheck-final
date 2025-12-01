/**
 * LayoutWrapper Component
 * Main layout wrapper dengan Navbar, Sidebar, Footer
 */

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const LayoutWrapper = ({
  children,
  showNavbar = true,
  showSidebar = true,
  showFooter = true,
  showBottomNav = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      {showNavbar && <Navbar />}

      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default LayoutWrapper;