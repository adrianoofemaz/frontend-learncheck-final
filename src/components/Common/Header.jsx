import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const themes = [
    { name: 'Biru', value: 'blue' },
    { name: 'Ungu', value: 'purple' },
    { name: 'Hijau', value: 'green' },
    { name: 'Merah', value: 'red' },
  ];

  const handleThemeSelect = (theme) => {
    document. documentElement.setAttribute('data-theme', theme. value);
    localStorage.setItem('theme', theme. value);
    setShowThemeMenu(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur bg-white/90 transition-shadow border-b border-gray-200`}
      style={{ height: 64 }}
    >
      <div className="max-w-8xl mx-auto px-6 h-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl"></div>
          <h1 className="text-xl font-bold text-gray-900">Belajar Dasar AI</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(! showThemeMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Pilih Tema
            <ChevronDownIcon className="w-5 h-5" />
          </button>
          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {themes.map(t => (
                <button
                  key={t.value}
                  onClick={() => handleThemeSelect(t)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 font-medium text-gray-700"
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;