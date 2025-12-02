/**
 * Navbar Component
 * Top navigation bar - Sesuai Figma design dari backup-learncheck-1
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              LearnCheck
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold text-sm">
                      Halo, {user?. name || 'User'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {user?.name + '@email.com'}
                    </p>
                  </div>
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="secondary" size="sm">
                  Masuk
                </Button>
                <Button onClick={() => navigate('/register')} variant="primary" size="sm">
                  Daftar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(! mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-semibold text-sm">
                    Halo, {user?.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {user?.name + '@email.com'}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  fullWidth
                  className="text-red-600 hover:text-red-700 border-red-200 justify-center"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="secondary"
                  fullWidth
                >
                  Masuk
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="primary"
                  fullWidth
                >
                  Daftar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;