import React from 'react';
import { ChevronRightIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import ModuleList from '../Navigation/ModuleList';

const Sidebar = ({ isOpen, onToggle }) => {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-20 w-12 h-12 rounded-l-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition z-30"
        aria-label="Buka Sidebar"
      >
        <ListBulletIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <aside
      className="bg-white border-l border-gray-200 shadow-sm flex flex-col"
      style={{
        height: 'calc(100vh - 64px)',
        width: '320px'
      }}
    >
      {/* Toggle Button - Same size as show button */}
      <div className="flex justify-start p-3">
        <button
          onClick={onToggle}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition"
          aria-label="Tutup Sidebar"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Module List */}
      <div className="flex-1 overflow-y-auto pb-20">
        <ModuleList />
      </div>
    </aside>
  );
};

export default Sidebar;